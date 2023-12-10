import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
import Web3, { utils } from "web3";
import TokenContract from "../../../public/assets/abi/sender_abi.json";
import Erc20TokenContract from "../../../public/assets/abi/erc20_abi.json";
import { useWeb3 } from "@/hooks/useWeb3";
import { Box, DialogContent, Divider, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { networks } from "@/types/networks";
import { MetaMaskInpageProvider } from "@metamask/providers";
const emails = ["ETH Sepolia", "Avax"];

export interface SimpleDialogProps {
  open: boolean;

  onClose: (value: string) => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  //const [account, web3] = useWeb3();
  const { onClose, open } = props;
  const [tokenAmount, setTokenAmount] = useState("0");
  const [ethAmount, setEthAmount] = useState("0");
  const [avaxAmount, setAvaxAmount] = useState("0");
  const [bnbAmount, setBnbAmount] = useState("0");
  const [opAmount, setOpAmount] = useState("0");
  const [selectChain, setSelectChain] = useState("");
  const [openOuterDialog, setOpenOuterDialog] = useState(false);
  const [openInnerDialog, setOpenInnerDialog] = useState(false);
  const [inputValue, setInputValue] = useState("0");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleClose = () => {
    onClose("");
  };

  const handleOpenOuterDialog = () => {
    setOpenOuterDialog(true);
  };

  const handleCloseOuterDialog = () => {
    setOpenOuterDialog(false);
    // Close inner dialog if it's open when closing the outer dialog
    if (openInnerDialog) {
      setOpenInnerDialog(false);
    }
  };

  const handleOpenInnerDialog = (selectChain: string) => {
    setSelectChain(selectChain);
    if (selectChain === "Fuji") {
      setTokenAmount(avaxAmount);
    } else if (selectChain === "Sepolia") {
      setTokenAmount(ethAmount);
    } else if (selectChain === "Bnb") {
      setTokenAmount(bnbAmount);
    } else if (selectChain === "Optimism") {
      setTokenAmount(opAmount);
    }
    setOpenInnerDialog(true);
  };

  const handleCloseInnerDialog = () => {
    setOpenInnerDialog(false);
  };

  const handleListItemClick = async (value: string) => {
    onClose(value);
  };

  const approveToken = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        return;
      }

      // TODO: change to input? in async (networkName:string)

      const networkName: string = selectChain.toLowerCase();

      // chain type check
      if ((await getCurChainId()) !== networks[networkName].chainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          // 0x13881 == 80001 == polygon testnet chain ID
          params: [{ chainId: networks[networkName].chainId16 }],
        });
      }

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
      console.log("toWei : " + utils.toWei(inputValue, "ether"));
      // Approve the spender
      const tx = await erc20Contract.approve(
        fundingContractAddress,
        utils.toWei(inputValue, "ether")
      );
      //const tx = await erc20Contract.approve(fundingContractAddress, 20000);
      await tx.wait();

      // TODO: change to temprary modal for ux
      // TODO: wait for a while for confirming tx in the network
      console.log("Transaction Hash:", tx);
      await fundWithCCIP();
    } catch (error) {
      console.error("Error approving spender:", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };

  const fundWithCCIP = async () => {
    console.log("fundWIthCCIP");

    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        return;
      }
      const networkName: string = selectChain.toLowerCase();

      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // we need to add validate logic for users. when a user send project index which there isn't, this tx is gonna revert.
      const fundingContractAddress = networks[networkName].fundingContract;
      const erc20ContractAddress = networks[networkName].bnmToken;
      const PROTOCOL_ADDRESS = `0x8edbc869108da99f6feb062136bc7d7aa5764542`;
      // Gas options
      const gasPrice = utils.toWei("50", "gwei");
      const gasLimit = 1000000;
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
        //20000,
        utils.toWei(inputValue, "ether"), // amount
        { gasPrice: gasPrice, gasLimit: gasLimit }
      );

      const receipt = await tx.wait();
      // Assuming there is an Event interface with the expected structure
      interface Event {
        event: string;
        args: {
          messageId: string;
        };
      }
      console.log(receipt);
      console.log(receipt.events);

      const messageId = await getTransactionReceipt(receipt.hash);
      alert("Fund Success");

      const currentUrl = window.location.href;
      console.log(currentUrl);
      const projectId = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
      console.log(projectId);
      const values = {
        projectId: projectId,
        address: window.ethereum.selectedAddress,
        amount: inputValue,
        chain: selectChain,
        messageId: messageId,
      };
      try {
        axios
          .post("/api/funding/" + projectId, values)
          .then(async function (response) {
            if (response.status === 200) {
              console.log("success");
            } else {
              console.error(JSON.stringify(response.data));
            }
          })
          .catch(function (error: any) {
            console.error(JSON.stringify(error));
          })
          .finally(() => {});
      } catch (err: any) {
        console.log(err.message);
      }
      getTokenAmountBySepolia();
      getTokenAmountByFuji();
      getTokenAmountByBsc();
      getTokenAmountByOp();
    } catch (error) {
      console.error("Error CCIP :", error);
      alert("Error transferring tokens. Check the console for details.");
    }

    setOpenInnerDialog(false);
    setOpenOuterDialog(false);
    onClose("close");
  };

  const getTransactionReceipt = async (transactionHash: string) => {
    try {
      let provider: any = new Web3(window.ethereum);
      // if(selectChain == 'Fuji'){
      //   const infuraAvaxURL = process.env.NEXT_PUBLIC_INFURA_AVAX;
      //   provider = new Web3(
      //     new Web3.providers.HttpProvider(infuraAvaxURL ?? "")
      //   );
      // }else if(selectChain == 'Sepolia'){
      //   const alchemySepoliaURL = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA;
      //   provider = new Web3(
      //     new Web3.providers.HttpProvider(alchemySepoliaURL ?? "")
      //   );
      // }else if(selectChain == 'Bnb'){
      //   const alchemySepoliaURL = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA;
      //   provider = new Web3(
      //     new Web3.providers.HttpProvider(alchemySepoliaURL ?? "")
      //   );
      // }

      const receipt: any = await provider.eth.getTransactionReceipt(
        transactionHash
      );
      console.log("Transaction Receipt:", receipt);
      const messageId = receipt.logs[receipt.logs.length - 1].topics[1];
      console.log(`https://ccip.chain.link/msg/${messageId}`);
      return messageId;
    } catch (error) {
      console.error("Error fetching transaction receipt:", error);
      return "";
    }
  };

  const getCurChainId = async () => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    const curChainId = await eth.request({
      method: "eth_chainId",
    });
    console.log("curChainId : " + curChainId);
    return curChainId;
  };

  const getTokenAmountBySepolia = async () => {
    const sepoliaSettings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA, // Replace with your Alchemy API Key.
      network: Network.ETH_SEPOLIA, // Replace with your network.
    };
    const sepolia = new Alchemy(sepoliaSettings);

    // The wallet address / token we want to query for:
    const ownerAddr = window.ethereum.selectedAddress;
    const balances = await sepolia.core.getTokenBalances(ownerAddr, [
      "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
    ]);

    // Removing the '0x' prefix
    const cleanedHex = balances.tokenBalances[0].tokenBalance?.slice(2);

    // 16진수를 10진수로 변환
    const decimalValue = BigInt("0x" + cleanedHex);

    // wei에서 ether로 변환
    const etherValue = Utils.formatUnits(decimalValue.toString(), "ether");

    console.log("Token Balances:");
    //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
    console.log(etherValue);

    setEthAmount(etherValue);
  };

  const getTokenAmountByFuji = async () => {
    const infuraAvaxURL = process.env.NEXT_PUBLIC_INFURA_AVAX;
    const infura = new Web3(
      new Web3.providers.HttpProvider(infuraAvaxURL ?? "")
    );

    // DAI token contract
    const tokenContract = "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4";
    // A DAI token holder
    const tokenHolder = window.ethereum.selectedAddress;
    const contract = new infura.eth.Contract(Erc20TokenContract, tokenContract);

    const result = await (contract.methods as any)
      .balanceOf(tokenHolder)
      .call();
    console.log(result);

    const formattedResult = Utils.formatUnits(result, "ether");
    //console.log();

    // Removing the '0x' prefix
    // const cleanedHex = balances.tokenBalances[0].tokenBalance?.slice(2);

    // 16진수를 10진수로 변환
    //const decimalValue = BigInt('0x' + cleanedHex);

    // wei에서 ether로 변환
    //const etherValue = web3.utils.fromWei(decimalValue.toString(), 'ether');

    console.log("AVAX Token Balances: " + formattedResult.substring(0, 5));
    //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
    //console.log(etherValue);

    setAvaxAmount(formattedResult.substring(0, 5));
  };

  const getTokenAmountByBsc = async () => {
    const bscURL = "https://data-seed-prebsc-1-s1.binance.org:8545";
    const bsc = new Web3(new Web3.providers.HttpProvider(bscURL ?? ""));

    // DAI token contract
    const tokenContract = "0xbFA2ACd33ED6EEc0ed3Cc06bF1ac38d22b36B9e9";
    // A DAI token holder
    const tokenHolder = window.ethereum.selectedAddress;
    const contract = new bsc.eth.Contract(Erc20TokenContract, tokenContract);

    const result = await (contract.methods as any)
      .balanceOf(tokenHolder)
      .call();
    console.log(result);

    const formattedResult = Utils.formatUnits(result, "ether");
    //console.log();

    // Removing the '0x' prefix
    // const cleanedHex = balances.tokenBalances[0].tokenBalance?.slice(2);

    // 16진수를 10진수로 변환
    //const decimalValue = BigInt('0x' + cleanedHex);

    // wei에서 ether로 변환
    //const etherValue = web3.utils.fromWei(decimalValue.toString(), 'ether');

    console.log(
      "Bsc Testnet Token Balances: " + formattedResult.substring(0, 5)
    );
    //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
    //console.log(etherValue);

    setBnbAmount(formattedResult.substring(0, 5));
  };

  const getTokenAmountByOp = async () => {
    const bscURL = "https://goerli.optimism.io";
    const bsc = new Web3(new Web3.providers.HttpProvider(bscURL ?? ""));

    // DAI token contract
    const tokenContract = "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16";
    // A DAI token holder
    const tokenHolder = window.ethereum.selectedAddress;
    const contract = new bsc.eth.Contract(Erc20TokenContract, tokenContract);

    const result = await (contract.methods as any)
      .balanceOf(tokenHolder)
      .call();
    console.log(result);

    const formattedResult = Utils.formatUnits(result, "ether");
    //console.log();

    // Removing the '0x' prefix
    // const cleanedHex = balances.tokenBalances[0].tokenBalance?.slice(2);

    // 16진수를 10진수로 변환
    //const decimalValue = BigInt('0x' + cleanedHex);

    // wei에서 ether로 변환
    //const etherValue = web3.utils.fromWei(decimalValue.toString(), 'ether');

    console.log(
      "OP Testnet Token Balances: " + formattedResult.substring(0, 5)
    );
    //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
    //console.log(etherValue);

    setOpAmount(formattedResult.substring(0, 5));
  };

  useEffect(() => {
    const isConnect = localStorage.getItem("isConnect");
    if (isConnect == "true") {
      getTokenAmountBySepolia();
      getTokenAmountByFuji();
      getTokenAmountByBsc();
      getTokenAmountByOp();
    }
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle variant="h3">Select Source Chain</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          You can easily fund great projects with assets from various chains
          (Chainlink CCIP)
        </Typography>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleOpenInnerDialog("Fuji")}>
              <ListItemAvatar>
                <Avatar src="/assets/images/avalanche-avax-logo.svg">
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`[Fuji] Available : ${avaxAmount} CCIP-BnM`}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleOpenInnerDialog("Sepolia")}>
              <ListItemAvatar>
                <Avatar src="/assets/images/eth-diamond-black-white.jpg">
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`[Sepolia] Available : ${ethAmount} CCIP-BnM`}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleOpenInnerDialog("Bnb")}>
              <ListItemAvatar>
                <Avatar
                  sx={{ width: 70, height: 50, marginLeft: -2 }}
                  src="/assets/images/binance-smart-chain-bsc-seeklogo.com.svg"
                >
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`[Bsc Testnet] Available : ${bnbAmount} CCIP-BnM`}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleOpenInnerDialog("Optimism")}>
              <ListItemAvatar>
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.png"
                >
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`[Optimism] Available : ${opAmount} CCIP-BnM`}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Dialog
          open={openInnerDialog}
          onClose={handleCloseInnerDialog}
          fullWidth={true}
        >
          <DialogTitle variant="h3">Funding</DialogTitle>
          <DialogContent>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Selected Chain : {selectChain}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 5 }}>
              Input funding amount from Source chain.
            </Typography>
            <TextField
              id="outlined-basic"
              fullWidth
              label="Funding Amount (CCIP-BnM)"
              variant="outlined"
              sx={{ mt: 3 }}
              value={inputValue} //
              onChange={handleInputChange} // inp
            />
            <Box display="flex" justifyContent="flex-end">
              <small>Available : {tokenAmount} CCIP-BnM</small>
            </Box>
            <Divider />

            <Box display="flex" justifyContent="flex-end" sx={{ mt: 8 }}>
              <Button variant="outlined" onClick={approveToken}>
                Funding
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseInnerDialog}
                sx={{ ml: 2 }}
              >
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
