import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TrophyIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import VotingDialog from "../modal/voting-modal";
import CredentialDialog from "../modal/credential-modal";

export const DaoCard = ({ dao }: any) => {
  const itKeywords = [
    "coding",
    "programming",
    "developer",
    "technology",
    "data",
    "software",
    "computer",
    "code",
    "web development",
    "network",
  ];

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
            <CardMedia
              sx={{ height: 140, borderRadius: 2, marginBottom: 2 }}
              image={`https://source.unsplash.com/random?${
                itKeywords[dao.id % 10]
              }`}
              title="green iguana"
            />

            <Typography gutterBottom variant="h5" sx={{ mt: 3 }}>
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
            <Typography variant="body2" color="text.secondary">
              {dao.writer}
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
              Total
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
              My funding
            </Typography>
            <Typography display="inline" variant="subtitle2">
              {dao.amount ?? 0} CCIP-BnM
            </Typography>
          </Stack>
        </Stack>

        <Button
          size="large"
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => setOpenCredential(true)}
        >
          Execution Credential
        </Button>
        <Button
          size="large"
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Execution Fund
        </Button>
      </Stack>

      <VotingDialog open={open} onClose={handleClose} contractAddress={dao.contract_address} />
      <CredentialDialog open={openCredential} onClose={handleCredentialClose} projectId={dao.contract_address} />
    </Card>
  );
};
