"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  mockERC20Balance: string;
  mockUSDCBalance: string;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [mockERC20Balance, setMockERC20Balance] = useState<string>("0.00");
  const [mockUSDCBalance, setMockUSDCBalance] = useState<string>("0.00");

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
        // await fetchBalances(provider, accounts[0]);
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletConnected(true);
      setWalletAddress(address);

      // await fetchBalances(provider, address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Fetch token balances
  // const fetchBalances = async (
  //   provider: ethers.BrowserProvider,
  //   address: string
  // ) => {
  //   try {
  //     const mockERC20Contract = new ethers.Contract(
  //       process.env.NEXT_PUBLIC_MOCK_ERC20_ADDRESS || "",
  //       ["function balanceOf(address) view returns (uint256)"],
  //       provider
  //     );
  //     const mockUSDCContract = new ethers.Contract(
  //       process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || "",
  //       ["function balanceOf(address) view returns (uint256)"],
  //       provider
  //     );

  //     const [erc20Balance, usdcBalance] = await Promise.all([
  //       mockERC20Contract.balanceOf(address),
  //       mockUSDCContract.balanceOf(address),
  //     ]);

  //     setMockERC20Balance(ethers.formatUnits(erc20Balance, 18)); // MockERC20 uses 18 decimals
  //     setMockUSDCBalance(ethers.formatUnits(usdcBalance, 6)); // MockUSDC uses 6 decimals
  //   } catch (error) {
  //     console.error("Error fetching balances:", error);
  //   }
  // };

  // Handle account change
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      console.log("Wallet disconnected");
      setWalletConnected(false);
      setWalletAddress(null);
      setMockERC20Balance("0.00");
      setMockUSDCBalance("0.00");
    } else {
      // const ethereumProvider = window.ethereum as ethers.Eip1193Provider;
      // const provider = new ethers.BrowserProvider(ethereumProvider);
      setWalletAddress(accounts[0]);
      // await fetchBalances(provider, accounts[0]);
    }
  };

  // Handle chain change
  const handleChainChanged = (chainId: string) => {
    console.log(`Chain changed to: ${parseInt(chainId, 16)}`);
    connectWallet(); // Reconnect and fetch balances
  };

  useEffect(() => {
    if (window.ethereum) {
      const ethereum = window.ethereum as any;

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      // Optional: Automatically connect wallet if available
      // connectWallet();

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
        connectWallet,
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
