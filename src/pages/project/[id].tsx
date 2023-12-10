import Head from "next/head";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Link,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Markdown from "react-markdown";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useEffect, useState } from "react";
import SimpleDialog from "@/components/project/funding-modal";
import {
  formatDate,
  formatNumber,
  maskAddress,
} from "@/functions/string-functions";
import axios from "axios";
import { useRouter } from "next/router";
import { Progress } from "@/components/progress/linear-progress";

const Page = () => {
  const router = useRouter();
  const id = router.query.id;
  const [fundingList, setFundingList] = useState([]);
  const [project, setProject]: any = useState();
  const [open, setOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const markdown = `
  # Discovey ( Discovery + Survey )
  
  ETHONLINE 2023 WINNER OF 🥉 Safe — Best Use of Safe{Core} for AA
  
  👉 This project has not been carried out since ethglobal02023, and I wanted to breathe life into it again through RE-fresh, so I requested funding.
  
  ## Project Description
  Discovey is a social networking service that offers survey and recruiting integration.

  Discovey serves B2B2C. This is where users can earn money by providing their data and survey data. By purchasing a variety of data, companies can obtain broader and more valuable data to find talent, gain broader insights, and easily utilize the data for a variety of services. Advertisements are also provided to help companies promote their business.
  
  - Discovey serves **B2B2C**, allowing users to earn money by providing their data and survey responses. Companies can purchase diverse and valuable data for talent acquisition, gaining insights, and advertising.

  - Utilize **Next.ID** in the **Mask Network** to issue user data as a **Decentralized Identifier (DID)**.
  
  - The platform provides advertising through push notifications using the **Push Protocol**. Users subscribe to Discovey channels, generate survey data, receive rewards for completed surveys, and are then targeted with advertisements via push notifications.
  
  - Integration of the **AA SDK for Safe** adds technical aspects of account abstraction, enabling the distribution of reward tokens and future feature integration.
  
  - **ZK-EVM** is used on **Polygon**, ensuring faster transaction speeds and lower gas fees.
  

  ## How it's Made

  - To provide a familiar **Web2-style UI/UX**, Google email login using **Web3auth** is offered.
  
  - Automatic generation of DID in the login process is implemented by utilizing **Next.ID** on the **Mask Network**.
  
  - OAuth authentication is used for users who may have reservations about granting permissions, ensuring only necessary read permissions for GitHub information. User data is signed and stored in Next.ID's key-value repository.
  
  - Companies can provide advertisements to users via push notifications using the **Push Protocol**. Users subscribe to channels on Discovey for targeted ad delivery.
  
  - The proprietary token, **DOY**, is issued and provided through **ZK EVM**. Additionally, **AA on Safe** is used to deliver services.
  
  ## Reference

  - Github [Discovey Github](https://github.com/pjhnocegood/discovey)

  - ETHGLOBAL 2023 Page [ETHGLOBAL 2023 Project Description](https://ethglobal.com/showcase/discovey-tuywc)

  - Demo [DEMO](https://stream.mux.com/rDE02xETV02Qbme00cUcXk02bSR7O00UajiHTrWBRmFzcy00A/high.mp4)

  ## Contact

  - Twitter

  - Email
  `;

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    const isConnect = localStorage.getItem("isConnect");
    if (isConnect != "true") {
      alert("지갑 연결이 필요합니다.");
      return;
    }
    setOpen(true);
  };

  const totalFundingAmount = () => {
    let totalAmount = 0;

    for (const funding of fundingList) {
      totalAmount += (funding as any).amount;
    }

    return formatNumber(totalAmount);
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/project/${id}`);
        setProject(result.data.project);
        const fundingResult = await axios.get(`/api/project/${id}/funding`);
        setFundingList(fundingResult.data.fundingList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
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
        <SimpleDialog open={open} onClose={handleClose} />
        <Container maxWidth="xl">
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 8">
              <CardMedia
                sx={{ height: 300, borderRadius: 2, mb: 5 }}
                image="https://source.unsplash.com/random?it"
                title="green iguana"
              />
              <Typography variant="h3">{project?.title}</Typography>
              <Typography variant="body1">{project?.desc}</Typography>

              <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Category
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        {project?.category ?? "Web3"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>{" "}
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Funding Goal
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        {project?.goal} CCIP-BnM
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>{" "}
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Identity Certifiate
                      </Typography>
                      {project?.pid_verified ? (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="primary" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> with Polygon ID</small>
                        </Typography>
                      ) : (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="warning" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> Not verified</small>
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>{" "}
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Project Certificate
                      </Typography>
                      {project?.por_verified ? (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="primary" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> with Chainlink PoR</small>
                        </Typography>
                      ) : (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="warning" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> Not verified</small>
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box
                component={Paper}
                sx={{
                  padding: 3,
                  mt: 3,
                }}
              >
                <Markdown>{markdown}</Markdown>
              </Box>
              <Table sx={{ mt: 5 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Chain</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>CCIP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fundingList &&
                    fundingList.map((funding: any) => {
                      return (
                        <TableRow hover key={funding.id}>
                          <TableCell>
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "#80b6da",
                              }}
                              href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                            >
                              {funding.project_title}
                            </Link>
                          </TableCell>
                          <TableCell>{funding.chain}</TableCell>
                          <TableCell>
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "#80b6da",
                              }}
                              href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                            >
                              {maskAddress(funding.address)}
                            </Link>
                          </TableCell>
                          <TableCell>{funding.amount} CCIP-BnM</TableCell>
                          <TableCell>{funding.fund_date}</TableCell>
                          <TableCell>
                            <Link
                              href={`https://ccip.chain.link/msg/0xdfcd24985af75ee603013f35a6eef92369132f7d62be898c6f0903e8ed11daf9`}
                              target="_blank"
                            >
                              <Chip
                                label="CCIP Explorer"
                                color="primary"
                                variant="outlined"
                                sx={{ marginRight: 2 }}
                              />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Box>

            <Box
              component={Paper}
              gridColumn="span 4"
              sx={{
                // isFixed 값에 따라 스타일을 동적으로 설정
                position: isFixed ? "sticky" : "sticky",
                top: isFixed ? "0" : "200",
                borderRadius: 2,
                ml: 5,
                height: 300,
                padding: 3,
              }}
            >
              <Box>
                <Chip label="Now Funding" color="primary" variant="outlined" />
                <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
                  {totalFundingAmount()} CCIP-BnM
                </Typography>
                <Progress color="success" />
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 4 }}>
                  {formatDate(project?.start_date)} ~{" "}
                  {formatDate(project?.end_date)}
                </Typography>
              </Box>

              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={handleClickOpen}
              >
                Funding
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
