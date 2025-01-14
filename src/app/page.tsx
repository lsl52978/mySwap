"use client";

import React, { useEffect } from "react";
import { useWallet } from "@/context/WalletProvider";
import Button from "@/components/Button";

const HomePage: React.FC = () => {
  const {
    walletConnected,
    walletAddress,
    mockERC20Balance,
    mockUSDCBalance,
    connectWallet,
  } = useWallet();

  useEffect(() => {
    console.log("env var check ", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Wallet Information
        </h1>

        {/* Wallet Connection Status */}
        {walletConnected ? (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-600">
                Connected Wallet Address:
              </h2>
              <p className="mt-2 text-purple-700 font-mono break-all">
                {walletAddress}
              </p>
            </div>

            {/* Token Balances */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-600">
                Token Balances:
              </h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-700">MockERC20:</span>
                <span className="text-purple-700 font-semibold">
                  {mockERC20Balance}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-700">MOCK_USDC:</span>
                <span className="text-purple-700 font-semibold">
                  {mockUSDCBalance}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              No wallet connected. Please connect your wallet to view balances.
            </p>
            <Button
              onClick={connectWallet}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
