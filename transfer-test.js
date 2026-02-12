import { ethers } from "ethers";
import fs from "fs";

// 1️⃣ Connect to Ganache
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const signer = provider.getSigner(0); // first Ganache account

// 2️⃣ Load compiled contract
const contractJson = JSON.parse(fs.readFileSync("./artifacts/contracts/YourToken.sol/YourToken.json", "utf8"));
const { abi, bytecode } = contractJson;

// 3️⃣ Auto-detect constructor
const constructorInputs = abi.find((x) => x.type === "constructor")?.inputs || [];
console.log("Constructor inputs:", constructorInputs);

async function main() {
  try {
    console.log("Deploying contract...");

    const factory = new ethers.ContractFactory(abi, bytecode, signer);

    // 4️⃣ Provide arguments if needed
    let args = [];
    if (constructorInputs.length === 3) {
      // Example: ERC20(name, symbol, initialSupply)
      args = [
        "Web3Token",
        "W3T",
        ethers.parseUnits("1000000", 18)
      ];
    }

    // 5️⃣ Deploy
    const contract = await factory.deploy(...args);

    // 6️⃣ Wait for deployment
    await contract.waitForDeployment();
    console.log("Contract deployed at:", contract.target);

    // 7️⃣ Verify: total supply if ERC20
    if (contract.totalSupply) {
      const supply = await contract.totalSupply();
      console.log("Total Supply:", ethers.formatUnits(supply, 18));
    }

  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

main();
