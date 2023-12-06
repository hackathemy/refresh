import Head from "next/head";
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useEffect, useState } from "react";
import SimpleDialog from "@/components/project/funding-modal";
import BorderLinearProgress from "@/components/BorderLinearProgress";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import HorizontalLinearAlternativeLabelStepper from "@/components/HorizontalLinearAlternativeLabelStepper";
import { useWeb3 } from "@/hooks/useWeb3";
import TokenContract from "../../../public/assets/abi/sender_abi.json";
import Erc20TokenContract from "../../../public/assets/abi/erc20_abi.json";
import Web3 from "web3";
import { Alchemy, Network, Utils } from "alchemy-sdk";

const emails = ["이더리움", "폴리곤"];
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const Page = () => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(emails[1]);

  const key = process.env.ALCHEMY_SEPOLIA;
  const handleClickOpen = () => {
    const isConnect = localStorage.getItem("isConnect");
    if (isConnect != "true") {
      alert("지갑 연결이 필요합니다.");
      return;
    }
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const [isLogin, setIsLogin] = useState<Boolean>();
  const [balance, setBalance] = useState<number>();

  const sendLINK = async () => {
    try {
      const infuraSepoliaURL = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL;
      // const web3 = new Web3(
      //   new Web3.providers.HttpProvider(infuraSepoliaURL ?? "")
      // );
      const web3 = new Web3((window as any).ethereum);

      // ERC-20 토큰 정보
      const tokenAddress = "0x779877a7b0d9e8603169ddbd7836e478b4624789"; // ERC-20 토큰 주소 (실제 토큰으로 대체)
      const tokenSymbol = "LINK"; // ERC-20 토큰 심볼 (실제 토큰으로 대체)
      const decimals = 18; // 토큰 소수 자릿수

      // 수신자 주소 및 전송할 토큰 양
      const to = web3.utils.toChecksumAddress(
        "0x18921Ba7EB599DA91C9A382a618f2f523Cde15c2"
      );
      const value = web3.utils.toWei("0.1", "ether");

      // ERC-20 전송 트랜잭션 데이터 생성
      const data = web3.eth.abi.encodeFunctionCall(
        {
          name: "transfer",
          type: "function",
          inputs: [
            {
              type: "address",
              name: "to",
            },
            {
              type: "uint256",
              name: "value",
            },
          ],
        },
        [to, value]
      );

      // 전송 트랜잭션 생성
      const tx = await web3.eth.sendTransaction({
        to: tokenAddress,
        from: window.ethereum.selectedAddress,
        value: "0",
        data: data,
        gas: "200000", // 가스 한도 (적절한 값을 설정)
        //gasPrice: web3.utils.toWei('10', 'gwei'), // 가스 가격 (적절한 값을 설정)
      });

      console.log(`Successfully transferred  ${tokenSymbol} to `);
      console.log("Transaction Hash:", tx.transactionHash);
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  const sendBNM = async () => {
    try {
      const web3 = new Web3((window as any).ethereum);
      // ERC-20 토큰 정보
      const tokenAddress = "0xfd57b4ddbf88a4e07ff4e34c487b99af2fe82a05"; // ERC-20 토큰 주소 (실제 토큰으로 대체)
      const tokenSymbol = "CCIP-BnM"; // ERC-20 토큰 심볼 (실제 토큰으로 대체)
      const decimals = 18; // 토큰 소수 자릿수

      // 수신자 주소 및 전송할 토큰 양
      const to = web3.utils.toChecksumAddress(
        "0x18921Ba7EB599DA91C9A382a618f2f523Cde15c2"
      );
      const value = web3.utils.toWei("0.179", "ether");

      // ERC-20 전송 트랜잭션 데이터 생성
      const data = web3.eth.abi.encodeFunctionCall(
        {
          name: "transfer",
          type: "function",
          inputs: [
            {
              type: "address",
              name: "to",
            },
            {
              type: "uint256",
              name: "value",
            },
          ],
        },
        [to, value]
      );

      // 전송 트랜잭션 생성
      const tx = await web3.eth.sendTransaction({
        to: tokenAddress,
        from: window.ethereum.selectedAddress,
        value: "0",
        data: data,
        gas: "200000", // 가스 한도 (적절한 값을 설정)
        //gasPrice: web3.utils.toWei('10', 'gwei'), // 가스 가격 (적절한 값을 설정)
      });

      console.log(`Successfully transferred  ${tokenSymbol} to `);
      console.log("Transaction Hash:", tx.transactionHash);
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  const sendCCIP = async () => {
    const web3 = new Web3((window as any).ethereum);
    if (!web3 || !web3.currentProvider) {
      return;
    }
    const contractAddress = "0x18921Ba7EB599DA91C9A382a618f2f523Cde15c2"; // Matic 토큰 컨트랙트 주소
    const contractAbi = TokenContract; // 전송 함수에 대한 ABI
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    // 메서드의 인자 값 설정
    const destinationChainSelector = 12532609583862916517;
    const receiver = "0x9F70C778aD5A738beFD577f12e6e9C1Bc9fBfd48";
    const text = "sm test";
    const token = "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05";
    const amount = Utils.formatUnits("0.123", "ether");

    // Contract 메서드 호출 데이터 생성
    const data = (contract.methods as any)
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
      from: window.ethereum.selectedAddress,
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
      .then((txHash: any) => {
        console.log("Transaction Hash:", txHash);
      })
      .catch((error: any) => {
        console.error("Transaction Error:", error);
      });
  };

  // const getTokenAmount = async () => {
  //   if (!web3) {
  //     return;
  //   }
  //   const settings = {
  //     apiKey: "2Eoge0lW503_Bpdv3P-Ityr_BeFy1qLC", // Replace with your Alchemy API Key.
  //     network: Network.MATIC_MUMBAI, // Replace with your network.
  //   };
  //   const alchemy = new Alchemy(settings);

  //   // The wallet address / token we want to query for:
  //   const ownerAddr = "0xa2F99Bb25E704b9E4e56bFC2F88314b67698e25B";
  //   const balances = await alchemy.core.getTokenBalances(ownerAddr, [
  //     "0xf1e3a5842eeef51f2967b3f05d45dd4f4205ff40",
  //   ]);

  //   // The token address we want to query for metadata:
  //   const metadata = await alchemy.core.getTokenMetadata(
  //     "0xf1e3a5842eeef51f2967b3f05d45dd4f4205ff40"
  //   );
  //   console.log(balances);
  //   // Removing the '0x' prefix
  //   const cleanedHex = (balances as any).tokenBalances[0].tokenBalance.slice(2);

  //   // 16진수를 10진수로 변환
  //   const decimalValue = BigInt("0x" + cleanedHex);

  //   // wei에서 ether로 변환
  //   const etherValue = web3.utils.fromWei(decimalValue.toString(), "ether");

  //   console.log("Token Balances:");
  //   //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
  //   console.log(etherValue);
  //   console.log("Token Metadata: ");
  //   console.log(metadata);
  // };

  const [isFixed, setIsFixed] = useState(false);

  const getTokenAmountByCCIP = async () => {
    const web3 = new Web3((window as any).ethereum);
    if (!web3 || !web3.currentProvider) {
      return;
    }

    const sepoliaSettings = {
      apiKey: "jyGk9_KOsb76KLdcSc-kTJSIHymva1SQ", // Replace with your Alchemy API Key.
      network: Network.ETH_SEPOLIA, // Replace with your network.
    };
    const sepolia = new Alchemy(sepoliaSettings);

    // The wallet address / token we want to query for:
    const ownerAddr = window.ethereum.selectedAddress;
    const balances = await sepolia.core.getTokenBalances(ownerAddr, [
      "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
    ]);
    // The token address we want to query for metadata:
    const metadata = await sepolia.core.getTokenMetadata(
      "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05"
    );
    // Removing the '0x' prefix
    const cleanedHex = (balances as any).tokenBalances[0].tokenBalance.slice(2);

    // 16진수를 10진수로 변환
    const decimalValue = BigInt("0x" + cleanedHex);

    // wei에서 ether로 변환
    const etherValue = Utils.formatUnits(decimalValue.toString(), "ether");

    console.log("Token Balances:");
    //const etherValue = web3.utils.fromWei(parseInt(balances.tokenBalances.tokenBalance, 16), 'ether');
    console.log(etherValue);
    console.log(metadata);
  };

  useEffect(() => {
    const isConnect = localStorage.getItem("isConnect");
    if (isConnect == "true") {
      getTokenAmountByCCIP();
    }

    const handleScroll = () => {
      // 특정 위치(예: 200px)에서 스크롤이 발생하면 isFixed 상태를 true로 설정
      const scrollPosition = window.scrollY;
      const threshold = 200;

      if (scrollPosition > threshold) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <DashboardLayout>
      <Head>
        <title>Project Detail</title>
      </Head>
      <Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />
        <Container maxWidth="xl">
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box
              gridColumn="span 8"
              sx={{ backgroundColor: "#99999", padding: 2, borderRadius: 2 }}
            >
              <CardMedia
                sx={{ height: 300, borderRadius: 2, marginBottom: 1 }}
                image="https://source.unsplash.com/random?it"
                title="green iguana"
              />
              <Typography variant="h4">Chip</Typography>
              <Typography variant="subtitle2">
                안녕하세요! 저는 Deal or No Deal의 Brad의 친구 Rochelle입니다!
                여러분 모두가 거래나 노딜에서 브래드의 파괴적인 게임을 보셨을
                겁니다. 그의 돈디 가족은 정말로 그가 자신의 꿈을 이루기를 원하고
                우리는 누군가가 2파운드 정도를 절약해서 브래드가 버킷리스트에서
                조금이라도 벗어나도록 할 수 있기를 기대하고 이것을 설정했습니다.
                사랑합니다 브래드
              </Typography>

              <div style={{ marginTop: 100 }}></div>
              <HorizontalLinearAlternativeLabelStepper />

              <TableContainer component={Paper} style={{ marginTop: 50 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">
                        <Typography variant="subtitle2">RAISED</Typography>
                        <Typography variant="h4">£4,701,505.67</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">INVESTORS</Typography>
                        <Typography variant="h4">4544</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">TARGET</Typography>
                        <Typography variant="h4">£1,000,000</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">
                        <Typography variant="subtitle2">EQUITY</Typography>
                        <Typography variant="h4">2.72%</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">
                          PRE-MONEY VALUATION
                        </Typography>
                        <Typography variant="h4">£167,860,000</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2">SHARE PRICE</Typography>
                        <Typography variant="h4">£2.03</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <List
                sx={{
                  width: "100%",

                  bgcolor: "background.paper",
                }}
              >
                <ListItem>
                  <ListItemText
                    primary="Problem"
                    secondary="Jan 9, 2014"
                    sx={{ width: "10%" }}
                  />
                  <ListItemText
                    sx={{ width: "70%" }}
                    primary="The savings account is the world’s most popular financial product. Used by 69% of the adults globally, yet many people make little return on their savings; the UK average savings rate is still 1.96%"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText
                    primary="Solution"
                    secondary="Jan 9, 2014"
                    sx={{ width: "10%" }}
                  />
                  <ListItemText
                    sx={{ width: "70%" }}
                    primary="Chip has an award-winning & highly rated app (‘People’s Choice Award 23’ Finder, 4.5* on the App Store) giving users one place to effortlessly & automatically build wealth across savings & investments"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText
                    primary="Business model"
                    secondary="Jan 9, 2014"
                    sx={{ width: "10%" }}
                  />
                  <ListItemText
                    sx={{ width: "70%" }}
                    primary="We offer competitive savings products and investment products, our revenue is a mix of spreads on returns or subscription fees on these. As AuA grows, so does revenue"
                  />
                </ListItem>
              </List>

              <Divider variant="middle" />

              <List
                sx={{
                  marginTop: 10,
                  width: "100%",

                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h4">주최자 및 Github</Typography>
                <ListItem>
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon style={{ fontSize: 40, color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="ABCUser" />
                    <ListItemText primary="PolygonId" />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon style={{ fontSize: 40, color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Github" />
                    <ListItemText>
                      <Chip
                        avatar={
                          <Avatar src="/assets/images/github-mark-white.png">
                            G
                          </Avatar>
                        }
                        label="last update : 5 days ago"
                        color="primary"
                        variant="outlined"
                      />
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon style={{ fontSize: 40, color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="PoR 지분 증명" />
                    <ListItemText primary="지분 증명 내용 들어가면 좋을 듯" />
                  </ListItemButton>
                </ListItem>
              </List>

              <List
                sx={{
                  marginTop: 10,
                  width: "100%",

                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h4">댓글</Typography>

                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText
                    primary="Solution"
                    secondary="Jan 9, 2014"
                    sx={{ width: "10%" }}
                  />
                  <ListItemText
                    sx={{ width: "70%" }}
                    primary="Chip has an award-winning & highly rated app (‘People’s Choice Award 23’ Finder, 4.5* on the App Store) giving users one place to effortlessly & automatically build wealth across savings & investments"
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText
                    primary="Business model"
                    secondary="Jan 9, 2014"
                    sx={{ width: "10%" }}
                  />
                  <ListItemText
                    sx={{ width: "70%" }}
                    primary="We offer competitive savings products and investment products, our revenue is a mix of spreads on returns or subscription fees on these. As AuA grows, so does revenue"
                  />
                </ListItem>
              </List>
            </Box>
            <Box
              gridColumn="span 4"
              sx={{
                // isFixed 값에 따라 스타일을 동적으로 설정
                position: isFixed ? "sticky" : "sticky",
                top: isFixed ? "0" : "200",
                borderRadius: 2,
                height: 350,
                // 추가적인 스타일은 필요에 따라 조절

                backgroundColor: "gray",
                boxShadow: isFixed ? "0px 2px 5px rgba(0, 0, 0, 0.1)" : "none",
                padding: "16px",
              }}
            >
              <Box>
                <Typography variant="subtitle2">모인금액</Typography>
                <Typography variant="h4">4544 USDC</Typography>

                <BorderLinearProgress variant="determinate" value={70} />
              </Box>
              <List>
                <ListItem>
                  <ListItemButton>
                    <ListItemIcon>
                      <CalendarMonthIcon
                        style={{ fontSize: 40, color: "white" }}
                      />
                    </ListItemIcon>
                    <ListItemText color="black" primary="기간" />
                    <ListItemText primary="2023-12-31" />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <ListItemIcon>
                      <PeopleIcon style={{ fontSize: 40, color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="참여자 수" />
                    <ListItemText primary="30명" />
                  </ListItemButton>
                </ListItem>
              </List>
              {/* <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={getTokenAmount}
              >
                token 수량
              </Button> */}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={handleClickOpen}
              >
                펀딩하기
              </Button>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={sendLINK}
              >
                1. LINK 보내기
              </Button>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={sendBNM}
              >
                2. BNM 보내기
              </Button>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={sendCCIP}
              >
                3. CCIP ㄱㄱ
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
