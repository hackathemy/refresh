import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import { FaceSmileIcon, TrophyIcon } from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";

export const ProjectCard = ({ project }: any) => {
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
      <CardActionArea href={`/project/${project.id}`}>
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
                itKeywords[project.id % 10]
              }`}
              title="green iguana"
            />

            <Typography gutterBottom variant="h5" sx={{ mt: 3 }}>
              {project.title}
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
              {project.desc}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
              {project.start_date} ~ {project.end_date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.writer}
            </Typography>
          </Box>
          <Box sx={{ width: "100%", marginTop: 2 }}>
            <Stack direction="row" spacing={1}>
              {/* Github 입력한 것 또는 인증한 경우 */}
              <Chip label="PoR Certified" color="info" variant="outlined" />
              {/* PoR 인증한 경우 */}
              <Chip label="DAO" variant="outlined" color="info" />
              {/* DAO가 있는 경우 */}
            </Stack>
          </Box>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        {project.goal < project.amount ? (
          <LinearProgress
            variant="buffer"
            color="secondary"
            value={progress}
            valueBuffer={buffer}
          />
        ) : (
          <LinearProgress
            variant="buffer"
            color="success"
            value={progress}
            valueBuffer={buffer}
          />
        )}
        <Stack justifyContent="space-between" spacing={2} sx={{ p: 3 }}>
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <TrophyIcon />
            </SvgIcon>
            <Typography display="inline" variant="body2" color="text.secondary">
              Goal
            </Typography>
            <Typography display="inline" variant="subtitle2">
              {project.goal} CCIP-BnM
            </Typography>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={1}>
            <SvgIcon color="action" fontSize="small">
              <FaceSmileIcon />
            </SvgIcon>
            <Typography display="inline" variant="body2" color="text.secondary">
              Current
            </Typography>
            <Typography display="inline" variant="subtitle2">
              {project.amount ?? 0} CCIP-BnM ( {project.peoples} Peoples )
            </Typography>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};
