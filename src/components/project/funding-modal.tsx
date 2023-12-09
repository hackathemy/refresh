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
import { DialogContent, Divider, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { networks } from "@/types/networks";
import { MetaMaskInpageProvider } from "@metamask/providers";
const emails = ["ETH Sepolia", "Avax"];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  //const [account, web3] = useWeb3();
  const { onClose, selectedValue, open } = props;
  const [tokenAmount, setTokenAmount] = useState("0");
  const [ethAmount, setEthAmount] = useState("0");
  const [avaxAmount, setAvaxAmount] = useState("0");
  const [selectChain, setSelectChain] = useState("");
  const [openOuterDialog, setOpenOuterDialog] = useState(false);
  const [openInnerDialog, setOpenInnerDialog] = useState(false);
  const [inputValue, setInputValue] = useState('0');

  const handleInputChange = (event:any) => {
    setInputValue(event.target.value);
  };

  const handleClose = () => {
    onClose(selectedValue);
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
    alert('approve')
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        return;
      }

      
      // TODO: check this network id or name and should not be set polygon network.
      // const networkId = await window.ethereum.request({
      // method: "net_version",
      // });
      // console.log("Connected Network ID:", networkId);

      // TODO: change to input? in async (networkName:string)
      const networkName: string = selectChain.toLowerCase();
      const infuraSepoliaURL = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL;

      // chain type check
      if(await getCurChainId() !== networks[networkName].chainId){
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
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
      const tx = await erc20Contract.approve(signer, utils.toWei(inputValue, "ether"));
      //const tx = await erc20Contract.approve(fundingContractAddress, 20000);
      await tx.wait();

      // TODO: change to temprary modal for ux
      // TODO: wait for a while for confirming tx in the network
      console.log("Transaction Hash:", tx);
      alert("Transfer successful!");
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
      const gasPrice = utils.toWei('50', 'gwei');
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
        20000,
        //utils.toWei(inputValue, "wei"), // amount
        { gasPrice: gasPrice,
          gasLimit: gasLimit
        } 
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
      
      // Find the "MessageSent" event in the transaction logs
      const messageSentEvent = receipt.events.find(
        (event: Event) => event.event === "MessageSent"
      );

      if (messageSentEvent) {
        // Access the return value from the event
        const messageId = messageSentEvent.args.messageId;
        console.log("Message ID:", messageId);
        alert(`https://ccip.chain.link/msg/${messageId}`);
      } else {
        console.error("MessageSent event not found in transaction logs");
      }
    } catch (error) {
      console.error("Error CCIP :", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };

  const getTransactionLog = async (txHash:string) => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=logs&action=getLogs&txhash=${txHash}`
      );
  
      const logs = response.data.result;
      // 여기서 logs를 적절히 처리하고 messageid를 얻어내세요.
      console.log(logs);
    } catch (error) {
      console.error('Error fetching transaction logs:', error);
    }
  };

const getTransactionReceipt = async () => {
  try {
    const infuraUrl = 'https://api.avax.network/ext/bc/C/rpc'; // Avalanche C-Chain Infura endpoint
    const web3 = new Web3(infuraUrl);

    const infuraAvaxURL = process.env.NEXT_PUBLIC_INFURA_AVAX;
    const infura = new Web3(
      new Web3.providers.HttpProvider(infuraAvaxURL ?? "")
    );
    
    const transactionHash = '0x7e70b931e6720c28906e4140f77b052cc2234b3b9b71f45ad0c144987050a3b5';
    
    const receipt = await infura.eth.getTransactionReceipt(transactionHash);
    console.log('Transaction Receipt:', receipt);
    const messageId = receipt.logs[receipt.logs.length -1].topics[1];
    console.log(`https://ccip.chain.link/msg/${messageId}`)
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
  }
}


  const getCurChainId = async () => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    const curChainId = await eth.request({
      method: 'eth_chainId',
    });
    console.log("curChainId : " + curChainId);
    return curChainId;
  };


  const sendCCIP = async () => {
    console.log(selectChain);
    const infuraSepoliaURL = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL;
    const infura = new Web3(
      new Web3.providers.HttpProvider(infuraSepoliaURL ?? "")
    );
  
    const contractAddress = "0x18921Ba7EB599DA91C9A382a618f2f523Cde15c2"; // Matic 토큰 컨트랙트 주소
    const contractAbi = TokenContract; // 전송 함수에 대한 ABI
    const contract = new infura.eth.Contract(contractAbi, contractAddress);

    // 메서드의 인자 값 설정
    const destinationChainSelector = 12532609583862916517;
    const receiver = "0x9F70C778aD5A738beFD577f12e6e9C1Bc9fBfd48";
    const text = "sm test";
    const token = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05";
    const amount = infura.utils.toWei("0.1", "ether");

    // Contract 메서드 호출 데이터 생성
    const data = (contract.methods as any)
      .sendMessagePayLINK(
        //destinationChainSelector,
        receiver,
        text,
        token,
        amount
      )
      .encodeABI();

    // 트랜잭션 객체 생성
    const transactionObject = {
      from: window.ethereum.selectedAddress,
      to: contractAddress,
      gas: "200000", // 예상 가스 비용
      data: data,
    };

    console.log(transactionObject);

    // MetaMask로 트랜잭션 전송 요청
    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [transactionObject],
      })
      .then((txHash: any) => {
        console.log("Transaction Hash:", txHash);
        
        const currentUrl = window.location.href;
        console.log(currentUrl);
        const projectId = currentUrl.substring(currentUrl.lastIndexOf("/")+1);
        console.log(projectId);
        const values = {
          projectId : projectId,
          address : window.ethereum.selectedAddress,
          amount : inputValue,
          chain : selectChain
        }
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
        getTokenAmountByCCIP();
        getTokenAmount2ByCCIP();
      })
      .catch((error: any) => {
        console.error("Transaction Error:", error);
      });

    setOpenInnerDialog(false);
    setOpenOuterDialog(false);
    onClose("close");
  };

  const getTokenAmountByCCIP = async () => {
   
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

  const getTokenAmount2ByCCIP = async () => {
 
    const infuraAvaxURL = process.env.NEXT_PUBLIC_INFURA_AVAX;
    const infura = new Web3(
      new Web3.providers.HttpProvider(infuraAvaxURL ?? "")
    );

    // DAI token contract
    const tokenContract = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
    // A DAI token holder
    const tokenHolder = window.ethereum.selectedAddress;
    const contract = new infura.eth.Contract(Erc20TokenContract, tokenContract);

    const result = await (contract.methods as any)
      .balanceOf(tokenHolder)
      .call();
    const formattedResult = Utils.formatUnits(result, "ether");
    //console.log();

    // Removing the '0x' prefix
    // const cleanedHex = balances.tokenBalances[0].tokenBalance?.slice(2);

    // 16진수를 10진수로 변환
    //const decimalValue = BigInt('0x' + cleanedHex);

    // wei에서 ether로 변환
    //const etherValue = web3.utils.fromWei(decimalValue.toString(), 'ether');

    console.log("AVAX Token Balances: " + formattedResult);
    //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
    //console.log(etherValue);

    setAvaxAmount(formattedResult);
  };

  useEffect(() => {
    const isConnect = localStorage.getItem('isConnect');
    if(isConnect == 'true'){
      getTokenAmountByCCIP();
      getTokenAmount2ByCCIP();
    }
   
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>체인 선택하기</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleOpenInnerDialog("Fuji")}>
              <ListItemAvatar>
                <Avatar src="/assets/images/avalanche-avax-logo.svg">
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Fuji 보유 BNM 수량 : ${avaxAmount} CCIP-BnM`}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton
              onClick={() => handleOpenInnerDialog("Sepolia")}
            >
              <ListItemAvatar>
                <Avatar src="/assets/images/eth-diamond-black-white.jpg">
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Sepolia 보유 BNM 수량 : ${ethAmount} CCIP-BnM`}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Dialog
          open={openInnerDialog}
          onClose={handleCloseInnerDialog}
          fullWidth={true}
          maxWidth={"xs"}
        >
          <DialogTitle>펀딩 하기</DialogTitle>
          <DialogContent>
            선택한 체인 : {selectChain}
            <Divider />
            펀딩 수량(CCip-BnM)을 입력하세요.
            <Divider />
            가능 수량 : {tokenAmount} CCIP-BnM
            <Divider />
            <TextField
              id="outlined-basic"
              label="CCIP-BnM 수량 입력"
              variant="outlined"
              sx={{marginTop:2,}}
              value={inputValue} // 
              onChange={handleInputChange} // inp
            />
            <Divider />
            <Button
              variant="outlined"
              onClick={approveToken}
              sx={{ marginTop: 10 }}
            >
              펀딩하기
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseInnerDialog}
              sx={{ marginTop: 10 }}
            >
              취소
            </Button>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
