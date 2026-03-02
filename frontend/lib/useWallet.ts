"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

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

  const checkNetwork = async (prov: ethers.BrowserProvider) => {
    const net = await prov.getNetwork();
    setNetwork(net.name);
    return net.chainId.toString(16);
  };

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }
    try {
      setIsConnecting(true);
      setError(null);
      const prov = new ethers.BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const sign = await prov.getSigner();
      const addr = await sign.getAddress();

      // Signature-based auth
      const message = `Sign in to PromptCoin\nTimestamp: ${Date.now()}`;
      await sign.signMessage(message);

      const chainId = await checkNetwork(prov);
      if (`0x${chainId}` !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch {}
      }

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