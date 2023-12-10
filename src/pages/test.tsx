import Head from "next/head";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { ethers } from "ethers";
import { mappedNetworks, networks } from "@/types/networks";
import React, { useState, KeyboardEvent, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";

const Page = () => {
  // TODO: 이거 usestate? global state 변경해줘야 하는데 어떻게 해야할지 모르겠습니다..
  // const [account, web3] = useWeb3();
  const PROTOCOL_ADDRESS = `0x8edbc869108da99f6feb062136bc7d7aa5764542`;

  const [inputAmount, setAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(networks["sepolia"]);

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
  const changeNetwork = (network: any) => {
    // Save window.ethereum globally for use across multiple pages
    if (window.ethereum) {
      window.ethereum.enable(); // Enable Ethereum provider
      // Create an ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      // window.ethersProvider = provider;

      // Switch to the desired network (e.g., Binance Smart Chain)
      const switchToNetwork = async () => {
        try {
          // Switch network using provider.send method
          // TODO: make this as a object for using in network types
          await provider.send("wallet_addEthereumChain", [
            {
              chainId: network.chainId16,
              chainName: network.chainName,
              nativeCurrency: {
                symbol: network.nativeCurrencySymbol,
                decimals: 18,
              },
              rpcUrls: [network.rpcURL],
              blockExplorerUrls: [network.blockExplorerURL],
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

      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const fundingContractAddress = selectedNetwork.fundingContract;
      // information depend on the source chain
      const erc20ContractAddress = selectedNetwork.bnmToken;
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

  const checkAllowance = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        console.error("MetaMask not detected!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // information depend on the source chain
      const erc20ContractAddress = selectedNetwork.bnmToken;
      const fundingContractAddress = selectedNetwork.fundingContract;

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

      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // we need to add validate logic for users. when a user send project index which there isn't, this tx is gonna revert.
      const fundingContractAddress = selectedNetwork.fundingContract;
      const erc20ContractAddress = selectedNetwork.bnmToken;

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

  const handleChange = useCallback((event: any) => {
    const find = mappedNetworks.find((network) => {
      return network.chainId === parseInt(event.target.value);
    });
    if (find) {
      setSelectedNetwork(find);
      changeNetwork(find);
    }
  }, []);

  return (
    <DashboardLayout>
      <Head>
        <title>Projects</title>
      </Head>
      <Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h4">[DEV] Funding Flow</Typography>
                <Divider />
                <Typography variant="body1">
                  Select source network for CCIP
                </Typography>
                <TextField
                  label="Select Network"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                >
                  {mappedNetworks.map((option) => (
                    <option key={option.chainId} value={option.chainId}>
                      {option.chainName}
                    </option>
                  ))}
                </TextField>
                <Divider />
                <Typography variant="body1">
                  Approve Funding Token for Call Contracts
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  label="Enter a amout which you want to fund"
                  onKeyDown={handleKeyPressOnAmount}
                  onChange={handleChangeOnAmount}
                />
                <Button
                  sx={{ ml: 3 }}
                  variant="contained"
                  size="large"
                  onClick={approveToken}
                >
                  Approve
                </Button>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  variant="contained"
                  onClick={checkAllowance}
                >
                  Check Allowance Token
                </Button>
                <Divider />
                <Typography variant="body1">Call Funding Contract</Typography>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  variant="contained"
                  onClick={fundWithCCIP}
                >
                  Funding: {inputAmount}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
