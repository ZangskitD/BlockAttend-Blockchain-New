import { BrowserProvider, Contract } from "ethers";
import abi from "./contract-abi.json";
import addressConfig from "./contract-address.json";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask is not installed. Install MetaMask and try again.");
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  if (!accounts.length) throw new Error("No wallet account was selected.");
  const signer = await provider.getSigner();
  return { provider, signer, address: accounts[0] };
}
export async function getContract(signerOrProvider) {
  if (!addressConfig.address) throw new Error("Contract not deployed. Follow the README deployment steps first.");
  return new Contract(addressConfig.address, abi, signerOrProvider);
}
export function shortAddress(address = "") {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Not connected";
}

export function errorMessage(error) {
  console.error("FULL BLOCKCHAIN ERROR:", error);

  const messages = [
    error?.reason,
    error?.shortMessage,
    error?.info?.error?.message,
    error?.error?.message,
    error?.message
  ].filter(Boolean);

  const reason = messages.join(" | ");

  if (/user rejected|user denied/i.test(reason)) {
    return "Transaction was rejected in MetaMask.";
  }

  if (/4100|unauthorized|not been authorized/i.test(reason)) {
    return "MetaMask wallet permission error. Reconnect your wallet.";
  }

  if (/4001/i.test(reason)) {
    return "Transaction was rejected in MetaMask.";
  }

  if (/AlreadyDone/i.test(reason)) {
    return "This action has already been completed.";
  }

  if (/NotApproved/i.test(reason)) {
    return "Student approval is required.";
  }

  if (/Unauthorized/i.test(reason)) {
    return "This wallet does not have permission.";
  }

  if (/SessionUnavailable/i.test(reason)) {
    return "The attendance session is closed or expired.";
  }

  if (/NotFound/i.test(reason)) {
    return "Course or session not found.";
  }

  if (/InvalidInput/i.test(reason)) {
    return "The contract rejected the input.";
  }

  return reason || "Unknown blockchain error. Check the browser console.";
}