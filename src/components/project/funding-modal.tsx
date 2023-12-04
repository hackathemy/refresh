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
import Web3 from "web3";
import TokenContract from "../../../public/assets/abi/sender_abi.json";
import Erc20TokenContract from "../../../public/assets/abi/erc20_abi.json";
import { useWeb3 } from "@/hooks/useWeb3";
import { DialogContent, Divider, TextField } from "@mui/material";
const emails = ["ETH Sepolia", "Avax"];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {
  const [account, web3] = useWeb3();
  const { onClose, selectedValue, open } = props;
  const [ tokenAmount, setTokenAmount ] = useState('0');
  const [ ethAmount, setEthAmount ] = useState('0');
  const [ avaxAmount, setAvaxAmount ] = useState('0');
  const [ selectChain, setSelectChain] = useState('');
  const [openOuterDialog, setOpenOuterDialog] = useState(false);
  const [openInnerDialog, setOpenInnerDialog] = useState(false);
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

  const handleOpenInnerDialog = (selectChain:string) => {
    setSelectChain(selectChain);
    if(selectChain === 'AVAX/Fuji'){
      setTokenAmount(avaxAmount);
    }else if(selectChain === 'ETH/Sepolia'){
      setTokenAmount(ethAmount);
    }
    setOpenInnerDialog(true);
  };

  const handleCloseInnerDialog = () => {
    setOpenInnerDialog(false);
  };
  

  const handleListItemClick = async (value: string) => {
    if (!window.ethereum) {
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    onClose(value);
  };

  const sendCCIP = async () => {
    if (!web3 || !web3.currentProvider) {
      return;
    }
    const contractAddress =
      "0x18921Ba7EB599DA91C9A382a618f2f523Cde15c2"; // Matic 토큰 컨트랙트 주소
    const contractAbi = TokenContract; // 전송 함수에 대한 ABI
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    // 메서드의 인자 값 설정
    const destinationChainSelector = 12532609583862916517;
    const receiver = "0x9F70C778aD5A738beFD577f12e6e9C1Bc9fBfd48";
    const text = "sm test";
    const token = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05";
    const amount = web3.utils.toWei("0.1", "ether");

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
      from: account,
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
      })
      .catch((error: any) => {
        console.error("Transaction Error:", error);
      });

    setOpenInnerDialog(false);
    setOpenOuterDialog(false);
    onClose('close');
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
    const decimalValue = BigInt('0x' + cleanedHex);

    // wei에서 ether로 변환
    const etherValue = Utils.formatUnits(decimalValue.toString(), 'ether');

    
    console.log("Token Balances:");
    //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
    console.log(etherValue);
   
    setEthAmount(etherValue);

    
  }

  const getTokenAmount2ByCCIP = async () => {
    const infuraAvaxURL = process.env.NEXT_PUBLIC_INFURA_AVAX;    
    const infura = new Web3(
      new Web3.providers.HttpProvider(
        infuraAvaxURL,
      ),
    );

    // DAI token contract
    const tokenContract = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
    // A DAI token holder
    const tokenHolder = window.ethereum.selectedAddress;
    const contract = new infura.eth.Contract(Erc20TokenContract, tokenContract);

    const result = await contract.methods.balanceOf(tokenHolder).call();
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

    
  }

  useEffect(() => {
    getTokenAmountByCCIP();
    getTokenAmount2ByCCIP();
  }, [])

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>체인 선택하기</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters >
              <ListItemButton onClick={() => handleOpenInnerDialog('AVAX/Fuji')}>
                <ListItemAvatar>
                  <Avatar src="/assets/images/avalanche-avax-logo.svg">
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`AVAX/Fuji 보유 BNM 수량 : ${avaxAmount} CCIP-BnM`} />
              </ListItemButton>
            </ListItem>
          <ListItem disableGutters >
          <ListItemButton onClick={() => handleOpenInnerDialog('ETH/Sepolia')}>
                <ListItemAvatar>
                  <Avatar src="/assets/images/eth-diamond-black-white.jpg">
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`ETH/Sepolia 보유 BNM 수량 : ${ethAmount} CCIP-BnM`} />
              </ListItemButton>
            </ListItem>          
        </List>
        <Dialog open={openInnerDialog} onClose={handleCloseInnerDialog} fullWidth={true} maxWidth={"xs"}>
          <DialogTitle>펀딩 하기</DialogTitle>
          <DialogContent>
            선택한 체인 : {selectChain}
            <Divider/>
            펀딩 수량(CCip-BnM)을 입력하세요. 
            
            <Divider/>
            가능 수량 : {tokenAmount} CCIP-BnM
            <Divider/>
            <TextField id="outlined-basic" label="CCIP-BnM 수량 입력" variant="outlined" />
            <Divider/>
            <Button variant="outlined" onClick={sendCCIP} sx={{marginTop:10,}}>
              펀딩하기
            </Button>
            <Button variant="outlined" onClick={handleCloseInnerDialog} sx={{marginTop:10,}}>
              취소
            </Button>
          </DialogContent>
        </Dialog>
        
      </DialogContent>
    </Dialog>
  );
}

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Typography variant="subtitle1" component="div">
//         Selected: {selectedValue}
//       </Typography>
//       <br />
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }
