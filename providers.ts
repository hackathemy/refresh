import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { goerli, mainnet, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// Even if you're app doesn't use mainnet ETH, you still need it in this array for ENS
export const chains = [mainnet, goerli, sepolia];

const { publicClient } = configureChains(chains, [publicProvider()]);

const { connectors } = getDefaultWallets({
  // Get your own WalletConnect ID: https://cloud.walletconnect.com/sign-in
  projectId: "6a91f5d54cffa882391a51b006c01fc8",
  appName: "ENS App",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
