# ⬡ PromptCoin (PRMPT)

> **Tokenize ideas, not excuses.**
> A Web3 demo ERC-20 token deployed on the Sepolia testnet with real wallet interaction.

[![Sepolia](https://img.shields.io/badge/Network-Sepolia%20Testnet-purple)](https://sepolia.etherscan.io)
[![ERC-20](https://img.shields.io/badge/Token-ERC--20-blue)](https://eips.ethereum.org/EIPS/eip-20)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org)
[![Hardhat](https://img.shields.io/badge/Blockchain-Hardhat-yellow)](https://hardhat.org)

---

## 📋 Table of Contents

- [About](#about)
- [Live Contract](#live-contract)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Running the Frontend](#running-the-frontend)
- [How to Use the dApp](#how-to-use-the-dapp)
- [Token Metrics](#token-metrics)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)

---

## About

PromptCoin is a fully functional Web3 dApp built as a demonstration of ERC-20 token deployment and real blockchain interaction on the Ethereum Sepolia testnet. It features wallet-based authentication via MetaMask, live token minting through a `buyTokens()` smart contract function, and a modern dark-themed UI.

**This is a demo project. No real money is involved. Only Sepolia test ETH is required.**

---

## Live Contract

| Field | Value |
|---|---|
| **Contract Name** | PromptCoin |
| **Symbol** | PRMPT |
| **Network** | Sepolia Testnet |
| **Contract Address** | `0x5d4cfcd92ea7bee74ccfcd21f8bc2353b5f2d63a` |
| **Etherscan** | [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x5d4cfcd92ea7bee74ccfcd21f8bc2353b5f2d63a) |
| **Initial Supply** | 1,000,000 PRMPT |
| **Buy Amount per Call** | 100 PRMPT |
| **Decimals** | 18 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, TypeScript |
| **Blockchain SDK** | Ethers.js v6 |
| **Smart Contract** | Solidity 0.8.20, OpenZeppelin ERC-20 |
| **Dev Toolchain** | Hardhat, hardhat-toolbox |
| **Network** | Ethereum Sepolia Testnet |
| **Wallet** | MetaMask |

---

## Project Structure

```
PromptCoin/
├── contract-workspace/
│   ├── contracts/
│   │   └── PromptCoin.sol          # ERC-20 smart contract
│   ├── scripts/
│   │   └── deploy.js               # Deployment script
│   ├── artifacts/                  # Compiled contract output (auto-generated)
│   ├── hardhat.config.js           # Hardhat + Sepolia configuration
│   ├── package.json
│   └── .env                        # Your secrets (never commit this!)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                # Main dApp page
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── useWallet.ts            # MetaMask wallet hook
│   │   └── abi.ts                  # Contract ABI
│   ├── global.d.ts
│   ├── package.json
│   └── .env.local                  # Frontend env vars
│
└── README.md
```

---

## Features

- ✅ **ERC-20 Smart Contract** — PromptCoin (PRMPT) deployed on Sepolia
- ✅ **Wallet Login** — MetaMask-only, signature-based authentication (no email/password)
- ✅ **Network Guard** — Auto-detects wrong network and prompts switch to Sepolia
- ✅ **Buy Tokens** — Calls `buyTokens()` on-chain, mints 100 PRMPT per click
- ✅ **Live Balance** — Reads and updates token balance after every transaction
- ✅ **Transaction Hash** — Displayed with Etherscan link after confirmation
- ✅ **Simulated Price Feed** — Auto-updates every 3.5 seconds with % change
- ✅ **Token Metrics** — Total supply, user balance, contract address, circulating supply
- ✅ **FAQ Accordion** — Smooth animated, keyboard accessible, ARIA compliant
- ✅ **Responsive Dark UI** — Modern Web3 design, mobile friendly

---

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js v22 LTS** (Hardhat does not support Node 23)
   ```bash
   # Check your version
   node --version

   # Install Node 22 via nvm (recommended)
   nvm install 22
   nvm use 22
   ```

2. **MetaMask** browser extension — [metamask.io](https://metamask.io)

3. **Sepolia test ETH** in your wallet
   - Faucet: [sepoliafaucet.com](https://sepoliafaucet.com)
   - Faucet: [faucets.chain.link/sepolia](https://faucets.chain.link/sepolia)
   - You need at least **0.01 Sepolia ETH** to deploy and interact

4. **Alchemy account** (free) for a reliable Sepolia RPC — [alchemy.com](https://alchemy.com)
   - Create an app → Ethereum → Sepolia → copy the HTTPS URL

5. **Etherscan API key** (optional, for contract verification) — [etherscan.io/apis](https://etherscan.io/apis)

---

## Environment Variables

### `contract-workspace/.env`

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5d4cfcd92ea7bee74ccfcd21f8bc2353b5f2d63a
NEXT_PUBLIC_ALCHEMY_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

> ⚠️ **Never commit your `.env` or `.env.local` files to Git. They contain your private key.**

---

## Installation & Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/tushar598/PromptCoin.git
cd PromptCoin
```

### Step 2 — Install smart contract dependencies

```bash
cd contract-workspace
npm install
```

### Step 3 — Add your environment variables

```bash
# Create your .env file
touch .env
```

Edit `.env` and fill in your values:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 4 — Install frontend dependencies

```bash
cd ../frontend
npm install
```

### Step 5 — Add frontend environment variables

```bash
touch .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5d4cfcd92ea7bee74ccfcd21f8bc2353b5f2d63a
NEXT_PUBLIC_ALCHEMY_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

---

## Smart Contract Deployment

> The contract is already deployed at `0x5d4cfcd92ea7bee74ccfcd21f8bc2353b5f2d63a`. Follow these steps only if you want to **redeploy your own instance**.

### Step 1 — Compile the contract

```bash
cd contract-workspace
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully (evm target: paris)
```

### Step 2 — Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
Deploying with account: 0xYourWalletAddress
Account balance: 0.5 ETH
✅ PromptCoin deployed to: 0xNEW_CONTRACT_ADDRESS
👉 Copy this into your .env.local as NEXT_PUBLIC_CONTRACT_ADDRESS=0xNEW_CONTRACT_ADDRESS
```

> ⚠️ **Your deployer wallet must contain Sepolia ETH.** If it's empty, get free test ETH from [sepoliafaucet.com](https://sepoliafaucet.com).

### Step 3 — Copy the deployed address into the frontend

```bash
# Edit frontend/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_NEW_DEPLOYED_ADDRESS
```

### Step 4 — (Optional) Verify on Etherscan

```bash
npx hardhat verify --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

Once verified, MetaMask will stop showing "Review Alert" warnings and the contract source code will be publicly visible on Etherscan.

---

## Running the Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Use the dApp

1. **Open** [http://localhost:3000](http://localhost:3000)
2. **Click "Connect Wallet"** — MetaMask will prompt you to sign in
3. **Sign the message** in MetaMask (this is the signature-based auth, no password needed)
4. **Make sure you're on Sepolia** — the app will warn you and offer to switch automatically if not
5. **Click "Buy Tokens"** — MetaMask opens a transaction confirmation
6. **Scroll down in MetaMask and click Confirm** (you may see a "Review Alert" if contract is unverified — this is normal, just scroll and confirm)
7. **Wait for confirmation** — the transaction hash will appear with an Etherscan link
8. **Your balance updates** automatically after the transaction is confirmed

---

## Token Metrics

| Metric | Value |
|---|---|
| Token Name | PromptCoin |
| Symbol | PRMPT |
| Decimals | 18 |
| Initial Supply | 1,000,000 PRMPT |
| Minted per `buyTokens()` call | 100 PRMPT |
| Circulating Supply | ~850,000 PRMPT (mock) |
| Contract Address | `0x5d4cfcd92ea7bee74ccfcd21f8bc2353b5f2d63a` |
| Network | Sepolia Testnet (Chain ID: 11155111) |

---

## FAQ

**Why do I see "Review Alert" in MetaMask when buying tokens?**
This is MetaMask's warning for unverified contracts. It doesn't block your transaction. Scroll down inside the popup and click Confirm. To remove the warning permanently, verify the contract on Etherscan using `npx hardhat verify`.

**Do I need real ETH?**
No. Only Sepolia test ETH is required, which is completely free from faucets.

**My transaction keeps failing with "RPC endpoint returned too many errors"**
The default public Sepolia RPC is often overloaded. Fix this by getting a free Alchemy API key at [alchemy.com](https://alchemy.com), then updating MetaMask's Sepolia RPC URL to your Alchemy endpoint under MetaMask → Networks → Sepolia → Edit.

**Where do I get Sepolia ETH?**
- [sepoliafaucet.com](https://sepoliafaucet.com)
- [faucets.chain.link/sepolia](https://faucets.chain.link/sepolia)
- [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module '@nomicfoundation/hardhat-toolbox'` | Run `npm install` inside `contract-workspace/` |
| `require is not defined in ES module scope` | Make sure `"type": "module"` is in `package.json` and config uses `import`/`export` |
| `insufficient funds` on deploy | Add Sepolia ETH from a faucet |
| `window.ethereum is undefined` | MetaMask not installed or wrong browser |
| Balance not updating after buy | Wait for full tx confirmation — it auto-refreshes |
| Wrong network warning | Switch MetaMask to Sepolia manually |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` is empty | Add it to `frontend/.env.local` and restart `npm run dev` |
| Node.js version warning from Hardhat | Switch to Node 22 LTS: `nvm install 22 && nvm use 22` |

---

## .env.example

```env
# contract-workspace/.env
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=

# frontend/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ALCHEMY_RPC=
```

---

## License

MIT — feel free to fork and build on top of this.

---

*PromptCoin · Built on Sepolia Testnet · Demo purposes only · No real monetary value*
