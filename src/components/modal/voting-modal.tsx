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
import QRCode from 'qrcode.react';
const emails = ["ETH Sepolia", "Avax"];

export interface IVotingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function VotingDialog(props: IVotingDialogProps) {
  const { onClose, open } = props;  
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [verifyValue , setVerifyValue] = useState();
  const handleClose = () => {
    onClose();
  };

  const getQr = async () => {
    try {      
      const result = await axios.get(
        `http://34.22.105.181:3000/v1/claim/authentication`, {
          withCredentials: true,
        }
      );
      setVerifyValue(result.data);
      console.log(verifyValue);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    
    //getQr();
    const bscTestnetAddress = 'YOUR_BSC_TESTNET_ADDRESS';

    // QR 코드 값 생성 (예: BSC Testnet 주소)
    const qrCodeData = {
      address: bscTestnetAddress,
    };

    const qrURL = "";
    setQrCodeValue(JSON.stringify(qrCodeData));
  }, []);
 

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Approve Execute Funding</DialogTitle>
      <DialogContent>
        { qrCodeValue && (
          <QRCode value={qrCodeValue} style={{width:250,height:250}} />
        )}        
      </DialogContent>
    </Dialog>
  );
}
