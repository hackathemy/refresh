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
import Link from "next/link";

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

export const DaoCard = ({ funding }: any) => {
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
      <CardActionArea>
        <CardContent>
          <Box sx={{ width: "100%", marginTop: 1 }}>
            <div>{JSON.stringify(funding)}</div>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Link
                  href={`https://ccip.chain.link/msg/0xdfcd24985af75ee603013f35a6eef92369132f7d62be898c6f0903e8ed11daf9`}
                  target="_blank"
                >
                  <Chip
                    label="CCIP Explorer"
                    color="primary"
                    variant="outlined"
                    sx={{ marginRight: 2 }}
                  />
                </Link>
                <Link
                  href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                >
                  <Chip
                    label={`Funding Project : ${funding.project_title}`}
                    variant="outlined"
                    sx={{ marginRight: 2 }}
                  />
                </Link>
                <Chip
                  label={`Funding Chain : ${funding.chain}`}
                  variant="outlined"
                  sx={{ marginRight: 2 }}
                />
                <Chip
                  label={`Funding address : ${funding.address}`}
                  variant="outlined"
                  sx={{ marginRight: 2 }}
                />
                <Chip
                  label={`Funding amount : ${funding.amount}`}
                  variant="outlined"
                  sx={{ marginRight: 2 }}
                />

                <Chip
                  label={`Funding Date : ${funding.fund_date}`}
                  variant="outlined"
                  sx={{ marginRight: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
