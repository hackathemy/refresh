import { Box, Card, CardActionArea, CardContent, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
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
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
