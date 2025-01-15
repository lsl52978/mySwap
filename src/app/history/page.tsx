"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletProvider";
import { get } from "@/utils/storage";

const HistoryPage = () => {
  const { walletConnected, walletAddress } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  useEffect(() => {
    const txs = get("transactions") || [];
    setTransactions(txs);
  }, []);
  useEffect(() => {
    setFilteredTransactions(
      transactions.filter((tx: any) => tx.walletAddress === walletAddress)
    );
  }, [walletAddress, transactions]);

  // Filter transactions by wallet address
  // const filteredTransactions = transactions.filter(
  //   (tx: any) => tx.walletAddress === walletAddress
  // );

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Transaction History
        </h1>

        {!walletConnected ? (
          <p className="text-gray-600">
            Please connect your wallet to view history.
          </p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-600">
            No transaction history found for your wallet.
          </p>
        ) : (
          <div className="overflow-y-auto max-h-[400px]">
            <ul className="space-y-4">
              {filteredTransactions.map((tx: any, index: number) => (
                <li
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg shadow-sm"
                >
                  <p>
                    <strong>From:</strong> {tx.fromAmount} {tx.fromToken}
                  </p>
                  <p>
                    <strong>To:</strong> {tx.toAmount} {tx.toToken}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
