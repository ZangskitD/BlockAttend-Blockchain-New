
import hre from "hardhat";

const { ethers, network } = hre;

async function main() {
    console.log("\n========================================");
    console.log("       BLOCKATTEND BLOCKCHAIN DEMO");
    console.log("========================================");

    // 1. Network information
    console.log("\n========== NETWORK INFORMATION ==========");
    console.log("Network:", network.name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());

    // 2. Wallet information
    const accounts = await ethers.getSigners();

    console.log("\n========== WALLET DETAILS ==========");

    console.log("Account 1:", await accounts[0].getAddress());
    console.log("Account 2:", await accounts[1].getAddress());

    // 3. Generate demonstration keys
    const wallet = ethers.Wallet.createRandom();

    console.log("\n========== KEY GENERATION ==========");
    console.log("Generated Public Address:", wallet.address);
    console.log("Generated Private Key:", wallet.privateKey);

    // 4. Display existing blockchain blocks
    console.log("\n========== EXISTING BLOCKCHAIN ==========");

    const beforeBlock = await ethers.provider.getBlockNumber();

    console.log("Current Block Height:", beforeBlock);

    for (let i = 0; i <= beforeBlock; i++) {
        const block = await ethers.provider.getBlock(i);

        console.log("\n----------------------------------------");
        console.log("BLOCK NUMBER:", block.number);
        console.log("BLOCK HASH:", block.hash);
        console.log("PREVIOUS BLOCK HASH:", block.parentHash);
        console.log("TIMESTAMP:", block.timestamp);
        console.log("TRANSACTION COUNT:", block.transactions.length);

        block.transactions.forEach((hash) => {
            console.log("TRANSACTION HASH:", hash);
        });
    }

    // 5. Create a sample blockchain transaction
    console.log("\n========== TRANSACTION CREATION ==========");

    const tx = await accounts[0].sendTransaction({
        to: await accounts[1].getAddress(),
        value: ethers.parseEther("0.1")
    });

    console.log("Transaction Submitted!");
    console.log("Transaction Hash:", tx.hash);

    // 6. Wait for mining
    const receipt = await tx.wait();

    console.log("\n========== MINING DETAILS ==========");
    console.log("Transaction Mined Successfully!");
    console.log("Block Number:", receipt.blockNumber);
    console.log("Transaction Hash:", receipt.hash);
    console.log("Gas Used:", receipt.gasUsed.toString());
    console.log("Transaction Status:", receipt.status === 1 ? "Success" : "Failed");

    // 7. Display newly created block
    const newBlock = await ethers.provider.getBlock(receipt.blockNumber);

    console.log("\n========== NEW BLOCK DETAILS ==========");
    console.log("Block Number:", newBlock.number);
    console.log("Block Hash:", newBlock.hash);
    console.log("Previous Block Hash:", newBlock.parentHash);
    console.log("Transactions in Block:", newBlock.transactions.length);

    // 8. Final blockchain height
    console.log("\n========== FINAL BLOCKCHAIN STATUS ==========");
    console.log("Latest Block Number:", await ethers.provider.getBlockNumber());

    console.log("\n========================================");
    console.log("       DEMO COMPLETED SUCCESSFULLY");
    console.log("========================================\n");
}

main().catch((error) => {
    console.error("Demo Error:", error);
    process.exitCode = 1;
});
