import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TrophyIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import BuilderVotingDialog from "../modal/builder-execute-modal";
import BuilderCredentialDialog from "../modal/builder-modal";

export const MyCard = ({ dao }: any) => {
  const [open, setOpen] = useState(false);
  const [openCredential, setOpenCredential] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleCredentialClose = () => {
    setOpenCredential(false);
  };
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const progressRef = useRef(() => {});
  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card>
      <CardActionArea href={`/project/${dao.id}`}>
        <CardContent>
          <Box
            sx={{
              alignItems: "left",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography gutterBottom variant="h5">
              {dao.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                maxHeight: 50,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                wordWrap: "break-word",
                lineClamp: 2,
              }}
            >
              {dao.desc}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
              {dao.start_date} ~ {dao.end_date}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mr: 3 }}
      >
        <Stack justifyContent="space-between" spacing={2} sx={{ p: 3 }}>
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <TrophyIcon />
            </SvgIcon>
            <Typography display="inline" variant="body2" color="text.secondary">
              Goal
            </Typography>
            <Typography display="inline" variant="subtitle2">
              {dao.goal} CCIP-BnM
            </Typography>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <FaceSmileIcon />
            </SvgIcon>
            <Typography display="inline" variant="body2" color="text.secondary">
              Total Funding
            </Typography>
            <Typography display="inline" variant="subtitle2">
              {dao.amount ?? 0} CCIP-BnM
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={3} direction={"row"}>
          <Button
            size="large"
            sx={{ mt: 3 }}
            variant="contained"
            disabled={dao?.pid_verified}
            onClick={() => setOpenCredential(true)}
          >
            {dao?.pid_verified
              ? "Credential Verified"
              : "Get Credential by Polygon ID"}
          </Button>
          <Button
            size="large"
            sx={{ mt: 3 }}
            variant="contained"
            disabled={dao?.por_verified}
            onClick={() => alert("@TODO")}
          >
            {dao?.por_verified ? "PoR Verified" : "PoR Verify"}
          </Button>

          <Button
            size="large"
            sx={{ mt: 3 }}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Withdraw Funds
          </Button>
        </Stack>
      </Stack>

      <BuilderVotingDialog
        open={open}
        onClose={handleClose}
        contractAddress={dao.contract_address}
      />
      <BuilderCredentialDialog
        open={openCredential}
        onClose={handleCredentialClose}
        projectId={dao.contract_address}
      />
    </Card>
  );
};
