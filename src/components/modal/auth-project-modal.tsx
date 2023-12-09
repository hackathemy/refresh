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

export interface IVotingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthProjectModal(props: IVotingDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Approve Execute Funding</DialogTitle>
      <DialogContent>QRCODE</DialogContent>
    </Dialog>
  );
}
