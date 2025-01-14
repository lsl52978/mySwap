declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }

  interface EthereumProvider {
    isMetaMask?: boolean;
    request?: (args: {
      method: string;
      params?: unknown[];
    }) => Promise<unknown>;
    on?: (event: string, listener: (...args: any[]) => void) => void;
    removeListener?: (
      event: string,
      listener: (...args: any[]) => void
    ) => void;
  }
}
export {};
