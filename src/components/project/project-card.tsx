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
import { Progress } from "../progress/linear-progress";
import { maskAddress } from "@/functions/string-functions";

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
                height: 50,
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
              {project.start_date} ~ {project.end_date} | {"  "}
              {maskAddress(project.writer)}
            </Typography>
          </Box>
          <Box sx={{ width: "100%", marginTop: 2 }}>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Polygon ID Certified"
                color="info"
                variant="outlined"
                disabled={project?.pid_verified}
              />
              {/* Github 입력한 것 또는 인증한 경우 */}
              <Chip
                label="PoR Certified"
                color="info"
                variant="outlined"
                disabled
              />
              {/* PoR 인증한 경우 */}
              <Chip label="DAO" variant="outlined" color="info" disabled />
              {/* DAO가 있는 경우 */}
            </Stack>
          </Box>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        {project.goal < project.amount ? (
          <Progress color="secondary" />
        ) : (
          <Progress color="success" />
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
