// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20A is ERC20, Ownable(msg.sender) {
    // 构造函数，初始化代币名称、符号和总供应量
    constructor(uint256 initialSupply) ERC20("ERC20A", "ERCA") {
        _mint(msg.sender, initialSupply * (10 ** decimals())); // 铸造初始供应量给部署者
    }

    /**
     * @dev 铸造代币
     * 仅限部署者调用，向指定地址铸造指定数量的代币
     * @param to 接收代币的地址
     * @param amount 铸造的代币数量
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "ERC20A: mint to the zero address");
        _mint(to, amount);
    }
}
