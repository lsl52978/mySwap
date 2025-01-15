// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/USDCA.sol";

contract USDCATest is Test {
    USDCA private usdca;
    address private owner; // 部署合约的地址
    address private user; // 普通用户地址

    function setUp() public {
        owner = address(this); // 将当前测试合约地址作为 owner
        user = address(0x1234); // 定义一个用户地址
        usdca = new USDCA(1000); // 部署合约，初始供应量为 1000
    }

    function testInitialSupply() public {
        // 验证部署者是否收到初始代币供应量
        uint256 expectedSupply = 1000 * (10 ** usdca.decimals());
        assertTrue(
            usdca.balanceOf(owner) == expectedSupply,
            "Initial supply not correct"
        );
    }

    function testDecimals() public {
        // 验证代币的精度是否为 6
        assertTrue(usdca.decimals() == 6, "Decimals should be 6");
    }

    function testMintByOwner() public {
        // 验证只有 owner 能调用 mint
        uint256 mintAmount = 500 * (10 ** usdca.decimals());
        usdca.mint(user, mintAmount);
        assertTrue(usdca.balanceOf(user) == mintAmount, "Mint by owner failed");
    }

    function testMintByNonOwner() public {
        // 验证非 owner 调用 mint 会失败
        uint256 mintAmount = 500 * (10 ** usdca.decimals());
        vm.prank(user); // 模拟 `user` 作为调用者
        vm.expectRevert(); // 预期任何 revert
        usdca.mint(user, mintAmount);

        // 验证 `user` 的余额未增加
        assertTrue(
            usdca.balanceOf(user) == 0,
            "Non-owner mint succeeded unexpectedly"
        );
    }

    function testMintToZeroAddress() public {
        // 验证 mint 到零地址会失败
        uint256 mintAmount = 500 * (10 ** usdca.decimals());
        vm.expectRevert(); // 预期任何 revert
        usdca.mint(address(0), mintAmount);

        // 验证零地址的余额仍为 0
        assertTrue(
            usdca.balanceOf(address(0)) == 0,
            "Mint to zero address succeeded unexpectedly"
        );
    }

    function testOwnership() public {
        // 验证合约的所有者是否正确
        assertTrue(
            usdca.owner() == owner,
            "Owner should be the deploying address"
        );
    }
}
