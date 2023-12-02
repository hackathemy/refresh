import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;

  return (
    <Typography color="primary" variant="h4">
      re-fresh !
    </Typography>
  );
};
