// ganache-test.js
import { ethers } from "ethers";

const GANACHE_URL = "http://127.0.0.1:7545";
const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://sepolia.example.rpc"; // replace with your real Sepolia RPC

function addressToString(a) {
  // Handles cases where listAccounts() returns strings or objects like { address: "0x..." }.
  if (!a && a !== "") return String(a);
  if (typeof a === "string") return a;
  if (typeof a === "object") {
    if ("address" in a && typeof a.address === "string") return a.address;
    if (typeof a.toString === "function") return a.toString();
  }
  return String(a);
}

async function runAgainstProvider(provider, label) {
  console.log(`\n🧪 Testing provider: ${label} (${provider.connection?.url ?? "unknown URL"})`);
  try {
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name ?? "unknown"} (Chain ID: ${network.chainId})`);

    const accounts = await provider.listAccounts();
    if (!accounts || accounts.length === 0) {
      console.log("⚠️ No accounts returned by provider.");
    } else {
      const firstAccountRaw = accounts[0];
      const firstAccount = addressToString(firstAccountRaw);
      console.log(`💰 First account: ${firstAccount}`);

      const balanceWei = await provider.getBalance(firstAccount);
      const balanceEth = ethers.formatEther(balanceWei);
      console.log(`💵 Balance: ${balanceEth} ETH`);
    }

    console.log(`\n✅ ${label} connection test SUCCESSFUL!`);
    return true;
  } catch (err) {
    console.error(`\n❌ ${label} connection test FAILED.`);
    console.error("Error:", err?.message ?? err);
    return false;
  }
}

async function main() {
  console.log("🔍 Starting Ganache connection test...");

  // Try Ganache first
  const ganacheProvider = new ethers.JsonRpcProvider(GANACHE_URL);
  const ok = await runAgainstProvider(ganacheProvider, "Ganache (local)");

  if (ok) {
    console.log("\n➡️ Using Ganache for local development (http://127.0.0.1:7545).");
    return;
  }

  // Fallback to Sepolia
  console.log("\n➡️ Falling back to Sepolia RPC (public).");
  if (!SEPOLIA_RPC || SEPOLIA_RPC.includes("example.rpc")) {
    console.warn("⚠️ No SEPOLIA_RPC set (or placeholder still present). Set SEPOLIA_RPC env var to your Sepolia RPC URL (Infura/Alchemy/etc.).");
  }
  const sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const sepoliaOk = await runAgainstProvider(sepoliaProvider, "Sepolia (fallback)");
  if (!sepoliaOk) {
    console.error("\n❗ Both Ganache and Sepolia connection tests failed. Check your local Ganache, firewall, and your SEPOLIA_RPC value.");
  } else {
    console.log("\n➡️ Using Sepolia public RPC for reads.");
  }
}

main();
