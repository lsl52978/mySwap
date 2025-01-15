// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/Pair.sol";

contract DeployPair is Script {
    function run() external {
        // 开始广播交易
        vm.startBroadcast();

        // 部署 SimpleUniswapV2Pair 合约
        SimpleUniswapV2Pair pair = new SimpleUniswapV2Pair();

        // 调用合约的 initialize() 方法，传入 0x1 和 0x2 作为参数
        pair.initialize(
            address(0x5BAAA2054Bba4A1FEAf52aFb8502B14c61A8Bed9), //usdc
            address(0x46caFcED9C1E16F05b474774144f325A16d9B26E) //erc20
        );

        // 停止广播交易
        vm.stopBroadcast();

        // 输出部署的合约地址
        console.log(
            "pair Contract Deployed and Initialized at:",
            address(pair)
        );
    }
}
