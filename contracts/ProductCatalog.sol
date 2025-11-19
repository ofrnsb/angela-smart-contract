// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ProductCatalog
 * @dev Store products (id, provider, priceInIDR) that can be purchased
 */
contract ProductCatalog is AccessControl {
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");
    
    struct Product {
        uint256 id;
        string name;
        address provider;
        uint256 priceInIDR;
        bool active;
        string description;
        uint256 createdAt;
    }
    
    mapping(uint256 => Product) public products;
    uint256[] public productIds;
    
    event ProductAdded(
        uint256 indexed productId,
        string name,
        address indexed provider,
        uint256 priceInIDR,
        uint256 timestamp
    );
    
    event ProductUpdated(
        uint256 indexed productId,
        bool active,
        uint256 timestamp
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Add a product
     * @param productId Product ID
     * @param name Product name
     * @param provider Provider address
     * @param priceInIDR Price in IDR
     * @param description Product description
     */
    function addProduct(
        uint256 productId,
        string memory name,
        address provider,
        uint256 priceInIDR,
        string memory description
    ) external onlyRole(BANK_ROLE) {
        require(products[productId].id == 0, "Product already exists");
        require(priceInIDR > 0, "Price must be greater than 0");
        
        products[productId] = Product({
            id: productId,
            name: name,
            provider: provider,
            priceInIDR: priceInIDR,
            active: true,
            description: description,
            createdAt: block.timestamp
        });
        
        productIds.push(productId);
        
        emit ProductAdded(productId, name, provider, priceInIDR, block.timestamp);
    }
    
    /**
     * @dev Update product status
     * @param productId Product ID
     * @param active Active status
     */
    function updateProductStatus(uint256 productId, bool active) 
        external 
        onlyRole(BANK_ROLE) 
    {
        require(products[productId].id != 0, "Product does not exist");
        products[productId].active = active;
        emit ProductUpdated(productId, active, block.timestamp);
    }
    
    /**
     * @dev Get product details
     */
    function getProduct(uint256 productId) external view returns (Product memory) {
        require(products[productId].id != 0, "Product does not exist");
        return products[productId];
    }
    
    /**
     * @dev Get all product IDs
     */
    function getAllProductIds() external view returns (uint256[] memory) {
        return productIds;
    }
    
    /**
     * @dev Get active products only
     */
    function getActiveProducts() external view returns (uint256[] memory) {
        uint256[] memory activeIds = new uint256[](productIds.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < productIds.length; i++) {
            if (products[productIds[i]].active) {
                activeIds[count] = productIds[i];
                count++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeIds[i];
        }
        
        return result;
    }
}

