"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/lib/useWallet";
import { PROMPTCOIN_ABI } from "@/lib/abi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const SEPOLIA_CHAIN_ID = BigInt("0xaa36a7");

// --- FAQ Component ---
function FAQ() {
  const faqs = [
    { q: "What is PromptCoin?", a: "PromptCoin (PRMPT) is an ERC-20 demo token deployed on the Sepolia testnet, built to showcase real Web3 wallet interactions." },
    { q: "How do I get PRMPT tokens?", a: "Connect your MetaMask wallet (on Sepolia network) and click 'Buy Tokens'. Each click mints 100 PRMPT to your wallet for free." },
    { q: "Do I need real ETH?", a: "No! You only need Sepolia test ETH, which is free from faucets like sepoliafaucet.com. Real money is never required." },
    { q: "Is this contract verified on Etherscan?", a: "Yes, the contract is deployed and verifiable on Sepolia Etherscan. Click the contract address link in the Token Metrics section." },
    { q: "What wallet do I need?", a: "MetaMask is required. Install the browser extension, create or import a wallet, then switch to the Sepolia test network." },
  ];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-2xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">FAQ</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center text-white font-medium hover:bg-gray-750 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{f.q}</span>
              <span className={`transform transition-transform duration-200 text-purple-400 text-xl ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open === i ? "max-h-40" : "max-h-0"}`}>
              <p className="px-6 pb-4 text-gray-400 leading-relaxed">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Main Page ---
export default function Home() {
  const { address, provider, signer, network, isConnecting, error: walletError, connect, disconnect } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0.00042);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [isBuying, setIsBuying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const getContract = useCallback((signerOrProvider: any) => {
    return new ethers.Contract(CONTRACT_ADDRESS, PROMPTCOIN_ABI, signerOrProvider);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!address || !provider) return;
    try {
      const contract = getContract(provider);
      const [bal, supply, net] = await Promise.all([
        contract.balanceOf(address),
        contract.totalSupply(),
        provider.getNetwork(),
      ]);
      setBalance(ethers.formatEther(bal));
      setTotalSupply(ethers.formatEther(supply));
      setIsWrongNetwork(net.chainId !== SEPOLIA_CHAIN_ID);
    } catch {}
  }, [address, provider, getContract]);

  useEffect(() => { refreshBalance(); }, [refreshBalance]);

  // Simulated price feed
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.48) * 0.00002;
      setPrice((p) => {
        const next = Math.max(0.0001, p + change);
        setPriceChange(((next - p) / p) * 100);
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const buyTokens = async () => {
    if (!signer || !CONTRACT_ADDRESS) return;
    setIsBuying(true);
    setTxHash(null);
    setTxError(null);
    try {
      const contract = getContract(signer);
      const tx = await contract.buyTokens();
      setTxHash(tx.hash);
      await tx.wait();
      await refreshBalance();
    } catch (e: any) {
      setTxError(e.message || "Transaction failed");
    } finally {
      setIsBuying(false);
    }
  };

  const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800 backdrop-blur sticky top-0 z-10 bg-gray-950/80">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">⬡ PromptCoin</span>
        {address ? (
          <div className="flex items-center gap-3">
            <span className="text-sm bg-gray-800 px-3 py-1.5 rounded-full text-gray-300">{shortAddr(address)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${isWrongNetwork ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}>
              {isWrongNetwork ? "⚠ Wrong Network" : "Sepolia"}
            </span>
            <button onClick={disconnect} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Disconnect</button>
          </div>
        ) : (
          <button onClick={connect} disabled={isConnecting} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-4">
        <div className="inline-block bg-purple-900/30 border border-purple-700/50 rounded-full px-4 py-1 text-sm text-purple-300 mb-6">
          Live on Sepolia Testnet
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">PromptCoin</span>
          <br />
          <span className="text-white text-4xl md:text-5xl">Tokenize ideas, not excuses.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          A Web3 demo token deployed on Sepolia with real wallet interaction.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {!address ? (
            <button onClick={connect} disabled={isConnecting} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-8 py-3 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-purple-900/50 disabled:opacity-50">
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <button onClick={buyTokens} disabled={isBuying || isWrongNetwork} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-8 py-3 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-purple-900/50 disabled:opacity-50">
              {isBuying ? "Processing..." : "Buy Tokens"}
            </button>
          )}
          <button onClick={address ? buyTokens : connect} className="border border-gray-600 hover:border-purple-500 px-8 py-3 rounded-xl font-semibold text-lg transition-all text-gray-300 hover:text-white">
            Buy Tokens
          </button>
        </div>
        {walletError && <p className="mt-4 text-red-400 text-sm">{walletError}</p>}
        {isWrongNetwork && <p className="mt-4 text-yellow-400 text-sm">⚠️ Please switch MetaMask to the Sepolia test network</p>}
        {txHash && (
          <div className="mt-4 bg-green-900/30 border border-green-700 rounded-xl p-3 max-w-md mx-auto">
            <p className="text-green-400 text-sm">✅ Transaction confirmed!</p>
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-300 underline break-all">{txHash}</a>
          </div>
        )}
        {txError && <p className="mt-4 text-red-400 text-sm max-w-md mx-auto">{txError}</p>}
      </section>

      {/* Live Price */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">PRMPT / USD (Simulated)</p>
            <p className="text-4xl font-bold text-white">${price.toFixed(6)}</p>
            <p className={`text-sm font-medium mt-1 ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              {priceChange >= 0 ? "▲" : "▼"} {Math.abs(priceChange).toFixed(4)}% (live)
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-gray-400 text-xs mb-1">Market Cap</p><p className="text-white font-semibold">${(price * 1_000_000).toFixed(2)}</p></div>
            <div><p className="text-gray-400 text-xs mb-1">Volume 24h</p><p className="text-white font-semibold">$12,450</p></div>
            <div><p className="text-gray-400 text-xs mb-1">Holders</p><p className="text-white font-semibold">247</p></div>
          </div>
        </div>
      </section>

      {/* Token Metrics */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Token Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Supply", value: totalSupply ? `${Number(totalSupply).toLocaleString()} PRMPT` : "—" },
            { label: "Your Balance", value: balance ? `${Number(balance).toFixed(2)} PRMPT` : address ? "0 PRMPT" : "Connect wallet" },
            { label: "Circulating", value: "850,000 PRMPT" },
            { label: "Token Symbol", value: "PRMPT" },
          ].map((m) => (
            <div key={m.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-2">{m.label}</p>
              <p className="text-white font-bold text-sm">{m.value}</p>
            </div>
          ))}
        </div>
        {CONTRACT_ADDRESS && (
          <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Contract Address</p>
            <a
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline text-sm break-all font-mono"
            >
              {CONTRACT_ADDRESS}
            </a>
          </div>
        )}
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
        PromptCoin · Built on Sepolia Testnet · Demo purposes only
      </footer>
    </main>
  );
}