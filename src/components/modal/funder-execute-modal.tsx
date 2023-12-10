import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { DialogContent, Typography } from "@mui/material";
import axios from "axios";
import QRCode from "qrcode.react";
const emails = ["ETH Sepolia", "Avax"];

export interface IVotingDialogProps {
  open: boolean;
  onClose: () => void;
  contractAddress: any;
}

export default function FunderVotingDialog(props: IVotingDialogProps) {
  const { onClose, open, contractAddress } = props;
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [verifyValue, setVerifyValue] = useState();
  const handleClose = () => {
    onClose();
  };

  const getVoteQr = async (contractAddress: any) => {
    try {
      // QR 코드 값 생성
      const qrCodeData = `iden3comm://?request_uri=http://34.22.105.181:3001/v1/votes/funder/${contractAddress}`;

      const qrURL = "";
      setQrCodeValue(qrCodeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (open) {
      getVoteQr(contractAddress);
    }
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle variant="h3">Voting for execute fund</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Authenticate your identity for funder authority( Polygon ID ).
          <br />
          Your credentials are securely authenticated with zk.
        </Typography>
        {qrCodeValue && (
          <QRCode value={qrCodeValue} style={{ width: 500, height: 500 }} />
        )}
      </DialogContent>
    </Dialog>
  );
}
