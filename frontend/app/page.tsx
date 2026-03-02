// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { ethers } from "ethers";
// import { useWallet } from "@/lib/useWallet";
// import { PROMPTCOIN_ABI } from "@/lib/abi";

// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
// const SEPOLIA_CHAIN_ID = BigInt("0xaa36a7");

// // --- FAQ Component ---
// function FAQ() {
//   const faqs = [
//     { q: "What is PromptCoin?", a: "PromptCoin (PRMPT) is an ERC-20 demo token deployed on the Sepolia testnet, built to showcase real Web3 wallet interactions." },
//     { q: "How do I get PRMPT tokens?", a: "Connect your MetaMask wallet (on Sepolia network) and click 'Buy Tokens'. Each click mints 100 PRMPT to your wallet for free." },
//     { q: "Do I need real ETH?", a: "No! You only need Sepolia test ETH, which is free from faucets like sepoliafaucet.com. Real money is never required." },
//     { q: "Is this contract verified on Etherscan?", a: "Yes, the contract is deployed and verifiable on Sepolia Etherscan. Click the contract address link in the Token Metrics section." },
//     { q: "What wallet do I need?", a: "MetaMask is required. Install the browser extension, create or import a wallet, then switch to the Sepolia test network." },
//   ];
//   const [open, setOpen] = useState<number | null>(null);
//   return (
//     <section className="max-w-2xl mx-auto py-16 px-4">
//       <h2 className="text-3xl font-bold text-center mb-8 text-white">FAQ</h2>
//       <div className="space-y-3">
//         {faqs.map((f, i) => (
//           <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
//             <button
//               className="w-full text-left px-6 py-4 flex justify-between items-center text-white font-medium hover:bg-gray-750 transition-colors"
//               onClick={() => setOpen(open === i ? null : i)}
//               aria-expanded={open === i}
//             >
//               <span>{f.q}</span>
//               <span className={`transform transition-transform duration-200 text-purple-400 text-xl ${open === i ? "rotate-45" : ""}`}>+</span>
//             </button>
//             <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open === i ? "max-h-40" : "max-h-0"}`}>
//               <p className="px-6 pb-4 text-gray-400 leading-relaxed">{f.a}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// // --- Main Page ---
// export default function Home() {
//   const { address, provider, signer, network, isConnecting, error: walletError, connect, disconnect } = useWallet();
//   const [balance, setBalance] = useState<string | null>(null);
//   const [totalSupply, setTotalSupply] = useState<string | null>(null);
//   const [price, setPrice] = useState<number>(0.00042);
//   const [priceChange, setPriceChange] = useState<number>(0);
//   const [isBuying, setIsBuying] = useState(false);
//   const [txHash, setTxHash] = useState<string | null>(null);
//   const [txError, setTxError] = useState<string | null>(null);
//   const [isWrongNetwork, setIsWrongNetwork] = useState(false);

//   const getContract = useCallback((signerOrProvider: any) => {
//     return new ethers.Contract(CONTRACT_ADDRESS, PROMPTCOIN_ABI, signerOrProvider);
//   }, []);

//   const refreshBalance = useCallback(async () => {
//     if (!address || !provider) return;
//     try {
//       const contract = getContract(provider);
//       const [bal, supply, net] = await Promise.all([
//         contract.balanceOf(address),
//         contract.totalSupply(),
//         provider.getNetwork(),
//       ]);
//       setBalance(ethers.formatEther(bal));
//       setTotalSupply(ethers.formatEther(supply));
//       setIsWrongNetwork(net.chainId !== SEPOLIA_CHAIN_ID);
//     } catch {}
//   }, [address, provider, getContract]);

//   useEffect(() => { refreshBalance(); }, [refreshBalance]);

//   // Simulated price feed
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const change = (Math.random() - 0.48) * 0.00002;
//       setPrice((p) => {
//         const next = Math.max(0.0001, p + change);
//         setPriceChange(((next - p) / p) * 100);
//         return next;
//       });
//     }, 3500);
//     return () => clearInterval(interval);
//   }, []);

//   const buyTokens = async () => {
//     if (!signer || !CONTRACT_ADDRESS) return;
//     setIsBuying(true);
//     setTxHash(null);
//     setTxError(null);
//     try {
//       const contract = getContract(signer);
//       const tx = await contract.buyTokens();
//       setTxHash(tx.hash);
//       await tx.wait();
//       await refreshBalance();
//     } catch (e: any) {
//       setTxError(e.message || "Transaction failed");
//     } finally {
//       setIsBuying(false);
//     }
//   };

//   const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

//   return (
//     <main className="min-h-screen bg-gray-950 text-white">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800 backdrop-blur sticky top-0 z-10 bg-gray-950/80">
//         <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">⬡ PromptCoin</span>
//         {address ? (
//           <div className="flex items-center gap-3">
//             <span className="text-sm bg-gray-800 px-3 py-1.5 rounded-full text-gray-300">{shortAddr(address)}</span>
//             <span className={`text-xs px-2 py-1 rounded-full ${isWrongNetwork ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}>
//               {isWrongNetwork ? "⚠ Wrong Network" : "Sepolia"}
//             </span>
//             <button onClick={disconnect} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Disconnect</button>
//           </div>
//         ) : (
//           <button onClick={connect} disabled={isConnecting} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
//             {isConnecting ? "Connecting..." : "Connect Wallet"}
//           </button>
//         )}
//       </nav>

//       {/* Hero */}
//       <section className="text-center py-24 px-4">
//         <div className="inline-block bg-purple-900/30 border border-purple-700/50 rounded-full px-4 py-1 text-sm text-purple-300 mb-6">
//           Live on Sepolia Testnet
//         </div>
//         <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
//           <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">PromptCoin</span>
//           <br />
//           <span className="text-white text-4xl md:text-5xl">Tokenize ideas, not excuses.</span>
//         </h1>
//         <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
//           A Web3 demo token deployed on Sepolia with real wallet interaction.
//         </p>
//         <div className="flex gap-4 justify-center flex-wrap">
//           {!address ? (
//             <button onClick={connect} disabled={isConnecting} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-8 py-3 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-purple-900/50 disabled:opacity-50">
//               {isConnecting ? "Connecting..." : "Connect Wallet"}
//             </button>
//           ) : (
//             <button onClick={buyTokens} disabled={isBuying || isWrongNetwork} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-8 py-3 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-purple-900/50 disabled:opacity-50">
//               {isBuying ? "Processing..." : "Buy Tokens"}
//             </button>
//           )}
//           <button onClick={address ? buyTokens : connect} className="border border-gray-600 hover:border-purple-500 px-8 py-3 rounded-xl font-semibold text-lg transition-all text-gray-300 hover:text-white">
//             Buy Tokens
//           </button>
//         </div>
//         {walletError && <p className="mt-4 text-red-400 text-sm">{walletError}</p>}
//         {isWrongNetwork && <p className="mt-4 text-yellow-400 text-sm">⚠️ Please switch MetaMask to the Sepolia test network</p>}
//         {txHash && (
//           <div className="mt-4 bg-green-900/30 border border-green-700 rounded-xl p-3 max-w-md mx-auto">
//             <p className="text-green-400 text-sm">✅ Transaction confirmed!</p>
//             <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-300 underline break-all">{txHash}</a>
//           </div>
//         )}
//         {txError && <p className="mt-4 text-red-400 text-sm max-w-md mx-auto">{txError}</p>}
//       </section>

//       {/* Live Price */}
//       <section className="max-w-4xl mx-auto px-4 py-8">
//         <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
//           <div>
//             <p className="text-gray-400 text-sm mb-1">PRMPT / USD (Simulated)</p>
//             <p className="text-4xl font-bold text-white">${price.toFixed(6)}</p>
//             <p className={`text-sm font-medium mt-1 ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
//               {priceChange >= 0 ? "▲" : "▼"} {Math.abs(priceChange).toFixed(4)}% (live)
//             </p>
//           </div>
//           <div className="flex gap-6 text-center">
//             <div><p className="text-gray-400 text-xs mb-1">Market Cap</p><p className="text-white font-semibold">${(price * 1_000_000).toFixed(2)}</p></div>
//             <div><p className="text-gray-400 text-xs mb-1">Volume 24h</p><p className="text-white font-semibold">$12,450</p></div>
//             <div><p className="text-gray-400 text-xs mb-1">Holders</p><p className="text-white font-semibold">247</p></div>
//           </div>
//         </div>
//       </section>

//       {/* Token Metrics */}
//       <section className="max-w-4xl mx-auto px-4 py-8">
//         <h2 className="text-2xl font-bold mb-6 text-center">Token Metrics</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { label: "Total Supply", value: totalSupply ? `${Number(totalSupply).toLocaleString()} PRMPT` : "—" },
//             { label: "Your Balance", value: balance ? `${Number(balance).toFixed(2)} PRMPT` : address ? "0 PRMPT" : "Connect wallet" },
//             { label: "Circulating", value: "850,000 PRMPT" },
//             { label: "Token Symbol", value: "PRMPT" },
//           ].map((m) => (
//             <div key={m.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
//               <p className="text-gray-400 text-xs mb-2">{m.label}</p>
//               <p className="text-white font-bold text-sm">{m.value}</p>
//             </div>
//           ))}
//         </div>
//         {CONTRACT_ADDRESS && (
//           <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
//             <p className="text-gray-400 text-xs mb-1">Contract Address</p>
//             <a
//               href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-purple-400 hover:text-purple-300 underline text-sm break-all font-mono"
//             >
//               {CONTRACT_ADDRESS}
//             </a>
//           </div>
//         )}
//       </section>

//       {/* FAQ */}
//       <FAQ />

//       {/* Footer */}
//       <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
//         PromptCoin · Built on Sepolia Testnet · Demo purposes only
//       </footer>
//     </main>
//   );
// }


"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/lib/useWallet";
import { PROMPTCOIN_ABI } from "@/lib/abi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const SEPOLIA_CHAIN_ID = BigInt("0xaa36a7");

// ─── Feedback Data ─────────────────────────────────────────────────────────────
const feedbackData = [
  {
    text: "PromptCoin simplified our hiring process using wallet-based identity. Seamless and powerful.",
    author: "Arjun Mehta",
    role: "Web3 Founder",
    company: "MetaLaunch Labs",
    avatar: 10,
    rating: 5,
    highlight: false,
  },
  {
    text: "The live token metrics and transparent on-chain ecosystem create real trust with contributors.",
    author: "Sara Lin",
    role: "Smart Contract Developer",
    company: "ChainForge",
    avatar: 11,
    rating: 5,
    highlight: true,
  },
  {
    text: "This feels like LinkedIn rebuilt for crypto-native collaboration. Exactly what Web3 needed.",
    author: "Daniel Ross",
    role: "DAO Contributor",
    company: "NounsDAO",
    avatar: 12,
    rating: 5,
    highlight: false,
  },
  {
    text: "We onboarded 3 engineers through PromptCoin in under a week. The wallet verification removed all friction.",
    author: "Priya Nair",
    role: "CTO",
    company: "ZK Systems",
    avatar: 20,
    rating: 5,
    highlight: false,
  },
  {
    text: "As a solo builder, having my on-chain history speak for me meant I landed a contract within days.",
    author: "Leo Tanaka",
    role: "Solidity Engineer",
    company: "Freelance",
    avatar: 33,
    rating: 5,
    highlight: false,
  },
  {
    text: "Finally a platform that understands that reputation in Web3 is on-chain, not on a resume.",
    author: "Fatima Al-Rashid",
    role: "Protocol Researcher",
    company: "OpenDeFi Foundation",
    avatar: 47,
    rating: 5,
    highlight: false,
  },
];

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
const faqData = [
  {
    q: "What is PromptCoin (PRMPT)?",
    a: "PromptCoin (PRMPT) is an ERC-20 demo token deployed on the Sepolia testnet, built to showcase real Web3 wallet interactions, on-chain identity, and trustless collaboration between founders and builders.",
  },
  {
    q: "How do I get PRMPT tokens?",
    a: "Connect your MetaMask wallet on the Sepolia network and click 'Buy Tokens'. Each click mints 100 PRMPT directly to your wallet at no cost — no real ETH required.",
  },
  {
    q: "Do I need real ETH to use PromptCoin?",
    a: "No. You only need Sepolia test ETH, which is completely free from faucets like sepoliafaucet.com. This is a testnet demo — real money is never involved.",
  },
  {
    q: "Is the contract verified on Etherscan?",
    a: "Yes. The contract is deployed and publicly verifiable on Sepolia Etherscan. You can inspect every function, transaction, and token balance directly from the contract address linked in the Token Metrics section.",
  },
  {
    q: "What wallet do I need?",
    a: "MetaMask is required. Install the browser extension, create or import a wallet, then switch to the Sepolia test network. The app will detect your network and warn you if you're on the wrong chain.",
  },
  {
    q: "Can I use PromptCoin for real hiring?",
    a: "PromptCoin is currently a testnet demo. The underlying architecture — wallet-based identity, on-chain reputation, and escrow contracts — is designed to power real hiring workflows in a future mainnet deployment.",
  },
];

// ─── FAQ Component ─────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs text-[#5B58F6] font-medium uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-medium mt-3 mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Common questions about PromptCoin, the Sepolia testnet, and how to
            get started with your wallet.
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <div
              key={i}
              className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                open === i
                  ? "border-[#5B58F6]/40 bg-[#5B58F6]/5"
                  : "border-white/5 bg-[#111] hover:border-white/10"
              }`}
            >
              <button
                className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={`text-sm font-medium transition-colors ${open === i ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                  {f.q}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-sm transition-all duration-200 ${
                    open === i
                      ? "border-[#5B58F6] text-[#5B58F6] rotate-45"
                      : "border-white/20 text-gray-500"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  open === i ? "max-h-48" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Still have questions?{" "}
            <a href="#" className="text-[#5B58F6] hover:underline">
              Join our Discord
            </a>{" "}
            or{" "}
            <a href="#" className="text-[#5B58F6] hover:underline">
              read the docs
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Wallet & Contract (from doc1) ──────────────────────────────────────────
  const {
    address,
    provider,
    signer,
    isConnecting,
    error: walletError,
    connect,
    disconnect,
  } = useWallet();

  const [balance, setBalance] = useState<string | null>(null);
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const getContract = useCallback(
    (signerOrProvider: any) =>
      new ethers.Contract(CONTRACT_ADDRESS, PROMPTCOIN_ABI, signerOrProvider),
    []
  );

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

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

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

  // ── Simulated Price Feed (doc2 original, untouched) ────────────────────────
  const container = useRef<HTMLDivElement>(null);
  const [price, setPrice] = useState(1.245);
  const [change, setChange] = useState(5.24);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((p) => Math.max(0.1, p + (Math.random() * 0.04 - 0.02)));
      setChange((c) => c + (Math.random() * 0.4 - 0.2));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS || "0x1234...abcd");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── GSAP Animations (doc2 original, untouched) ────────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(".hero-icons", { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(1.5)" }, "-=0.4")
        .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(".hero-graphic", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4");

      gsap.from(".ticker-card", {
        scrollTrigger: { trigger: ".ticker-section", start: "top 85%" },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
      });
      gsap.from(".stat-card", {
        scrollTrigger: { trigger: ".stats-grid", start: "top 80%" },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
      });
      gsap.from(".feedback-card", {
        scrollTrigger: { trigger: ".feedback-grid", start: "top 80%" },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
      });
    },
    { scope: container }
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={container}
      className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#5B58F6]/30 overflow-x-hidden"
    >
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
              P
            </div>
            <span className="font-bold tracking-wide">PromptCoin</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="text-white">Home</a>
            <a href="#" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="#" className="hover:text-white transition-colors">Metrics</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </div>

          {/* Wallet connect / address display */}
          {address ? (
            <div className="flex items-center gap-3">
              <a
                href={`https://sepolia.etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-gray-300 font-mono break-all transition-colors hover:text-white"
                title="View on Sepolia Etherscan"
              >
                {address}
              </a>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isWrongNetwork
                    ? "bg-red-900/60 text-red-300"
                    : "bg-green-900/60 text-green-300"
                }`}
              >
                {isWrongNetwork ? "⚠ Wrong Network" : "Sepolia"}
              </span>
              <button
                onClick={disconnect}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#5B58F6]/30 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-300 tracking-wide uppercase mb-8">
            <Check className="w-3 h-3 text-[#5B58F6]" /> Live on Sepolia Testnet
          </div>

          <h1 className="hero-title text-5xl md:text-7xl font-medium tracking-tight mb-6 leading-[1.1]">
            Powering the Future of
            <br />
            Decentralized Innovation.
          </h1>

          <p className="hero-title text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            PromptCoin connects builders, founders, and Web3 talent through a
            token-powered ecosystem built for real on-chain collaboration.
          </p>

          {/* Hero CTA buttons — wire up buyTokens / connect */}
          <div className="hero-buttons flex items-center justify-center gap-4 flex-wrap">
            {!address ? (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="bg-[#5B58F6] hover:bg-[#4f4ce0] text-white px-8 py-3.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={buyTokens}
                disabled={isBuying || isWrongNetwork}
                className="bg-[#5B58F6] hover:bg-[#4f4ce0] text-white px-8 py-3.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isBuying ? "Processing..." : "Buy Tokens"}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={address ? buyTokens : connect}
              disabled={isBuying}
              className="border border-white/20 hover:bg-white/5 text-white px-8 py-3.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
            >
              {address ? "Buy Tokens" : "Explore Ecosystem"}
            </button>
          </div>

          {/* Wallet / tx feedback */}
          {walletError && (
            <p className="mt-4 text-red-400 text-sm">{walletError}</p>
          )}
          {isWrongNetwork && (
            <p className="mt-4 text-yellow-400 text-sm">
              ⚠️ Please switch MetaMask to the Sepolia test network
            </p>
          )}
          {txHash && (
            <div className="mt-4 bg-green-900/20 border border-green-700/50 rounded-xl p-3 max-w-md mx-auto">
              <p className="text-green-400 text-sm">✅ Transaction confirmed!</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-300 underline break-all"
              >
                {txHash}
              </a>
            </div>
          )}
          {txError && (
            <p className="mt-4 text-red-400 text-sm max-w-md mx-auto">
              {txError}
            </p>
          )}

          <div className="hero-graphic mt-24 relative max-w-4xl mx-auto perspective-1000">
            <div className="relative w-full aspect-[2/1] bg-gradient-to-b from-white/10 to-transparent border-t border-white/20 rounded-t-3xl overflow-hidden flex items-center justify-center transform rotateX-12 shadow-2xl shadow-[#5B58F6]/20">
              <div className="text-[12rem] md:text-[15rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20 drop-shadow-2xl">
                P
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Price Ticker ────────────────────────────────────────────────── */}
      <section className="ticker-section py-16 px-6 border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-white/90">
              Live PromptCoin Metrics
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Live Price */}
            <div className="ticker-card bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B58F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Live Price</p>
              <div className="text-2xl font-medium flex items-center gap-2">
                ${price.toFixed(3)}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
              </div>
            </div>

            {/* 24h Change */}
            <div className="ticker-card bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B58F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">24h Change</p>
              <div
                className={`text-2xl font-medium flex items-center gap-2 ${
                  change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {change >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {Math.abs(change).toFixed(2)}%
              </div>
            </div>

            {/* Total Supply — now live from contract */}
            <div className="ticker-card bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B58F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Supply</p>
              <div className="text-2xl font-medium">
                {totalSupply
                  ? `${Number(totalSupply).toLocaleString()}`
                  : "100M"}{" "}
                <span className="text-sm text-gray-500">PRMPT</span>
              </div>
            </div>

            {/* Your Balance — live from contract when connected */}
            <div className="ticker-card bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B58F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Your Balance</p>
              <div className="text-2xl font-medium">
                {balance
                  ? `${Number(balance).toFixed(2)}`
                  : address
                  ? "0"
                  : "—"}{" "}
                <span className="text-sm text-gray-500">PRMPT</span>
              </div>
            </div>

            {/* Contract Address — opens Etherscan in new tab, copy icon copies address */}
            <div
              className="ticker-card bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group col-span-2 md:col-span-1 hover:border-white/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B58F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <p className="relative z-10 text-gray-400 text-xs uppercase tracking-wider mb-2">Contract (Sepolia)</p>
              <div className="relative z-10 text-lg font-medium flex items-center justify-between">
                <a
                  href={
                    CONTRACT_ADDRESS
                      ? `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="truncate mr-2 text-[#5B58F6] hover:text-[#7b79ff] transition-colors cursor-pointer"
                  title="View on Sepolia Etherscan"
                >
                  {CONTRACT_ADDRESS
                    ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`
                    : "0x1234...abcd"}
                </a>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                  title="Copy contract address"
                  className="shrink-0 hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About / Value Section ────────────────────────────────────────────── */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">
            Where Talent Meets
            <br />
            Tokenized Opportunity
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            PromptCoin isn't just a digital asset. It's the coordination layer for
            Web3 builders, creators, and founders. We enable trustless hiring,
            on-chain reputation, and seamless collaboration powered by smart
            contracts.
          </p>
        </div>

        {/* Mock feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: "🔗",
              tag: "On-Chain Identity",
              title: "Wallet-Verified Profiles",
              desc: "Every contributor is verified through their wallet. No fake profiles — your on-chain history speaks for itself.",
              stat: "12K+ verified wallets",
            },
            {
              icon: "⚡",
              tag: "Instant Matching",
              title: "AI-Powered Talent Match",
              desc: "Smart contract logic matches founders with builders based on skills, past contributions, and token activity.",
              stat: "94% match accuracy",
              featured: true,
            },
            {
              icon: "🛡️",
              tag: "Trustless Escrow",
              title: "Secure Payment Rails",
              desc: "Funds are locked in smart contracts and released only on milestone completion. No middlemen, no delays.",
              stat: "$2.4M+ secured",
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 border flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 ${
                f.featured
                  ? "bg-[#5B58F6] border-[#5B58F6] shadow-xl shadow-[#5B58F6]/30"
                  : "bg-[#111] border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{f.icon}</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    f.featured
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  {f.tag}
                </span>
              </div>
              <h3 className="text-xl font-medium">{f.title}</h3>
              <p
                className={`text-sm leading-relaxed flex-1 ${
                  f.featured ? "text-white/80" : "text-gray-400"
                }`}
              >
                {f.desc}
              </p>
              <div
                className={`text-xs font-semibold pt-4 border-t ${
                  f.featured
                    ? "border-white/20 text-white/70"
                    : "border-white/5 text-[#5B58F6]"
                }`}
              >
                {f.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom highlight row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              tag: "Global Access",
              title: "Build from Anywhere",
              desc: "PromptCoin is borderless. Connect with founders and contributors across 60+ countries through a single wallet connection.",
              metric: "60+",
              metricLabel: "Countries",
            },
            {
              tag: "Live on Sepolia",
              title: "Real Transactions, Zero Risk",
              desc: "Experiment with real smart contract interactions on Sepolia testnet. Mint PRMPT, check balances, and verify everything on Etherscan.",
              metric: "100%",
              metricLabel: "On-chain",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#111] border border-white/5 hover:border-white/10 rounded-3xl p-8 flex gap-6 items-start transition-all duration-300 hover:-translate-y-1"
            >
              <div className="shrink-0 text-center bg-[#5B58F6]/10 border border-[#5B58F6]/20 rounded-2xl p-4 w-20">
                <p className="text-2xl font-bold text-[#5B58F6]">{f.metric}</p>
                <p className="text-xs text-gray-500 mt-1">{f.metricLabel}</p>
              </div>
              <div>
                <span className="text-xs text-[#5B58F6] font-medium uppercase tracking-wider">
                  {f.tag}
                </span>
                <h3 className="text-lg font-medium mt-1 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Metrics Grid ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4">
            <div className="stat-card bg-[#111] p-8 rounded-3xl flex flex-col justify-between h-48 border border-white/5">
              <h3 className="text-5xl font-medium">10K+</h3>
              <p className="text-gray-400 text-sm">Community Members</p>
            </div>
            <div className="stat-card bg-[#111] p-8 rounded-3xl flex flex-col justify-between h-48 border border-white/5">
              <h3 className="text-5xl font-medium">98%</h3>
              <p className="text-gray-400 text-sm">Builder Satisfaction</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="stat-card bg-[#111] p-8 rounded-3xl flex flex-col justify-between h-48 border border-white/5">
              <h3 className="text-5xl font-medium">3.5K+</h3>
              <p className="text-gray-400 text-sm">Wallet Connections</p>
            </div>
            <div className="stat-card bg-[#111] p-8 rounded-3xl flex flex-col justify-between h-48 border border-white/5">
              <h3 className="text-5xl font-medium">24/7</h3>
              <p className="text-gray-400 text-sm">Global Access</p>
            </div>
          </div>
          <div className="stat-card bg-[#111] p-8 rounded-3xl flex flex-col h-full relative overflow-hidden group border border-white/5">
            <div className="relative z-10">
              <h3 className="text-5xl font-medium mb-2">1.2K+</h3>
              <p className="text-gray-400 text-sm">
                On-Chain
                <br />
                Transactions
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-full h-full bg-gradient-to-tl from-[#5B58F6]/40 to-transparent rounded-tl-full blur-2xl" />
            <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-50 flex flex-col gap-2 transform -rotate-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 backdrop-blur-sm -ml-8"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feedback Section ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-[#5B58F6]/5">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs text-[#5B58F6] font-medium uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-medium mt-3 mb-4">
            Trusted by Web3 Builders Worldwide
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Real feedback from founders, developers, and contributors already
            building with PromptCoin.
          </p>
          {/* Aggregate rating bar */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white font-semibold text-sm">5.0</span>
            <span className="text-gray-500 text-sm">· {feedbackData.length} reviews</span>
          </div>
        </div>

        {/* Top row — first 3 cards (existing GSAP class preserved) */}
        <div className="feedback-grid grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-5">
          {feedbackData.slice(0, 3).map((t, i) => (
            <div
              key={i}
              className={`feedback-card p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${
                t.highlight
                  ? "bg-[#5B58F6] border-[#5B58F6] shadow-lg shadow-[#5B58F6]/20"
                  : "bg-[#111] border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-white/5"
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.rating)].map((_, s) => (
                  <svg key={s} className={`w-4 h-4 fill-current ${t.highlight ? "text-white/80" : "text-yellow-400"}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className={`text-base leading-relaxed flex-1 ${t.highlight ? "text-white" : "text-gray-300"}`}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
                <img
                  src={`https://i.pravatar.cc/100?img=${t.avatar}`}
                  alt={t.author}
                  className="w-11 h-11 rounded-full border border-white/20 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className={`text-xs ${t.highlight ? "text-white/70" : "text-gray-500"}`}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row — remaining 3 cards, slightly muted */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {feedbackData.slice(3).map((t, i) => (
            <div
              key={i}
              className="p-7 rounded-3xl border border-white/5 bg-[#0d0d0d] hover:border-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, s) => (
                  <svg key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
                <img
                  src={`https://i.pravatar.cc/100?img=${t.avatar}`}
                  alt={t.author}
                  className="w-9 h-9 rounded-full border border-white/10 shrink-0"
                />
                <div>
                  <p className="text-xs font-medium text-white">{t.author}</p>
                  <p className="text-xs text-gray-600">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── Ecosystem Section ────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">
            Embedded in the Decentralized Economy
          </h2>
          <p className="text-gray-400 text-lg">
            PromptCoin integrates with wallets, smart contracts, and
            decentralized protocols to create a seamless Web3 hiring and
            collaboration experience.
          </p>
        </div>

        {/* Horizontally scrollable cards */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none max-w-7xl mx-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

          {/* Card 1 — Smart Contract Verification */}
          <div className="snap-start shrink-0 w-[300px] md:w-[380px] rounded-3xl overflow-hidden relative group border border-white/10 h-[420px]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=800&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:via-black/50 transition-all duration-300" />
            <div className="absolute inset-0 p-7 flex flex-col justify-between">
              <span className="text-xs bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full w-fit">
                Integration
              </span>
              <div>
                <p className="text-xs text-[#5B58F6] font-medium uppercase tracking-wider mb-2">Verification Layer</p>
                <h3 className="text-xl font-medium mb-2">Smart Contract Verification</h3>
                <p className="text-sm text-gray-400">Every transaction is verifiable on Sepolia Etherscan in real time.</p>
              </div>
            </div>
          </div>

          {/* Card 2 — Center feature card (no image) */}
          <div className="snap-start shrink-0 w-[320px] md:w-[420px] rounded-3xl overflow-hidden relative border border-[#5B58F6]/40 bg-gradient-to-b from-[#5B58F6]/20 to-[#111] h-[420px] flex flex-col justify-center items-center p-10 text-center">
            <div className="absolute inset-0 bg-[#5B58F6]/5 rounded-3xl" />
            <div className="relative z-10">
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full mb-6 inline-block border border-white/10">
                Seamless Connection
              </span>
              <div className="w-16 h-16 rounded-full bg-[#5B58F6]/20 border border-[#5B58F6]/40 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-7 h-7 text-[#5B58F6]" />
              </div>
              <h3 className="text-2xl font-medium mb-4">
                Wallet-Based Identity & On-Chain Reputation
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Connect your Web3 wallet to instantly verify your identity,
                showcase your on-chain contributions, and securely interact with
                founders and builders across the ecosystem.
              </p>
            </div>
          </div>

          {/* Card 3 — Decentralized Escrow */}
          <div className="snap-start shrink-0 w-[300px] md:w-[380px] rounded-3xl overflow-hidden relative group border border-white/10 h-[420px]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=800&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:via-black/50 transition-all duration-300" />
            <div className="absolute inset-0 p-7 flex flex-col justify-between">
              <span className="text-xs bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full w-fit">
                Protocol
              </span>
              <div>
                <p className="text-xs text-[#5B58F6] font-medium uppercase tracking-wider mb-2">Payment Layer</p>
                <h3 className="text-xl font-medium mb-2">Decentralized Escrow Payments</h3>
                <p className="text-sm text-gray-400">Milestone-based fund release via smart contracts — no middlemen required.</p>
              </div>
            </div>
          </div>

          {/* Card 4 — DAO Governance */}
          <div className="snap-start shrink-0 w-[300px] md:w-[380px] rounded-3xl overflow-hidden relative group border border-white/10 h-[420px]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=800&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:via-black/50 transition-all duration-300" />
            <div className="absolute inset-0 p-7 flex flex-col justify-between">
              <span className="text-xs bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full w-fit">
                Governance
              </span>
              <div>
                <p className="text-xs text-[#5B58F6] font-medium uppercase tracking-wider mb-2">Community</p>
                <h3 className="text-xl font-medium mb-2">DAO-Powered Decisions</h3>
                <p className="text-sm text-gray-400">PRMPT holders vote on ecosystem proposals and shape protocol direction.</p>
              </div>
            </div>
          </div>

          {/* Card 5 — Open Source */}
          <div className="snap-start shrink-0 w-[300px] md:w-[380px] rounded-3xl overflow-hidden relative group border border-white/10 h-[420px]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:via-black/50 transition-all duration-300" />
            <div className="absolute inset-0 p-7 flex flex-col justify-between">
              <span className="text-xs bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full w-fit">
                Open Source
              </span>
              <div>
                <p className="text-xs text-[#5B58F6] font-medium uppercase tracking-wider mb-2">Transparency</p>
                <h3 className="text-xl font-medium mb-2">Fully Auditable Contracts</h3>
                <p className="text-sm text-gray-400">All contracts are open source and auditable. No hidden logic, no surprises.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <p className="text-center text-xs text-gray-600 mt-4 md:hidden">← scroll to explore →</p>
      </section>

      {/* ── Founders & Talent Split ──────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111] p-10 rounded-3xl border border-white/5 relative overflow-hidden h-[400px] flex flex-col group hover:border-white/10 transition-colors">
            <h3 className="text-3xl font-medium mb-4">For Founders</h3>
            <p className="text-gray-400 mb-8 max-w-sm">
              Access verified Web3-native talent instantly through
              wallet-authenticated profiles and transparent reputation metrics.
            </p>
            <div>
              <button className="bg-[#5B58F6] hover:bg-[#4f4ce0] text-white px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-colors w-fit">
                Start Hiring <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-gradient-to-br from-[#5B58F6]/20 to-transparent rounded-3xl transform rotate-12 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <span className="text-[10rem] font-bold text-white/10">F</span>
            </div>
          </div>
          <div className="bg-[#111] p-10 rounded-3xl border border-white/5 relative overflow-hidden h-[400px] flex flex-col group hover:border-white/10 transition-colors">
            <h3 className="text-3xl font-medium mb-4">For Builders</h3>
            <p className="text-gray-400 mb-8 max-w-sm">
              Showcase your skills on-chain and connect with serious Web3
              founders.
            </p>
            <div>
              <button className="border border-white/20 hover:bg-white/5 text-white px-6 py-2.5 rounded-full text-sm transition-colors w-fit">
                Join as Talent
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-md" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#5B58F6]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-medium mb-6">
            Join the PromptCoin Ecosystem Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Connect your wallet. Explore the network. Build the future.
          </p>

          {/* CTA fires buyTokens if connected, otherwise connect */}
          {address ? (
            <button
              onClick={buyTokens}
              disabled={isBuying || isWrongNetwork}
              className="bg-[#5B58F6] hover:bg-[#4f4ce0] text-white px-10 py-4 rounded-full text-base font-medium inline-flex items-center gap-2 transition-colors shadow-lg shadow-[#5B58F6]/25 hover:shadow-[#5B58F6]/40 hover:-translate-y-1 duration-300 disabled:opacity-50"
            >
              <Wallet className="w-5 h-5" />
              {isBuying ? "Processing..." : "Buy Tokens"}
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="bg-[#5B58F6] hover:bg-[#4f4ce0] text-white px-10 py-4 rounded-full text-base font-medium inline-flex items-center gap-2 transition-colors shadow-lg shadow-[#5B58F6]/25 hover:shadow-[#5B58F6]/40 hover:-translate-y-1 duration-300 disabled:opacity-50"
            >
              <Wallet className="w-5 h-5" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}

          {/* Show tx feedback in CTA area too */}
          {txHash && (
            <div className="mt-6 bg-green-900/20 border border-green-700/50 rounded-xl p-3 max-w-md mx-auto">
              <p className="text-green-400 text-sm">✅ Transaction confirmed!</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-300 underline break-all"
              >
                {txHash}
              </a>
            </div>
          )}
          {txError && (
            <p className="mt-4 text-red-400 text-sm max-w-md mx-auto">{txError}</p>
          )}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="pt-20 pb-12 px-6 border-t border-white/10 relative overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start mb-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm text-gray-400 w-full md:w-auto mb-12 md:mb-0">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium mb-2">Ecosystem</h4>
              <a href="#" className="hover:text-white transition-colors">For Founders</a>
              <a href="#" className="hover:text-white transition-colors">For Builders</a>
              <a href="#" className="hover:text-white transition-colors">Metrics</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium mb-2">Resources</h4>
              <a
                href={
                  CONTRACT_ADDRESS
                    ? `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                Sepolia Contract <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={
                  CONTRACT_ADDRESS
                    ? `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                Etherscan <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h4 className="text-white font-medium mb-2">Connect</h4>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                Twitter <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>

          <div className="md:text-right w-full md:w-auto">
            <div className="flex items-center md:justify-end gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                P
              </div>
              <span className="font-bold tracking-widest text-lg">PROMPTCOIN</span>
            </div>
            <p className="text-xs text-gray-500 max-w-xs md:ml-auto leading-relaxed border border-white/10 p-4 rounded-xl bg-white/5">
              PromptCoin is a demo token deployed on Sepolia for testing purposes
              only. Not financial advice.
            </p>
          </div>
        </div>

        <div className="text-[14vw] font-bold text-center leading-none tracking-tighter text-white/5 select-none pointer-events-none mt-10 -mb-20">
          PROMPTCOIN
        </div>
      </footer>
    </div>
  );
}
