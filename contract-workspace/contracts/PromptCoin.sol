// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PromptCoin is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;
    uint256 public constant BUY_AMOUNT = 100 * 10 ** 18;

    constructor() ERC20("PromptCoin", "PRMPT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function buyTokens() external {
        _mint(msg.sender, BUY_AMOUNT);
    }

    function totalMinted() external view returns (uint256) {
        return totalSupply();
    }
}