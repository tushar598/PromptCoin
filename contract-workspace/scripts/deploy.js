const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const PromptCoin = await ethers.getContractFactory("PromptCoin");
  const promptCoin = await PromptCoin.deploy();
  await promptCoin.waitForDeployment();

  const address = await promptCoin.getAddress();
  console.log("✅ PromptCoin deployed to:", address);
  console.log("👉 Copy this into your .env.local as NEXT_PUBLIC_CONTRACT_ADDRESS=", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});