// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IDRToken
 * @dev Demo ledger token representing IDR balances (custodial semantics)
 * Used purely for demo balances; maintains mapping to bank issuer
 */
contract IDRToken is ERC20, AccessControl {
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");
    
    // Mapping to track which bank issued tokens to which account
    mapping(address => address) public bankIssuer;
    
    event TokensMinted(address indexed to, uint256 amount, address indexed issuer);
    event TokensBurned(address indexed from, uint256 amount, address indexed issuer);
    
    constructor() ERC20("IDR Token", "IDR") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint tokens (only banks can mint)
     * @param to Address to mint tokens to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyRole(BANK_ROLE) {
        _mint(to, amount);
        bankIssuer[to] = msg.sender;
        emit TokensMinted(to, amount, msg.sender);
    }
    
    /**
     * @dev Burn tokens (only banks can burn)
     * @param from Address to burn tokens from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external onlyRole(BANK_ROLE) {
        _burn(from, amount);
        emit TokensBurned(from, amount, msg.sender);
    }
    
    /**
     * @dev Get balance of an address
     */
    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }
}

