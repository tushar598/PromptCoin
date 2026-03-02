"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7";
const ALCHEMY_RPC = "https://0xrpc.io/sep";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }
    try {
      setIsConnecting(true);
      setError(null);

      // First request accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Switch to Sepolia and set Alchemy as the RPC
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // If Sepolia not added yet, add it with Alchemy RPC
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Test Network",
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              rpcUrls: [ALCHEMY_RPC],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            }],
          });
        }
      }

      const prov = new ethers.BrowserProvider(window.ethereum);
      const sign = await prov.getSigner();
      const addr = await sign.getAddress();

      // Signature-based auth
      const message = `Sign in to PromptCoin\nTimestamp: ${Date.now()}`;
      await sign.signMessage(message);

      const net = await prov.getNetwork();
      setNetwork(net.name);
      setProvider(prov);
      setSigner(sign);
      setAddress(addr);

    } catch (e: any) {
      setError(e.message || "Connection failed");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setNetwork(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", disconnect);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", disconnect);
      }
    };
  }, []);

  return { address, provider, signer, network, isConnecting, error, connect, disconnect };
}