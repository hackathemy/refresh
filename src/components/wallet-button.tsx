import { Box, SvgIcon, Typography } from "@mui/material";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { walletState } from "@/recoil/state";
import useAccount from "@/hooks/useAccount";

import TransferForm from "./TransferForm";
import { useWeb3 } from "@/hooks/useWeb3";
import TokenContract from "../../public/assets/abi/sender_abi.json";

function maskAddress(address: string): string {
  // For example, display only the first 6 and last 4 characters
  const masked: string = `${address.substring(0, 6)}...${address.slice(-4)}`;
  return masked;
}

function WalletButton(): JSX.Element {
  const [account, web3] = useWeb3();
  const [isLogin, setIsLogin] = useState<Boolean>();
  const [balance, setBalance] = useState<number>();

  const fireTx = async () => {
    const contractAddress = "0x18921Ba7EB599DA91C9A382a618f2f523Cde15c2"; // Matic 토큰 컨트랙트 주소
    const contractAbi = TokenContract; // 전송 함수에 대한 ABI
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    // 메서드의 인자 값 설정
    const destinationChainSelector = 12532609583862916517;
    const receiver = "0xa2F99Bb25E704b9E4e56bFC2F88314b67698e25B";
    const text = "Hello, world!";
    const token = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05";
    const amount = 1000000000000000;

    // Contract 메서드 호출 데이터 생성
    const data = contract.methods
      .sendMessagePayLINK(
        //destinationChainSelector,
        receiver,
        text,
        token,
        amount
      )
      .encodeABI();

    // 트랜잭션 객체 생성
    const transactionObject = {
      from: account,
      to: contractAddress,
      gas: "200000", // 예상 가스 비용
      data: data,
    };

    console.log(transactionObject);

    // MetaMask로 트랜잭션 전송 요청
    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [transactionObject],
      })
      .then((txHash) => {
        console.log("Transaction Hash:", txHash);
      })
      .catch((error) => {
        console.error("Transaction Error:", error);
      });
  };

  useEffect(() => {
    (async function () {
      const balance = await web3?.eth.getBalance(account);
      if (balance !== undefined) {
        setBalance(Number(balance) / 10 ** 18);
      }
    })();

    if (account === "") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [account]);

  return (
    <>
      <Box
        sx={{
          width: 180,
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
                {account}
              </Typography>
              <Typography color="neutral.500" variant="body2">
                {account}
              </Typography>
            </div>

            <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
              <ChevronRightIcon />
            </SvgIcon>
          </>
        ) : (
          <>
            <div>
              <Typography color="primary" variant="subtitle1">
                Connect Wallet
              </Typography>
              <Typography color="neutral.500" variant="body2">
                Click to connect.
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
