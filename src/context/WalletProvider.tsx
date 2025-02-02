"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { cache, get } from "@/utils/storage";

interface WalletContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  mockERC20Balance: string;
  mockUSDCBalance: string;
  mockSwapBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [mockERC20Balance, setMockERC20Balance] = useState<string>("0.00");
  const [mockUSDCBalance, setMockUSDCBalance] = useState<string>("0.00");
  const [mockSwapBalance, setMockSwapBalance] = useState<string>("0.00");

  // Connect wallet logic
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      // Type assertion for window.ethereum
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);

      // 检查是否已有挂起的请求或已连接账户
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        console.log("Already connected:", accounts[0]);
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
        // Save wallet connection state
        cache("walletConnected", true);
        cache("walletAddress", accounts[0]);
        await fetchBalances(provider, accounts[0]);
        return;
      }

      // If not connected, request user to connect their wallet
      const requestedAccounts = await ethereumProvider.request({
        method: "eth_requestAccounts",
      });
      if (requestedAccounts.length === 0) {
        alert("No accounts found. Please connect your wallet.");
        return;
      }

      const account = requestedAccounts[0];
      console.log("Connected account:", account);

      // Save connection state
      setWalletConnected(true);
      setWalletAddress(account);
      cache("walletConnected", true);
      cache("walletAddress", account);

      // Fetch balances for the newly connected account
      await fetchBalances(provider, account);

      console.log("Wallet connected successfully.");
    } catch (error) {
      if ((error as { code: number }).code === 4001) {
        alert("User rejected the connection request.");
      } else {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    }
  };

  // Fetch token balances
  const fetchBalances = async (
    provider: ethers.BrowserProvider,
    address: string
  ) => {
    try {
      const mockERC20Contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_MOCK_ERC20_ADDRESS || "",
        ["function balanceOf(address) view returns (uint256)"],
        provider
      );
      const mockUSDCContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || "",
        ["function balanceOf(address) view returns (uint256)"],
        provider
      );
      const ltpSwapContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_MOCK_SWAP_ADDRESS || "",
        ["function balanceOf(address) view returns (uint256)"],
        provider
      );
      const [erc20Balance, usdcBalance, ltpBalance] = await Promise.all([
        mockERC20Contract.balanceOf(address),
        mockUSDCContract.balanceOf(address),
        ltpSwapContract.balanceOf(address),
      ]);
      setMockERC20Balance(ethers.formatUnits(erc20Balance, 18)); // MockERC20 uses 18 decimals
      setMockUSDCBalance(ethers.formatUnits(usdcBalance, 6)); // MockUSDC uses 6 decimals
      setMockSwapBalance(ethers.formatUnits(ltpBalance, 18)); // LTP uses 18 decimals
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  // Handle account change
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      console.log("Wallet disconnected");
      setWalletConnected(false);
      setWalletAddress(null);
      setMockERC20Balance("0.00");
      setMockUSDCBalance("0.00");
      setMockSwapBalance("0.00");

      // Clear localStorage
      cache("walletConnected", false);
      cache("walletAddress", null);
    } else {
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);
      setWalletAddress(accounts[0]);
      // Update localStorage
      cache("walletAddress", accounts[0]);
      await fetchBalances(provider, accounts[0]);
    }
  };

  // Handle chain change
  const handleChainChanged = (chainId: string) => {
    console.log(`Chain changed to: ${parseInt(chainId, 16)}`);
    if (parseInt(chainId, 16) !== 11155111) {
      alert("Please switch to Sepolia network.");
    } else {
      connectWallet(); // Reconnect and fetch balances
    }
  };

  const disconnectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      console.log("MetaMask is not installed");
      return;
    }

    try {
      const isBrowserExtension = window.ethereum.isMetaMask;
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;

      if (isBrowserExtension) {
        // 使用 wallet_revokePermissions 正确方法断开连接
        await ethereumProvider.request({
          method: "wallet_revokePermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
        console.log("Disconnected via wallet_revokePermissions.");
      } else {
        // 使用 eth_requestAccounts 的特殊方法替代断开连接
        await ethereumProvider.request({
          method: "eth_requestAccounts",
          params: [{ eth_accounts: {} }],
        });
        console.log("Disconnected via eth_requestAccounts substitute method.");
      }

      // 清除应用内的连接状态
      setWalletConnected(false);
      setWalletAddress(null);
      setMockERC20Balance("0.00");
      setMockUSDCBalance("0.00");
      setMockSwapBalance("0.00");

      // 移除本地存储
      cache("walletConnected", false);
      cache("walletAddress", null);

      alert("Wallet disconnected successfully.");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      alert("Failed to disconnect wallet. Please try again.");
    }
  };

  useEffect(() => {
    const reconnectWallet = async () => {
      const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(ethereumProvider);

      const savedWalletConnected = get("walletConnected");
      const savedWalletAddress = get("walletAddress");

      if (savedWalletConnected && savedWalletAddress) {
        console.log("Reconnecting wallet:", savedWalletAddress);
        setWalletConnected(true);
        setWalletAddress(savedWalletAddress);
        await fetchBalances(provider, savedWalletAddress);
      }
    };

    if (window.ethereum) {
      const ethereum = window.ethereum as any;

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      // Check if Sepolia is selected
      if (ethereum.networkVersion !== "11155111") {
        alert("Please switch to Sepolia network.");
      }

      reconnectWallet(); // Attempt to reconnect wallet on page load

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        walletAddress,
        mockERC20Balance,
        mockUSDCBalance,
        mockSwapBalance,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
