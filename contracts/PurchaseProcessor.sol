// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IDRToken.sol";
import "./AccountRegistry.sol";
import "./ProductCatalog.sol";

/**
 * @title PurchaseProcessor
 * @dev Handle purchase lifecycle: escrow funds, emit PurchaseCommitted, provider marks fulfilled/failed
 */
contract PurchaseProcessor is AccessControl, ReentrancyGuard {
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");
    
    IDRToken public idrToken;
    AccountRegistry public accountRegistry;
    ProductCatalog public productCatalog;
    
    enum OrderStatus {
        Pending,
        Fulfilled,
        Failed,
        Refunded
    }
    
    struct PurchaseOrder {
        uint256 orderId;
        string buyerAccount;
        address buyerAddress;
        uint256 productId;
        uint256 amount;
        address provider;
        OrderStatus status;
        uint256 createdAt;
        uint256 timeoutAt;
        uint256 fulfilledAt;
    }
    
    mapping(uint256 => PurchaseOrder) public orders;
    uint256 public nextOrderId;
    uint256 public timeoutSeconds;
    
    event PurchaseCommitted(
        uint256 indexed orderId,
        string indexed buyerAccount,
        uint256 indexed productId,
        uint256 amount,
        address provider,
        uint256 timestamp
    );
    
    event PurchaseFulfilled(
        uint256 indexed orderId,
        address indexed provider,
        uint256 timestamp
    );
    
    event PurchaseFailed(
        uint256 indexed orderId,
        address indexed provider,
        string reason,
        uint256 timestamp
    );
    
    event PurchaseRefunded(
        uint256 indexed orderId,
        string indexed buyerAccount,
        uint256 amount,
        uint256 timestamp
    );
    
    constructor(
        address _idrToken,
        address _accountRegistry,
        address _productCatalog,
        uint256 _timeoutSeconds
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        idrToken = IDRToken(_idrToken);
        accountRegistry = AccountRegistry(_accountRegistry);
        productCatalog = ProductCatalog(_productCatalog);
        timeoutSeconds = _timeoutSeconds;
    }
    
    /**
     * @dev Create a purchase order
     * @param buyerAccount Buyer account number
     * @param productId Product ID to purchase
     * @return orderId Created order ID
     */
    function createPurchase(
        string memory buyerAccount,
        uint256 productId
    ) external nonReentrant returns (uint256) {
        require(accountRegistry.accounts(buyerAccount).exists, "Buyer account does not exist");
        
        ProductCatalog.Product memory product = productCatalog.getProduct(productId);
        require(product.active, "Product is not active");
        
        (address buyerAddress, ) = accountRegistry.resolveAccount(buyerAccount);
        require(idrToken.balanceOf(buyerAddress) >= product.priceInIDR, "Insufficient balance");
        
        // Escrow: transfer tokens to contract (requires approval first)
        // In production, buyer should approve PurchaseProcessor before calling createPurchase
        idrToken.transferFrom(buyerAddress, address(this), product.priceInIDR);
        
        uint256 orderId = nextOrderId++;
        orders[orderId] = PurchaseOrder({
            orderId: orderId,
            buyerAccount: buyerAccount,
            buyerAddress: buyerAddress,
            productId: productId,
            amount: product.priceInIDR,
            provider: product.provider,
            status: OrderStatus.Pending,
            createdAt: block.timestamp,
            timeoutAt: block.timestamp + timeoutSeconds,
            fulfilledAt: 0
        });
        
        emit PurchaseCommitted(
            orderId,
            buyerAccount,
            productId,
            product.priceInIDR,
            product.provider,
            block.timestamp
        );
        
        return orderId;
    }
    
    /**
     * @dev Mark purchase as fulfilled
     * @param orderId Order ID
     */
    function markFulfilled(uint256 orderId) external onlyRole(PROVIDER_ROLE) nonReentrant {
        PurchaseOrder storage order = orders[orderId];
        require(order.orderId == orderId, "Order does not exist");
        require(order.status == OrderStatus.Pending, "Order not in pending status");
        require(order.provider == msg.sender, "Only provider can fulfill");
        require(block.timestamp < order.timeoutAt, "Order expired");
        
        order.status = OrderStatus.Fulfilled;
        order.fulfilledAt = block.timestamp;
        
        // Release escrow to provider
        idrToken.transfer(order.provider, order.amount);
        
        emit PurchaseFulfilled(orderId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Mark purchase as failed
     * @param orderId Order ID
     * @param reason Failure reason
     */
    function markFailed(uint256 orderId, string memory reason) 
        external 
        onlyRole(PROVIDER_ROLE) 
        nonReentrant 
    {
        PurchaseOrder storage order = orders[orderId];
        require(order.orderId == orderId, "Order does not exist");
        require(order.status == OrderStatus.Pending, "Order not in pending status");
        require(order.provider == msg.sender, "Only provider can fail");
        
        order.status = OrderStatus.Failed;
        
        // Refund to buyer
        idrToken.transfer(order.buyerAddress, order.amount);
        
        emit PurchaseFailed(orderId, msg.sender, reason, block.timestamp);
    }
    
    /**
     * @dev Refund expired orders
     * @param orderId Order ID
     */
    function refundExpired(uint256 orderId) external nonReentrant {
        PurchaseOrder storage order = orders[orderId];
        require(order.orderId == orderId, "Order does not exist");
        require(order.status == OrderStatus.Pending, "Order not in pending status");
        require(block.timestamp >= order.timeoutAt, "Order not expired yet");
        
        order.status = OrderStatus.Refunded;
        
        // Refund to buyer
        idrToken.transfer(order.buyerAddress, order.amount);
        
        emit PurchaseRefunded(orderId, order.buyerAccount, order.amount, block.timestamp);
    }
    
    /**
     * @dev Get order details
     */
    function getOrder(uint256 orderId) external view returns (PurchaseOrder memory) {
        require(orders[orderId].orderId == orderId, "Order does not exist");
        return orders[orderId];
    }
    
    /**
     * @dev Get pending orders for a provider
     */
    function getPendingOrdersForProvider(address provider) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory pendingIds = new uint256[](nextOrderId);
        uint256 count = 0;
        
        for (uint256 i = 0; i < nextOrderId; i++) {
            if (
                orders[i].provider == provider && 
                orders[i].status == OrderStatus.Pending
            ) {
                pendingIds[count] = i;
                count++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = pendingIds[i];
        }
        
        return result;
    }
}

