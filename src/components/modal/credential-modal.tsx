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
      
      console.log(qrCodeData);
      console.log(sessionID);
      console.log(result.data.sessionID);      
      console.log(result.data);      
      setSessionId(sessionID);

      setQrCodeValue(qrCodeData);

      // const timer = setInterval(async () => {
      //   const result = await checkCredential(sessionID);
      //   if(result){
      //     clearInterval(timer);
      //   }
      // }, 5000);
  
      // return () => {
      //   clearInterval(timer);
      // };
      setTimeout(async () => {
        await checkCredential(sessionID);
        
      }, 20000)
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
      console.log("sdafljadslfkdjkaslfasdj");
      
      console.log(result);
       // QR 코드 값 생성
      const qrCodeData = result.data;
      
      console.log(JSON.stringify(qrCodeData));
     
      setQrCodeValue(JSON.stringify(qrCodeData));
      
      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if(open){
      getAuthQr();
      // const timer = setInterval(async () => {
      //   const result = await checkCredential();
      //   if(result){
      //     clearInterval(timer);
      //   }
      // }, 5000);
  
      // return () => {
      //   clearInterval(timer);
      // };
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
