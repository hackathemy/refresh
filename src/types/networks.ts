interface Networks {
  [networkName: string]: Network;
}

interface Network {
  // chain info
  chainName: string;
  chainId: number;
  chainId16: string;
  decimal: number;
  nativeCurrencySymbol: string;
  rpcURL: string;
  blockExplorerURL: string;
  // check
  explorer: (txHash: string) => string;
  // using contarct
  router: string;
  chainSelector: string;
  linkToken: string;
  bnmToken: string;
  fundingContract: string;
}

// resources1) https://www.alchemy.com/chain-connect/chain/sepolia
// resources1) https://chainlist.org/chain/43113
const networks: Networks = {
  sepolia: {
    chainName: "Ethereum Sepolia",
    chainId: 11155111,
    chainId16: "0xaa36a7",
    decimal: 18,
    nativeCurrencySymbol: "ETH",
    rpcURL: "",
    blockExplorerURL: "https://sepolia.etherscan.io",

    explorer: (txHash) => `https://sepolia.etherscan.io/tx/${txHash}`,

    router: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
    chainSelector: "16015286601757825753",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    bnmToken: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
    fundingContract: "NOT DEFINED",
  },
  fuji: {
    chainName: "Avalanche Fuji",
    chainId: 43113,
    chainId16: "0xa869",
    decimal: 18,
    nativeCurrencySymbol: "AVAX",
    rpcURL: "https://rpc.ankr.com/avalanche_fuji",
    blockExplorerURL: "https://testnet.snowtrace.io",

    explorer: (txHash) => `https://testnet.snowtrace.io/tx/${txHash}`,

    router: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8",
    chainSelector: "14767482510784806043",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    bnmToken: "0xd21341536c5cf5eb1bcb58f6723ce26e8d8e90e4",
    fundingContract: "0x9823f0e4dEC11976f36bDB2C6863EEE883630Ff4",
  },
  mumbai: {
    chainName: "Polygon Mumbai",
    chainId: 80001,
    chainId16: "0x13881",
    decimal: 18,
    nativeCurrencySymbol: "MATIC",
    rpcURL: "",
    blockExplorerURL: "https://sepolia.etherscan.io",

    explorer: (txHash) => `https://mumbai.polygonscan.com/tx/${txHash}`,

    chainSelector: "14767482510784806043",
    router: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    bnmToken: "0xd21341536c5cf5eb1bcb58f6723ce26e8d8e90e4",
    fundingContract: "NOT DEFINED",
  },
};

export { networks };
