// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/USDCA.sol";

contract DeployUSDCA is Script {
    function run() external {
        // 读取私钥和部署者地址
        // uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // address deployer = vm.addr(deployerPrivateKey);

        // 开始广播交易
        vm.startBroadcast();

        // 部署 USDT 合约，传递构造函数参数
        USDCA usdta = new USDCA(50000 * 1e18);

        // 停止广播交易
        vm.stopBroadcast();

        // 输出部署的合约地址
        console.log("USDT Contract Deployed at:", address(usdta));
    }
}
