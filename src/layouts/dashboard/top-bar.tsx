import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Box, Divider, Stack } from "@mui/material";
import { Logo } from "../../components/logo";
import { items } from "./config";
import { SideNavItem } from "./top-bar-item";
import WalletButton from "@/components/wallet-button";

export const TopBar = () => {
  const pathname = usePathname();
  return (
    <Box>
      <Box
        sx={{
          px: 5,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          component={NextLink}
          href="/"
          sx={{
            display: "inline-flex",
            height: 32,
            width: 180,
          }}
        >
          <Logo />
        </Box>
        <Box
          sx={{
            gap: 2,
            display: "flex",
          }}
        >
          {items.map((item: any) => {
            const active = item.path ? pathname === item.path : false;

            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
              />
            );
          })}
        </Box>
        <WalletButton />
      </Box>
    </Box>
  );
};
