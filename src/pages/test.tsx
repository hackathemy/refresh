import Head from "next/head";
import * as material from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { ethers } from "ethers";
import { networks } from "@/types/networks";
import React, { useState, KeyboardEvent } from "react";

const Page = () => {
  // TODO: 이거 usestate? global state 변경해줘야 하는데 어떻게 해야할지 모르겠습니다..
  // const [account, web3] = useWeb3();
  const PROTOCOL_ADDRESS = `0x8edbc869108da99f6feb062136bc7d7aa5764542`;

  const [inputNetwork, setNetwork] = useState("");
  const [inputAmount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const network = (e.target as HTMLInputElement).value;
      setNetwork(network);
    }
  };

  const handleKeyPressOnAmount = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const amount = (e.target as HTMLInputElement).value;
      setAmount(amount);
    }
  };

  const handleChangeOnAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  // TODO: What about moving these all function to function directory in next.js src
  const SwitchNetworkComponent = () => {
    const selectedNetwork = inputNetwork;
    // Save window.ethereum globally for use across multiple pages
    if (window.ethereum) {
      window.ethereum.enable(); // Enable Ethereum provider

      // Create an ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      // window.ethersProvider = provider;

      // Switch to the desired network (e.g., Binance Smart Chain)
      const switchToNetwork = async () => {
        try {
          const chainId = "0x" + networks[selectedNetwork].chainId.toString(16);

          // Switch network using provider.send method
          // TODO: make this as a object for using in network types
          await provider.send("wallet_addEthereumChain", [
            {
              chainId,
              chainName: networks[selectedNetwork].chainName,
              nativeCurrency: {
                symbol: networks[selectedNetwork].nativeCurrencySymbol,
                decimals: 18,
              },
              rpcUrls: [networks[selectedNetwork].rpcURL],
              blockExplorerUrls: [networks[selectedNetwork].blockExplorerURL],
            },
          ]);
        } catch (error) {
          console.error("Error switching network:", error);
        }
      };

      switchToNetwork();
    } else {
      console.error("MetaMask not detected!");
    }
  };

  const approveToken = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        return;
      }
      const networkName: string = inputNetwork;

      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const fundingContractAddress = networks[networkName].fundingContract;
      // information depend on the source chain
      const erc20ContractAddress = networks[networkName].bnmToken;
      // Connect to ERC-20 contract
      const erc20Contract = new ethers.Contract(
        erc20ContractAddress,
        ["function approve(address spender, uint256 amount)"],
        signer
      );

      // Approve the spender
      const amount = parseInt(inputAmount);
      const tx = await erc20Contract.approve(fundingContractAddress, amount);
      await tx.wait();

      // TODO: change to temprary modal for ux
      // TODO: wait for a while for confirming tx in the network
      console.log("Transaction Hash:", tx);
      alert("Transfer successful!");
    } catch (error) {
      console.error("Error approving spender:", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
  };
  const checkAllowance = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        console.error("MetaMask not detected!");
        return;
      }

      // TODO: change to input? in async (networkName:string)
      // TODO: change to use netowork name from current connected network id or name, somethign
      const networkName: string = inputNetwork;
      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // information depend on the source chain
      const erc20ContractAddress = networks[networkName].bnmToken;
      const fundingContractAddress = networks[networkName].fundingContract;

      // Connect to ERC-20 contract
      // TODO: aggreate all erc20 interfaces
      const erc20Contract = new ethers.Contract(
        erc20ContractAddress,
        [
          "function allowance(address owner, address spender) external view returns (uint256)",
        ],
        signer
      );

      // Check the allowance after approval
      const spenderAllowance = await erc20Contract.allowance(
        signer.address,
        fundingContractAddress
      );

      alert(`Spender Allowance:${spenderAllowance.toString()}`);
    } catch (error) {
      console.error("Error approving spender:", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };

  const fundWithCCIP = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        return;
      }
      const networkName: string = inputNetwork;

      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // we need to add validate logic for users. when a user send project index which there isn't, this tx is gonna revert.
      const fundingContractAddress = networks[networkName].fundingContract;
      const erc20ContractAddress = networks[networkName].bnmToken;

      // create a contract instance
      const fundingContract = new ethers.Contract(
        fundingContractAddress,
        [
          `function sendMessagePayLINK(
          address _receiver,
          uint _index,
          address _token,
          uint256 _amount
        ) external returns (bytes32 messageId)`,
        ],
        signer
      );

      // Approve the spender
      const tx = await fundingContract.sendMessagePayLINK(
        PROTOCOL_ADDRESS, // receive address = polygon protocol address
        1, // project index
        erc20ContractAddress, // token
        inputAmount // amount
      );

      const receipt = await tx.wait();
      console.log(receipt);
      alert(`${receipt}`);
    } catch (error) {
      console.error("Error approving spender:", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Projects</title>
      </Head>
      <material.Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <material.Container maxWidth="xl">
          <material.Card>
            <material.CardContent>
              Here is a test components for interacting blockchain network and
              contract
              <material.Button fullWidth size="large" sx={{}}>
                Set Network For Testing :{inputNetwork}
                <material.TextField
                  sx={{ ml: 3, width: "20%", height: "5%" }}
                  type="text"
                  label="Enter a network name"
                  onKeyDown={handleKeyPress}
                />
              </material.Button>
              <material.Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={SwitchNetworkComponent}
              >
                <div>Chain Network To {inputNetwork} </div>
              </material.Button>
              <material.Card sx={{ mt: 3 }}>
                Approve Fund Token: {inputAmount}
                <material.TextField
                  sx={{ ml: 3, width: "20%" }}
                  type="text"
                  label="Enter a amout which you want to fund"
                  onKeyDown={handleKeyPressOnAmount}
                  onChange={handleChangeOnAmount}
                />
                <material.Button
                  sx={{ ml: 3 }}
                  variant="contained"
                  onClick={approveToken}
                >
                  Click
                </material.Button>
              </material.Card>
              <material.Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={checkAllowance}
              >
                {/* // TODO:Change state by queyring contract */}
                Check Allowance Token
              </material.Button>
              <material.Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={fundWithCCIP}
              >
                {/* // TODO:Change state by queyring contract */}
                Funding: {inputAmount}
              </material.Button>
            </material.CardContent>
          </material.Card>
        </material.Container>
      </material.Box>
    </DashboardLayout>
  );
};

export default Page;
