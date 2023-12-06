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

  const resources = [
    {
      title: "Refresh Github",
      url: "https://github.com/hackathemy/refresh",
    },
    {
      title: "Contract Github",
      url: "https://github.com/hackathemy/refresh-contract",
    },
    {
      title: "Refresh Contract Explorer (CCIP)",
      url: "https://",
    },
    {
      title: "Refresh Contract Explorer (CCIP)",
      url: "https://",
    },
    {
      title: "Refresh Contract Explorer (CCIP)",
      url: "https://",
    },
    {
      title: "Refresh Contract Explorer (CCIP)",
      url: "https://",
    },
  ];
  return (
    <DashboardLayout>
      <Head>
        <title>Re-fresh</title>
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
            color="text.primary"
            gutterBottom
          >
            Re-fresh?
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            To revive a dying project!
          </Typography>
          <Typography variant="body1">
            Many projects often lose momentum and updates over time, even after
            initially generating excitement or winning awards at a hackathon.
            Our goal is to see these projects see the light of day again.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          Current Stats
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
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Project Count
                </Typography>
                <Typography>{(stats as any)?.projectCount}</Typography>
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
                <Typography gutterBottom variant="h5" component="h2">
                  Funding Amount
                </Typography>
                <Typography>
                  {(stats as any)?.fundingAmount} CCIP-BnM
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
                <Typography gutterBottom variant="h5" component="h2">
                  Funding Count
                </Typography>
                <Typography>{(stats as any)?.fundingCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          How can solve?
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
                  Automatic creation of profit distribution system for funding
                  rewards (vesting)
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
                  Discover safe projects through multiple certifications
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
                  Providing DAO governance system for funding investors
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

        <img width="100%" src="/assets/images/flow.png" />
      </Container>
      <Container sx={{ py: 6 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          Resources
        </Typography>
        <List>
          {resources.map((resource) => (
            <ListItem>
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
