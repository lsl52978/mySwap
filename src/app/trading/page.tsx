"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletProvider"; // 引入 useWallet
import Button from "@/components/Button";

const TradingPage = () => {
  const { walletConnected, walletAddress, connectWallet } = useWallet(); // 使用 useWallet 钩子

  const [isLoading, setIsLoading] = useState(false);
  const [fromToken, setFromToken] = useState("MockERC20");
  const [toToken, setToToken] = useState("MOCK_USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // Mock swap calculation function
  const calculateSwap = (amount: string) => {
    if (!amount) return "0.00";
    const rate = fromToken === "MockERC20" ? 1.38 : 0.72; // Mock rate
    return (parseFloat(amount) * rate).toFixed(2);
  };

  // Handle Swap Direction
  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
    setToAmount("");
  };

  // Handle From Amount Change
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setIsLoading(true);

    // Simulate fetching swap calculation
    setTimeout(() => {
      const result = calculateSwap(value);
      setToAmount(result);
      setIsLoading(false);
    }, 1000);
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
              To
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
              onClick={() =>
                alert(`Swap executed for ${fromAmount} ${fromToken}`)
              }
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
