// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IDRToken.sol";
import "./AccountRegistry.sol";

/**
 * @title InterbankSettlement
 * @dev Simulate interbank transfer proposal + k-of-n validator approval flow
 */
contract InterbankSettlement is AccessControl, ReentrancyGuard {
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    
    IDRToken public idrToken;
    AccountRegistry public accountRegistry;
    
    struct TransferRequest {
        uint256 id;
        string fromAccount;
        string toAccount;
        uint256 amount;
        address proposerBank;
        uint256 approvals;
        mapping(address => bool) approvedBy;
        bool executed;
        uint256 createdAt;
        uint256 timeoutAt;
    }
    
    mapping(uint256 => TransferRequest) public transferRequests;
    uint256 public nextRequestId;
    uint256 public approvalThreshold;
    uint256 public timeoutSeconds;
    
    event TransferProposed(
        uint256 indexed requestId,
        string indexed fromAccount,
        string indexed toAccount,
        uint256 amount,
        address proposerBank,
        uint256 timestamp
    );
    
    event TransferApproved(
        uint256 indexed requestId,
        address indexed validator,
        uint256 approvals,
        uint256 timestamp
    );
    
    event InterbankSettled(
        uint256 indexed requestId,
        string indexed fromAccount,
        string indexed toAccount,
        uint256 amount,
        uint256 timestamp
    );
    
    event TransferCancelled(
        uint256 indexed requestId,
        address indexed cancelledBy,
        uint256 timestamp
    );
    
    constructor(
        address _idrToken,
        address _accountRegistry,
        uint256 _approvalThreshold,
        uint256 _timeoutSeconds
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        idrToken = IDRToken(_idrToken);
        accountRegistry = AccountRegistry(_accountRegistry);
        approvalThreshold = _approvalThreshold;
        timeoutSeconds = _timeoutSeconds;
    }
    
    /**
     * @dev Propose an interbank transfer
     * @param fromAccount Source account number
     * @param toAccount Destination account number
     * @param amount Transfer amount
     */
    function proposeTransfer(
        string memory fromAccount,
        string memory toAccount,
        uint256 amount
    ) external onlyRole(BANK_ROLE) {
        require(amount > 0, "Amount must be greater than 0");
        
        (address fromAddress, address fromBank) = accountRegistry.resolveAccount(fromAccount);
        (address toAddress, address toBank) = accountRegistry.resolveAccount(toAccount);
        
        require(fromBank == msg.sender, "Can only propose transfers from own bank");
        require(fromBank != toBank, "Use intra-bank transfer for same bank");
        require(idrToken.balanceOf(fromAddress) >= amount, "Insufficient balance");
        
        // Escrow: transfer tokens to this contract
        idrToken.transferFrom(fromAddress, address(this), amount);
        
        uint256 requestId = nextRequestId++;
        TransferRequest storage request = transferRequests[requestId];
        request.id = requestId;
        request.fromAccount = fromAccount;
        request.toAccount = toAccount;
        request.amount = amount;
        request.proposerBank = msg.sender;
        request.approvals = 0;
        request.executed = false;
        request.createdAt = block.timestamp;
        request.timeoutAt = block.timestamp + timeoutSeconds;
        
        emit TransferProposed(requestId, fromAccount, toAccount, amount, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Approve a transfer request
     * @param requestId Transfer request ID
     */
    function approveTransfer(uint256 requestId) external onlyRole(VALIDATOR_ROLE) {
        TransferRequest storage request = transferRequests[requestId];
        require(request.id == requestId, "Request does not exist");
        require(!request.executed, "Transfer already executed");
        require(block.timestamp < request.timeoutAt, "Transfer request expired");
        require(!request.approvedBy[msg.sender], "Already approved");
        
        request.approvedBy[msg.sender] = true;
        request.approvals++;
        
        emit TransferApproved(requestId, msg.sender, request.approvals, block.timestamp);
        
        // Auto-execute if threshold reached
        if (request.approvals >= approvalThreshold) {
            _executeTransfer(requestId);
        }
    }
    
    /**
     * @dev Execute transfer after approvals
     */
    function _executeTransfer(uint256 requestId) internal nonReentrant {
        TransferRequest storage request = transferRequests[requestId];
        require(!request.executed, "Already executed");
        require(request.approvals >= approvalThreshold, "Insufficient approvals");
        
        request.executed = true;
        
        (address fromAddress, ) = accountRegistry.resolveAccount(request.fromAccount);
        (address toAddress, ) = accountRegistry.resolveAccount(request.toAccount);
        
        // Release escrowed tokens to destination
        idrToken.transfer(toAddress, request.amount);
        
        emit InterbankSettled(
            requestId,
            request.fromAccount,
            request.toAccount,
            request.amount,
            block.timestamp
        );
    }
    
    /**
     * @dev Cancel a transfer request (governance or after timeout)
     * @param requestId Transfer request ID
     */
    function cancelTransfer(uint256 requestId) external {
        TransferRequest storage request = transferRequests[requestId];
        require(request.id == requestId, "Request does not exist");
        require(!request.executed, "Transfer already executed");
        
        require(
            hasRole(GOVERNANCE_ROLE, msg.sender) || block.timestamp >= request.timeoutAt,
            "Not authorized to cancel"
        );
        
        emit TransferCancelled(requestId, msg.sender, block.timestamp);
        delete transferRequests[requestId];
    }
    
    /**
     * @dev Get transfer request details
     */
    function getTransferRequest(uint256 requestId) 
        external 
        view 
        returns (
            string memory fromAccount,
            string memory toAccount,
            uint256 amount,
            address proposerBank,
            uint256 approvals,
            bool executed,
            uint256 createdAt,
            uint256 timeoutAt
        ) 
    {
        TransferRequest storage request = transferRequests[requestId];
        require(request.id == requestId, "Request does not exist");
        
        return (
            request.fromAccount,
            request.toAccount,
            request.amount,
            request.proposerBank,
            request.approvals,
            request.executed,
            request.createdAt,
            request.timeoutAt
        );
    }
    
    /**
     * @dev Check if validator has approved
     */
    function hasApproved(uint256 requestId, address validator) external view returns (bool) {
        return transferRequests[requestId].approvedBy[validator];
    }
}

