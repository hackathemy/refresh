import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { chains, wagmiConfig } from "../../providers";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "../theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <ToastContainer
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          theme="light"
        />{" "}
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <CssBaseline />

            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </RecoilRoot>
    </ThemeProvider>
  );
}
