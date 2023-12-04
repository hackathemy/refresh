import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";

const style = {
  marginTop: 2,
  width: "100%",

  bgcolor: "background.paper",
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const ProjectCard = ({ project }: any) => {
  const theme = useTheme();

  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 800);
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
              image="/assets/images/tree.jpg"
              title="green iguana"
            />

            <Typography gutterBottom variant="h5" component="div">
              {project.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.desc}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.writer}
            </Typography>
          </Box>
          <Box sx={{ width: "100%", marginTop: 1 }}>
            <Stack direction="row" spacing={1} style={{ marginBottom: 1 }}>
              <Chip
                avatar={
                  <Avatar src="/assets/images/github-mark-white.png">G</Avatar>
                }
                label="Github Certified"
                variant="outlined"
              />
              {/* Github 입력한 것 또는 인증한 경우 */}
              <Chip label="PoR Certified" variant="outlined" />
              {/* PoR 인증한 경우 */}
              <Chip label="DAO" variant="outlined" />
              {/* DAO가 있는 경우 */}
            </Stack>
            <p></p>
            <BorderLinearProgress variant="determinate" value={70} />
            <Grid container spacing={3} style={{ marginTop: 1 }}>
              <Grid item xs={4}>
                <Item>
                  Funding goal
                  <Divider />
                  10000 USDC
                  {/* DB에 모금 목표(실패, 성공 여부 상관 없음) */}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item>
                  Funding people
                  <Divider />
                  10 People
                  {/* 발행된 erc20의 홀더 수 */}
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item>
                  Current
                  <Divider />
                  700 USDC
                  {/* 여기에 총 펀딩중인 모금 액 */}
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  Funding duration
                  <Divider />
                  {project.start_date} ~ {project.end_date}
                </Item>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
