import Head from "next/head";
import * as material from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { ethers } from "ethers";
import { networks } from "@/types/networks";
// import { useWeb3 } from "@/hooks/useWeb3";

const Page = () => {
  // TODO: 이거 usestate? global state 변경해줘야 하는데 어떻게 해야할지 모르겠습니다..
  // const [account, web3] = useWeb3();
  const Amount = 20000;
  const PROTOCOL_ADDRESS = `0x8edbc869108da99f6feb062136bc7d7aa5764542`;

  // TODO: What about moving these all function to function directory in next.js src
  const SwitchNetworkComponent = () => {
    const selectedNetwork = "fuji";
    // Save window.ethereum globally for use across multiple pages
    if (window.ethereum) {
      window.ethereum.enable(); // Enable Ethereum provider

      // Create an ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      // window.ethersProvider = provider;

      // Switch to the desired network (e.g., Binance Smart Chain)
      const switchToNetwork = async () => {
        try {
          const chainId = "0x" + networks[selectedNetwork].chainId.toString(16);
          console.log(chainId);

          // Switch network using provider.send method
          // TODO: make this as a object for using in network types
          await provider.send("wallet_addEthereumChain", [
            {
              chainId,
              chainName: networks[selectedNetwork].chainName,
              nativeCurrency: {
                symbol: networks[selectedNetwork].nativeCurrencySymbol,
                decimals: 18,
              },
              rpcUrls: [networks[selectedNetwork].rpcURL],
              blockExplorerUrls: [networks[selectedNetwork].blockExplorerURL],
            },
          ]);

          // You can add additional logic or UI updates after the network switch
          alert("Switched to Binance Smart Chain");
        } catch (error) {
          console.error("Error switching network:", error);
        }
      };

      switchToNetwork();
    } else {
      console.error("MetaMask not detected!");
    }
  };

  const approveToken = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        return;
      }
      // TODO: check this network id or name and should not be set polygon network.
      // const networkId = await window.ethereum.request({
      // method: "net_version",
      // });
      // console.log("Connected Network ID:", networkId);

      // TODO: change to input? in async (networkName:string)
      const networkName: string = "fuji";
      const infuraSepoliaURL = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL;

      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const fundingContractAddress = networks[networkName].fundingContract;
      // information depend on the source chain
      const erc20ContractAddress = networks[networkName].bnmToken;
      // Connect to ERC-20 contract
      const erc20Contract = new ethers.Contract(
        erc20ContractAddress,
        ["function approve(address spender, uint256 amount)"],
        signer
      );

      // Approve the spender
      const tx = await erc20Contract.approve(fundingContractAddress, 20000);
      await tx.wait();

      // TODO: change to temprary modal for ux
      // TODO: wait for a while for confirming tx in the network
      console.log("Transaction Hash:", tx);
      alert("Transfer successful!");
    } catch (error) {
      console.error("Error approving spender:", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };

  const checkAllowance = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        console.error("MetaMask not detected!");
        return;
      }

      // TODO: change to input? in async (networkName:string)
      // TODO: change to use netowork name from current connected network id or name, somethign
      const networkName: string = "fuji";
      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // information depend on the source chain
      const erc20ContractAddress = networks[networkName].bnmToken;
      const fundingContractAddress = networks[networkName].fundingContract;

      // Connect to ERC-20 contract
      // TODO: aggreate all erc20 interfaces
      const erc20Contract = new ethers.Contract(
        erc20ContractAddress,
        [
          "function allowance(address owner, address spender) external view returns (uint256)",
        ],
        signer
      );

      // Check the allowance after approval
      const spenderAllowance = await erc20Contract.allowance(
        signer.address,
        fundingContractAddress
      );

      alert(`Spender Allowance:${spenderAllowance.toString()}`);
    } catch (error) {
      console.error("Error approving spender:", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };

  const fundWithCCIP = async () => {
    try {
      // TODO: we need to add failure logic
      if (!window.ethereum) {
        return;
      }
      const networkName: string = "fuji";

      // providers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // we need to add validate logic for users. when a user send project index which there isn't, this tx is gonna revert.
      const fundingContractAddress = networks[networkName].fundingContract;
      const erc20ContractAddress = networks[networkName].bnmToken;

      // create a contract instance
      const fundingContract = new ethers.Contract(
        fundingContractAddress,
        [
          `function sendMessagePayLINK(
          address _receiver,
          uint _index,
          address _token,
          uint256 _amount
        ) external returns (bytes32 messageId)`,
        ],
        signer
      );

      // Approve the spender
      const tx = await fundingContract.sendMessagePayLINK(
        PROTOCOL_ADDRESS, // receive address = polygon protocol address
        1, // project index
        erc20ContractAddress, // token
        20000 // amount
      );

      const receipt = await tx.wait();
      // Assuming there is an Event interface with the expected structure
      interface Event {
        event: string;
        args: {
          messageId: string;
        };
      }
      // Find the "MessageSent" event in the transaction logs
      const messageSentEvent = receipt.events.find(
        (event: Event) => event.event === "MessageSent"
      );

      if (messageSentEvent) {
        // Access the return value from the event
        const messageId = messageSentEvent.args.messageId;
        console.log("Message ID:", messageId);
        alert(`https://ccip.chain.link/msg/${messageId}`);
      } else {
        console.error("MessageSent event not found in transaction logs");
      }
    } catch (error) {
      console.error("Error approving spender:", error);
      alert("Error transferring tokens. Check the console for details.");
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Projects</title>
      </Head>
      <material.Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <material.Container maxWidth="xl">
          <material.Card>
            <material.CardContent>
              <material.Button fullWidth size="large" variant="contained">
                Here is a test components for interacting blockchain network and
                contract
              </material.Button>

              <material.Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={SwitchNetworkComponent}
              >
                <div>Chain Network To Fuji</div>
              </material.Button>
              <material.Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={approveToken}
              >
                Approve Fund Token
              </material.Button>
              <material.Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={checkAllowance}
              >
                {/* // TODO:Change state by queyring contract */}
                Check Allowance Token, Current Approved Amount: {Amount}
              </material.Button>
              <material.Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={fundWithCCIP}
              >
                {/* // TODO:Change state by queyring contract */}
                Funding: {Amount}
              </material.Button>
            </material.CardContent>
          </material.Card>
        </material.Container>
      </material.Box>
    </DashboardLayout>
  );
};

export default Page;
