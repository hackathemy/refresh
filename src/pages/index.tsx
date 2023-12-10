import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  List,
  ListItem,
  Link,
  Typography,
  Icon,
} from "@mui/material";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/stats");
        console.log(result);
        setStats(result.data.stats[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fundingContracts = [
    {
      title: "Ethereum",
      type: "Source",
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      url: "https://sepolia.etherscan.io/address/0xd6EC03DE92b00A58204A020b721705114A724E00",
    },
    {
      title: "Avalanche",
      type: "Source",
      icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
      url: "https://testnet.snowtrace.io/address/0xd6EC03DE92b00A58204A020b721705114A724E00",
    },
    {
      title: "BNB",
      type: "Source",
      icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
      url: "https://testnet.bscscan.com/address/0x337a02e1757e66084820e7c7bb6ef99c7bbf7d0c",
    },
    {
      title: "Optimism",
      type: "Source",
      icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
      url: "https://goerli-optimism.etherscan.io/address/0xd6ec03de92b00a58204a020b721705114a724e00",
    },
    {
      title: "Polygon",
      type: "Destination",
      icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
      url: "https://mumbai.polygonscan.com/address/0x8edbc869108da99f6feb062136bc7d7aa5764542",
    },
  ];

  const resources = [
    {
      title: "Refresh Frontend",
      url: "https://github.com/hackathemy/refresh",
    },
    {
      title: "Refresh Protocol Contract",
      url: "https://github.com/hackathemy/refresh-contract",
    },
    {
      title: "Refresh Polygon ID Implementation",
      url: "https://github.com/hackathemy/polygon-id",
    },
  ];
  return (
    <DashboardLayout>
      <Head>
        <title>RE-fresh</title>
      </Head>
      <Box
        sx={{
          bgcolor: "neutral.200",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="primary"
            gutterBottom
          >
            RE-fresh !?
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            To breathe life into a dying project.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Many projects often lose momentum and updates over time, even after
            initially generating excitement or winning awards at a hackathon.
            Our goal is to see these projects see the light of day again.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h2">
                  {(stats as any)?.projectCount}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  sx={{ mt: 2 }}
                >
                  Funding Project
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h2">
                  {(stats as any)?.fundingAmount}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  sx={{ mt: 2 }}
                >
                  Funding CCIP-BnM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h2">
                  {(stats as any)?.fundingCount}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  sx={{ mt: 2 }}
                >
                  Funding Count
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          How to breathe ?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  // 16:9
                  pt: "56.25%",
                }}
                image="https://source.unsplash.com/random?money"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Funding
                </Typography>
                <Typography>
                  Easily fund using multichain assets via <strong>CCIP</strong>.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  // 16:9
                  pt: "56.25%",
                }}
                image="https://source.unsplash.com/random?secure"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Safe project
                </Typography>
                <Typography>
                  Discover safe projects through various certifications such as{" "}
                  <strong>PoR</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  // 16:9
                  pt: "56.25%",
                }}
                image="https://source.unsplash.com/random?group"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  DAO
                </Typography>
                <Typography>
                  Provides DAO governance system for execution of investor funds
                  using <strong>Polygon Id</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ py: 1 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          Architecture
        </Typography>
        <a
          href="https://refresh.hackathemy.me/assets/images/flow.png"
          target="_blank"
        >
          <img width="100%" src="/assets/images/flow.png" />
        </a>
      </Container>
      <Container sx={{ py: 6 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          Contracts
        </Typography>
        <List>
          {fundingContracts.map((resource) => (
            <ListItem sx={{ flexGrow: 1 }}>
              <Typography variant="body1">
                <img
                  src={resource.icon}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                />
                {resource.title}({resource.type}) :{" "}
                <Link href={resource.url} component={NextLink}>
                  {resource.url}
                </Link>
              </Typography>
            </ListItem>
          ))}
        </List>
      </Container>
      <Container maxWidth="md">
        <Typography gutterBottom variant="h4">
          Resources
        </Typography>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        ></Card>
        <List>
          {resources.map((resource) => (
            <ListItem sx={{ flexGrow: 1 }}>
              <Typography variant="body1">
                {resource.title} :{" "}
                <Link href={resource.url} component={NextLink}>
                  {resource.url}
                </Link>
              </Typography>
            </ListItem>
          ))}
        </List>
      </Container>
    </DashboardLayout>
  );
}
