"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletProvider"; // 引入 useWallet
import Button from "@/components/Button";
import { cache, get } from "@/utils/storage";
import { ethers } from "ethers";
import uniswapAbi from "@/abi/SimpleUniswapV2Pair.json";
import erc20aAbi from "@/abi/ERC20A.json";
import usdcaAbi from "@/abi/USDCA.json";

const TradingPage = () => {
  const { walletConnected, walletAddress, connectWallet } = useWallet(); // 使用 useWallet 钩子

  const [isLoading, setIsLoading] = useState(false);
  const [fromToken, setFromToken] = useState("MockERC20");
  const [toToken, setToToken] = useState("MOCK_USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const uniswapAddress = process.env.NEXT_PUBLIC_MOCK_SWAP_ADDRESS;
  const usdcaAddress = process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS;
  const erc20aAddress = process.env.NEXT_PUBLIC_MOCK_ERC20_ADDRESS;

  // 获取 Token Contract 和 Decimals
  const getTokenContract = (
    tokenAddress: string,
    signer: ethers.Signer
  ): { contract: ethers.Contract; decimals: number } => {
    if (tokenAddress === usdcaAddress) {
      return {
        contract: new ethers.Contract(tokenAddress, usdcaAbi.abi, signer),
        decimals: 6, // USDCA 精度为 6
      };
    }
    if (tokenAddress === erc20aAddress) {
      return {
        contract: new ethers.Contract(tokenAddress, erc20aAbi.abi, signer),
        decimals: 18, // ERC20A 精度为 18
      };
    }
    throw new Error("Invalid token address.");
  };

  // Fetch Swap Preview
  const fetchSwapPreview = async (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return "0.00";

    try {
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      const uniswapInterface = new ethers.Interface(uniswapAbi.abi);
      const uniswapContract = new ethers.Contract(
        uniswapAddress!,
        uniswapInterface,
        signer
      );

      const inputToken =
        fromToken === "MockERC20" ? erc20aAddress : usdcaAddress;
      const outputToken =
        toToken === "MockERC20" ? erc20aAddress : usdcaAddress;

      const { decimals: inputDecimals } = getTokenContract(inputToken!, signer);

      const inputAmount = ethers.parseUnits(amount, inputDecimals);

      const amountOut = await uniswapContract.getAmountsOut(
        inputAmount,
        inputToken,
        outputToken
      );
      console.log("Amount out: ", amountOut);
      const { decimals: outputDecimals } = getTokenContract(
        outputToken!,
        signer
      );
      return ethers.formatUnits(amountOut, outputDecimals);
    } catch (error) {
      console.error("Error fetching swap preview:", error);
      return "0.00";
    }
  };

  // 检查用户余额是否足够
  const checkBalance = async (
    tokenAddress: string,
    requiredAmount: string
  ): Promise<boolean> => {
    const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
    const provider = new ethers.BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();

    const { contract, decimals } = getTokenContract(tokenAddress, signer);
    const balance: bigint = await contract.balanceOf(walletAddress);

    const requiredAmountInWei = ethers.parseUnits(requiredAmount, decimals);
    console.log(
      `Balance for ${tokenAddress}: ${ethers.formatUnits(
        balance,
        decimals
      )}, Required: ${requiredAmount}`
    );

    return balance >= requiredAmountInWei;
  };

  // Handle Swap Direction
  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
    setToAmount("");
  };

  // Handle From Amount Change
  const handleFromAmountChange = async (value: string) => {
    setFromAmount(value);
    setIsLoading(true);

    // Simulate fetching swap calculation
    const result = await fetchSwapPreview(value);
    console.log("Swap preview result:", result);
    setToAmount(result);

    setIsLoading(false);
  };

  // Handle Swap
  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    try {
      setIsLoading(true);
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      const uniswapInterface = new ethers.Interface(uniswapAbi.abi);
      const uniswapContract = new ethers.Contract(
        uniswapAddress!,
        uniswapInterface,
        signer
      );

      const inputToken =
        fromToken === "MockERC20" ? erc20aAddress : usdcaAddress;
      const outputToken =
        toToken === "MockERC20" ? erc20aAddress : usdcaAddress;

      // 检查余额是否足够
      const isBalanceEnough = await checkBalance(inputToken!, fromAmount);
      if (!isBalanceEnough) {
        alert("Insufficient token balance. Please check your wallet.");
        setIsLoading(false);
        return;
      }

      const { decimals: inputDecimals } = getTokenContract(inputToken!, signer);
      const { decimals: outputDecimals } = getTokenContract(
        outputToken!,
        signer
      );

      const inputAmount = ethers.parseUnits(fromAmount, inputDecimals);
      const outputAmountMin = ethers.parseUnits(toAmount, outputDecimals);

      const tx = await uniswapContract.swapExactTokensForTokens(
        inputAmount,
        outputAmountMin,
        inputToken,
        outputToken,
        walletAddress
      );

      await tx.wait();
      alert("Swap successful!");
      setIsLoading(false);

      setFromAmount("");
      setToAmount("");
      const transaction = {
        walletAddress,
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        timestamp: new Date().toISOString(),
      };

      // Get existing transactions and add the new one
      const existingTransactions = get("transactions") || [];
      cache("transactions", [...existingTransactions, transaction]);
    } catch (error) {
      console.error("Error during swap:", error);
      setIsLoading(false);
      alert("Swap failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="space-y-4">
          {/* From Section */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              From
            </label>
            <div className="flex items-center bg-purple-100 rounded-lg p-3 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-800 font-medium">{fromToken}</span>
              </div>
              <input
                type="number"
                className="ml-auto bg-transparent focus:outline-none text-right text-gray-800 w-20"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                disabled={!walletConnected} // 如果钱包未连接则禁用输入框
              />
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwapDirection}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center"
            >
              ↕️
            </Button>
          </div>

          {/* To Section */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">
              To (estimated)
            </label>
            <div className="flex items-center bg-purple-100 rounded-lg p-3 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                <span className="text-gray-800 font-medium">{toToken}</span>
              </div>
              <input
                type="text"
                className="ml-auto bg-transparent focus:outline-none text-right text-gray-800 w-20"
                placeholder="0.00"
                value={toAmount}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {!walletConnected ? (
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={handleSwap}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Swap"}
            </Button>
          )}
        </div>

        {/* Wallet Address Display */}
        {walletConnected && (
          <div className="mt-4 text-sm text-gray-600">
            Connected Wallet:{" "}
            <span className="font-medium">{walletAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPage;
