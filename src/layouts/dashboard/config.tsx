import { FaceSmileIcon, LifebuoyIcon } from "@heroicons/react/24/solid";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Refresh ?",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <LifebuoyIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Projects",
    path: "/project",
    icon: (
      <SvgIcon fontSize="small">
        <FaceSmileIcon />
      </SvgIcon>
    ),
  },
];
