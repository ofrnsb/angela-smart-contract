// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AccountRegistry
 * @dev Map human-readable account numbers (string) to on-chain addresses and record owning bank
 */
contract AccountRegistry is AccessControl {
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");
    
    struct Account {
        string accountNumber;
        address ownerAddress;
        address bankAddress;
        bool exists;
        uint256 createdAt;
    }
    
    // Mapping: accountNumber -> Account
    mapping(string => Account) public accounts;
    
    // Mapping: address -> accountNumber (reverse lookup)
    mapping(address => string) public addressToAccountNumber;
    
    // Array of all account numbers
    string[] public allAccountNumbers;
    
    event AccountRegistered(
        string indexed accountNumber,
        address indexed ownerAddress,
        address indexed bankAddress,
        uint256 timestamp
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Register an account (only banks can register)
     * @param bank Bank address that owns this account
     * @param accountNumber Human-readable account number
     * @param ownerAddress On-chain address of account owner
     */
    function registerAccount(
        address bank,
        string memory accountNumber,
        address ownerAddress
    ) external onlyRole(BANK_ROLE) {
        require(bytes(accountNumber).length > 0, "Account number cannot be empty");
        require(ownerAddress != address(0), "Owner address cannot be zero");
        require(!accounts[accountNumber].exists, "Account already exists");
        require(bytes(addressToAccountNumber[ownerAddress]).length == 0, "Address already registered");
        
        accounts[accountNumber] = Account({
            accountNumber: accountNumber,
            ownerAddress: ownerAddress,
            bankAddress: bank,
            exists: true,
            createdAt: block.timestamp
        });
        
        addressToAccountNumber[ownerAddress] = accountNumber;
        allAccountNumbers.push(accountNumber);
        
        emit AccountRegistered(accountNumber, ownerAddress, bank, block.timestamp);
    }
    
    /**
     * @dev Resolve account number to address and bank
     * @param accountNumber Account number to resolve
     * @return ownerAddress Owner address
     * @return bankAddress Bank address
     */
    function resolveAccount(string memory accountNumber) 
        external 
        view 
        returns (address ownerAddress, address bankAddress) 
    {
        require(accounts[accountNumber].exists, "Account does not exist");
        Account memory account = accounts[accountNumber];
        return (account.ownerAddress, account.bankAddress);
    }
    
    /**
     * @dev Get account details
     */
    function getAccount(string memory accountNumber) 
        external 
        view 
        returns (Account memory) 
    {
        require(accounts[accountNumber].exists, "Account does not exist");
        return accounts[accountNumber];
    }
    
    /**
     * @dev Get all account numbers
     */
    function getAllAccountNumbers() external view returns (string[] memory) {
        return allAccountNumbers;
    }
}

