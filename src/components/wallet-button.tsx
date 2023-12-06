import { Box, SvgIcon, Typography } from "@mui/material";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { walletState } from "@/recoil/state";
import useAccount from "@/hooks/useAccount";

import TransferForm from "./TransferForm";
import { useWeb3 } from "@/hooks/useWeb3";
import TokenContract from "../../public/assets/abi/sender_abi.json";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Web3 from "web3";

function maskAddress(address: string): string {
  // For example, display only the first 6 and last 4 characters
  const masked: string = `${address.substring(0, 6)}...${address.slice(-4)}`;
  return masked;
}

function WalletButton(): JSX.Element {
  //const [account, web3] = useWeb3();
  const [isLogin, setIsLogin] = useState<Boolean>();
  const [balance, setBalance] = useState<number>();
  const [account, setAccount] = useState("");
  // const fireTx = async () => {
  //   if (!web3 || !window.ethereum) {
  //     return;
  //   }
  //   const contractAddress = "0x18921Ba7EB599DA91C9A382a618f2f523Cde15c2"; // Matic 토큰 컨트랙트 주소
  //   const contractAbi = TokenContract; // 전송 함수에 대한 ABI
  //   const contract = new web3.eth.Contract(contractAbi, contractAddress);

  //   // 메서드의 인자 값 설정
  //   const destinationChainSelector = 12532609583862916517;
  //   const receiver = "0xa2F99Bb25E704b9E4e56bFC2F88314b67698e25B";
  //   const text = "Hello, world!";
  //   const token = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05";
  //   const amount = 1000000000000000;

  //   // Contract 메서드 호출 데이터 생성
  //   const data = (contract.methods as any)
  //     .sendMessagePayLINK(
  //       //destinationChainSelector,
  //       receiver,
  //       text,
  //       token,
  //       amount
  //     )
  //     .encodeABI();

  //   // 트랜잭션 객체 생성
  //   const transactionObject = {
  //     from: account,
  //     to: contractAddress,
  //     gas: "200000", // 예상 가스 비용
  //     data: data,
  //   };

  //   console.log(transactionObject);

  //   // MetaMask로 트랜잭션 전송 요청
  //   window.ethereum
  //     .request({
  //       method: "eth_sendTransaction",
  //       params: [transactionObject],
  //     })
  //     .then((txHash: any) => {
  //       console.log("Transaction Hash:", txHash);
  //     })
  //     .catch((error: any) => {
  //       console.error("Transaction Error:", error);
  //     });
  // };

  const walletConnect = async () => {
    try {
      await window.ethereum.enable();
      const web3 = new Web3((window as any).ethereum);
      const eth = window.ethereum as MetaMaskInpageProvider;

      const address: any = await eth.request({
        method: "eth_requestAccounts",
      });

      localStorage.setItem("isConnect", "true");
      setAccount(address);
    } catch (error) {
      console.error("User denied account access:", error);
    }
  };

  const logout = async () => {
    localStorage.removeItem("isConnect");
    //await window.ethereum.request({ method: 'eth_logout' });
    setIsLogin(false);
  };

  useEffect(() => {
    const isConnect = localStorage.getItem("isConnect");
    if (isConnect == "true") {
      setIsLogin(true);
      setAccount(window.ethereum.selectedAddress);
    } else {
      setIsLogin(false);
    }

    // if (account === "") {
    //   setIsLogin(false);
    // } else {
    //   setIsLogin(true);
    // }
    const handleAccountsChanged = (accounts: any) => {
      // accounts는 변경된 계정 목록을 포함합니다.
      // 만약 계정이 없다면 사용자가 Metamask에서 로그아웃했음을 의미합니다.

      if (accounts.length === 0) {
        // Metamask 연결이 해제된 경우, 필요한 동작 수행
        console.log("Metamask connection revoked");
        logout();
        // 예를 들어, 다른 페이지로 리다이렉트 또는 추가적인 로직 수행
      }
    };

    // accountsChanged 이벤트 리스너 등록
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      window.ethereum.off("accountsChanged", handleAccountsChanged);
    };
  }, [account]);

  return (
    <>
      <Box
        sx={{
          width: 200,
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          borderRadius: 1,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          p: "12px",
        }}
      >
        {isLogin ? (
          <>
            <div>
              <Typography color="primary" variant="subtitle1">
                {maskAddress(account)}
              </Typography>
              <div onClick={logout}>
                <Typography color="neutral.500" variant="body2">
                  Click to disconnect
                </Typography>
              </div>
            </div>

            <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
              <ChevronRightIcon />
            </SvgIcon>
          </>
        ) : (
          <>
            <div onClick={walletConnect}>
              <Typography color="primary" variant="subtitle1">
                Connect Wallet
              </Typography>
              <Typography color="neutral.500" variant="body2">
                Click to connect
              </Typography>
            </div>

            <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
              <ChevronRightIcon />
            </SvgIcon>
          </>
        )}
      </Box>
    </>
  );
}

export default WalletButton;
