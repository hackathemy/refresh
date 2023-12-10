import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { DialogContent } from "@mui/material";
import axios from "axios";
import QRCode from "qrcode.react";
const emails = ["ETH Sepolia", "Avax"];

export interface IVotingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function VotingDialog(props: IVotingDialogProps) {
  const { onClose, open } = props;
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [verifyValue, setVerifyValue] = useState();
  const handleClose = () => {
    onClose();
  };

  const getQr = async () => {
    try {
      const result = await axios.get(
        `http://34.22.105.181:3000/v1/claim/authentication`,
        {
          withCredentials: true,
        }
      );
      setVerifyValue(result.data);
      console.log(verifyValue);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    //getQr();
    const bscTestnetAddress = "YOUR_BSC_TESTNET_ADDRESS";

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
        {qrCodeValue && (
          <QRCode value={qrCodeValue} style={{ width: 250, height: 250 }} />
        )}
      </DialogContent>
    </Dialog>
  );
}
