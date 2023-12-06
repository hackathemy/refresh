import {
  FaceSmileIcon,
  LifebuoyIcon,
  PlusCircleIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "re-fresh !?",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <LifebuoyIcon />
      </SvgIcon>
    ),
  },
  {
    title: "projects",
    path: "/project",
    icon: (
      <SvgIcon fontSize="small">
        <FaceSmileIcon />
      </SvgIcon>
    ),
  },
  {
    title: "history",
    path: "/funding",
    icon: (
      <SvgIcon fontSize="small">
        <ClockIcon />
      </SvgIcon>
    ),
  },
  {
    title: "my funding(dao)",
    path: "/dao",
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    ),
  },
  {
    title: "create",
    path: "/create",
    icon: (
      <SvgIcon fontSize="small">
        <PlusCircleIcon />
      </SvgIcon>
    ),
  },
];
