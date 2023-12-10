import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { DialogContent } from "@mui/material";
import axios from "axios";
import QRCode from "qrcode.react";
const emails = ["ETH Sepolia", "Avax"];

export interface ICredentialDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: any;
}

export default function CredentialDialog(props: ICredentialDialogProps) {
  const { onClose, open, projectId } = props;
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [sessionId, setSessionId] = useState('');
  const handleClose = () => {
    onClose();
  };

  const getAuthQr = async () => {
    try {
      const result = await axios.get(`/api/vote/auth`);
      // QR 코드 값 생성
      const sessionID = `${result.data.sessionID}`;
      const qrCodeData = `${result.data.qrCodeLink}`;
           
      setSessionId(sessionID);

      setQrCodeValue(qrCodeData);

      setTimeout(async () => {
        await checkCredential(sessionID);
        
      }, 30000)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkCredential = async (sessionID: string) => {
    try {
      console.log("sessionID : " + sessionID);
      
      if(sessionId === ''){
        return false;
      }

      const result = await axios.get(`/api/vote/credential`, {params : {'sessionId' : sessionID}});
       // QR 코드 값 생성
      const qrCodeData = result.data;
     
      setQrCodeValue(JSON.stringify(qrCodeData));
      
      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if(open){
      getAuthQr();
    }
   
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Credential</DialogTitle>
      <DialogContent>
        {qrCodeValue && (
          <QRCode value={qrCodeValue} style={{ width: 500, height: 500 }} />
        )}
      </DialogContent>
    </Dialog>
  );
}
