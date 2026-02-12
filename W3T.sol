
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

    contract W3T is ERC20 {
        constructor() ERC20("Web3Token", "W3T") {
            _mint(msg.sender, 1000000 * 10 ** decimals());
        }
    }