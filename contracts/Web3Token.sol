// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the base ERC20 contract from OpenZeppelin
// Note: This requires the OpenZeppelin contracts to be installed via npm (npm install @openzeppelin/contracts)
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Web3Token
 * @dev Simple implementation of an ERC-20 token for the payment gateway.
 * The entire initial supply is minted to the address that deploys the contract.
 */
contract Web3Token is ERC20 {
    // Standard ERC-20 tokens use 18 decimal places, just like Ethereum's Ether.

    /**
     * @dev Constructor function that initializes the token properties and mints the initial supply.
     * @param initialSupply The total number of tokens to create and assign to the deployer.
     * This value should be passed *including* the 18 decimals (e.g., 1000 * 10**18).
     */
    constructor(uint256 initialSupply)
        // Call the parent ERC20 constructor with the Token Name ("Web3Token") and Symbol ("W3T")
        ERC20("Web3Token", "W3T")
    {
        // Mint the entire initial supply to the account that deployed the contract (msg.sender).
        _mint(msg.sender, initialSupply);
    }
}