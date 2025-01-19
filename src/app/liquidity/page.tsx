"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/Button"; // 按钮组件
import Modal from "@/components/Modal"; // 模态框组件
import { ethers } from "ethers";
import uniswapAbi from "@/abi/SimpleUniswapV2Pair.json";
import erc20AAbi from "@/abi/ERC20A.json";
import usdcaAbi from "@/abi/USDCA.json";
import { useWallet } from "@/context/WalletProvider"; // 引入 useWallet
import { MAX_UINT256 } from "@/utils/globalVariables";

const LiquidityPage = () => {
  const { walletConnected, walletAddress, connectWallet } = useWallet();
  const uniswapAddress = process.env.NEXT_PUBLIC_MOCK_SWAP_ADDRESS!;
  const usdcAddress = process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS!;
  const erc20Address = process.env.NEXT_PUBLIC_MOCK_ERC20_ADDRESS!;
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [isRemoveLiquidityOpen, setIsRemoveLiquidityOpen] = useState(false);
  const [amount0, setAmount0] = useState(""); // Mock USDC 数量
  const [amount1, setAmount1] = useState(""); // Mock ERC20 数量
  const [liquidity, setLiquidity] = useState(""); // 流动性代币数量
  const [handleAddLiquidityLoading, setHandleAddLiquidityLoading] =
    useState<boolean>(false);
  const [handleRemoveLiquidityLoading, setHandleRemoveLiquidityLoading] =
    useState<boolean>(false);

  // const [reserveUSDC, setReservUSDC] = useState<string>("0");
  // const [reserveERC, setReservERC] = useState<string>("0");
  const [kValue, setKValue] = useState<string>("0");

  const getTokenContract = (tokenAddress: string, signer: ethers.Signer) => {
    const abi =
      tokenAddress === erc20Address
        ? erc20AAbi.abi
        : tokenAddress === usdcAddress
        ? usdcaAbi.abi
        : uniswapAbi.abi; // 默认返回 LP Token 的 ABI

    return new ethers.Contract(tokenAddress, abi, signer);
  };

  const getTokenDecimals = async (tokenAddress: string): Promise<number> => {
    const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
    const provider = new ethers.BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();
    const tokenContract = getTokenContract(tokenAddress, signer);

    try {
      const decimals = await tokenContract.decimals();
      return decimals;
    } catch (error) {
      console.error(`Error fetching decimals for ${tokenAddress}:`, error);
      throw new Error(`Failed to get decimals for token ${tokenAddress}`);
    }
  };

  const ensureApproval = async (
    account: string,
    tokenAddress: string,
    spender: string
  ) => {
    console.log("begin to apporve");
    const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
    const provider = new ethers.BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();
    const tokenContract = getTokenContract(tokenAddress, signer);

    try {
      const allowance = await tokenContract.allowance(account, spender);
      console.log(`${tokenAddress} 授权额度: ${allowance.toString()}`);

      if (BigInt(allowance) === BigInt(0)) {
        console.log(`${tokenAddress} 授权不足，开始授权...`);
        const tx = await tokenContract.approve(spender, MAX_UINT256);
        console.log("授权交易已提交，等待确认...", tx.hash);
        await tx.wait();
        console.log(`${tokenAddress} 授权成功`);
      }
    } catch (error) {
      console.error(`Error ensuring approval for ${tokenAddress}:`, error);
      throw new Error(`Failed to ensure approval for ${tokenAddress}`);
    }
  };

  const handleAddLiquidity = async () => {
    // e.preventDefault(); // 阻止表单默认提交行为
    if (!walletConnected || !walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setHandleAddLiquidityLoading(true);
      // 获取代币精度
      const usdcDecimals = await getTokenDecimals(usdcAddress);
      const erc20Decimals = await getTokenDecimals(erc20Address);
      console.log("usdcDecimals, erc20Decimals ", usdcDecimals, erc20Decimals);

      // 检查账户余额是否足够
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();

      const usdcContract = getTokenContract(usdcAddress, signer);
      const erc20Contract = getTokenContract(erc20Address, signer);

      const usdcBalance = await usdcContract.balanceOf(walletAddress);
      const erc20Balance = await erc20Contract.balanceOf(walletAddress);

      const requiredUsdc = ethers.parseUnits(amount0, usdcDecimals);
      const requiredErc20 = ethers.parseUnits(amount1, erc20Decimals);

      if (usdcBalance < requiredUsdc || erc20Balance < requiredErc20) {
        alert("Insufficient token balance to add liquidity.");
        setHandleAddLiquidityLoading(false);
        return;
      }
      console.log("开始授权");
      // 确保授权
      await ensureApproval(walletAddress, usdcAddress, uniswapAddress);
      await ensureApproval(walletAddress, erc20Address, uniswapAddress);
      console.log("授权完成");

      // 添加流动性
      const uniswapContract = new ethers.Contract(
        uniswapAddress,
        uniswapAbi.abi,
        signer
      );

      const tx = await uniswapContract.addLiquidity(
        requiredUsdc,
        requiredErc20
      );
      await tx.wait();
      setHandleAddLiquidityLoading(false);
      alert("Liquidity added successfully!");
      setAmount0("");
      setAmount1("");
      setIsAddLiquidityOpen(false);
    } catch (error) {
      console.error("Error adding liquidity:", error);
      setHandleAddLiquidityLoading(false);
      alert("Failed to add liquidity. Please try again.");
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!walletConnected || !walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setHandleRemoveLiquidityLoading(true);
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      const uniswapContract = new ethers.Contract(
        uniswapAddress,
        uniswapAbi.abi,
        signer
      );

      const lpBalance = await uniswapContract.balanceOf(walletAddress);
      const liquidityInWei = ethers.parseUnits(liquidity, 18);

      if (BigInt(lpBalance) < BigInt(liquidityInWei)) {
        alert("Insufficient LP token balance.");
        setHandleRemoveLiquidityLoading(false);
        return;
      }

      const tx = await uniswapContract.removeLiquidity(liquidityInWei);
      await tx.wait();
      alert("Liquidity removed successfully!");
      setHandleRemoveLiquidityLoading(false);
      setLiquidity("");
      setIsRemoveLiquidityOpen(false);
    } catch (error) {
      console.error("Error removing liquidity:", error);
      setHandleRemoveLiquidityLoading(false);
      alert("Failed to remove liquidity. Please try again.");
    }
  };

  // 获取储备量
  const fetchReserves = async () => {
    if (!walletConnected) return;

    try {
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      const uniswapContract = new ethers.Contract(
        uniswapAddress,
        uniswapAbi.abi,
        signer
      );

      const [reserve0Raw, reserve1Raw] = await uniswapContract.getReserves();

      const reserve0Formatted = ethers.formatUnits(reserve0Raw, 6); // USDC 精度为 6
      const reserve1Formatted = ethers.formatUnits(reserve1Raw, 18); // ERC20 精度为 18

      // setReservUSDC(reserve0Formatted);
      // setReservERC(reserve1Formatted);

      // 计算 k 值
      const k = parseFloat(reserve0Formatted) * parseFloat(reserve1Formatted);
      setKValue(k.toString());
    } catch (error) {
      console.error("Error fetching reserves:", error);
    }
  };

  useEffect(() => {
    if (walletConnected) {
      fetchReserves();
    }
  }, [walletConnected]);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Manage Liquidity
        </h1>

        {!walletConnected ? (
          // 显示 Connect Wallet 按钮
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Wallet not connected. Please connect your wallet to continue.
            </p>
            <Button
              onClick={connectWallet}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            {/* 储备量和 k 值展示 */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Pool Reserves
              </h2>
              {/* <div className="flex justify-between items-center">
                <span className="text-gray-700">USDC Reserve:</span>
                <span className="text-purple-700 font-semibold">
                  {reserveUSDC}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700">ERC20 Reserve:</span>
                <span className="text-purple-700 font-semibold">
                  {reserveERC}
                </span>
              </div> */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700">k Value:</span>
                <span className="text-purple-700 font-semibold">{kValue}</span>
              </div>
              <Button
                onClick={fetchReserves}
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 w-full text-white"
              >
                Refresh Reserves
              </Button>
            </div>

            {/* Add & Remove Liquidity Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => setIsAddLiquidityOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Add Liquidity
              </Button>
              <Button
                onClick={() => setIsRemoveLiquidityOpen(true)}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Remove Liquidity
              </Button>
            </div>
          </>
        )}

        {/* Add Liquidity Modal */}
        <Modal
          isOpen={isAddLiquidityOpen}
          onClose={() => setIsAddLiquidityOpen(false)}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Add Liquidity
          </h2>
          <form>
            <label className="block text-sm font-medium text-gray-600">
              Mock USDC Amount
            </label>
            <input
              type="number"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Enter amount"
              value={amount0}
              onChange={(e) => setAmount0(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-600 mt-4">
              Mock ERC20 Amount
            </label>
            <input
              type="number"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Enter amount"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={() => setIsAddLiquidityOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                disabled={handleAddLiquidityLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddLiquidity}
                className="bg-green-500 hover:bg-green-600"
                disabled={handleAddLiquidityLoading}
              >
                Confirm
              </Button>
            </div>
          </form>
        </Modal>

        {/* Remove Liquidity Modal */}
        <Modal
          isOpen={isRemoveLiquidityOpen}
          onClose={() => setIsRemoveLiquidityOpen(false)}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Remove Liquidity
          </h2>
          <form>
            <label className="block text-sm font-medium text-gray-600">
              Liquidity Amount
            </label>
            <input
              type="number"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
              placeholder="Enter amount"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={() => setIsRemoveLiquidityOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                disabled={handleRemoveLiquidityLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRemoveLiquidity}
                className="bg-red-500 hover:bg-red-600"
                disabled={handleRemoveLiquidityLoading}
              >
                Confirm
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default LiquidityPage;
