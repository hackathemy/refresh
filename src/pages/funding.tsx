import Head from "next/head";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { FundingHistory } from "@/components/funding/funding-history";
import axios from "axios";
import { useState, useEffect } from "react";
import { formatNumber } from "@/functions/string-functions";

const Page = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/fund-stats");
        setStats(result.data.stats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <Head>
        <title>Funding</title>
      </Head>
      <Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats &&
              stats.map((stat: any) => {
                return (
                  <Grid item xs={12} sm={4} md={3}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent>
                        <Stack spacing={3} direction={"row"}>
                          {stat.chain == "Sepolia" && (
                            <Avatar
                              sx={{ width: 40, height: 40 }}
                              src="/assets/images/eth-diamond-black-white.jpg"
                            />
                          )}
                          {stat.chain == "Fuji" && (
                            <Avatar
                              sx={{ width: 40, height: 40 }}
                              src="/assets/images/avalanche-avax-logo.svg"
                            />
                          )}
                          {stat.chain == "Bnb" && (
                            <Avatar
                              sx={{ width: 40, height: 40 }}
                              src="/assets/images/binance-smart-chain-bsc-seeklogo.com.svg"
                            />
                          )}
                          {stat.chain == "Optimism" && (
                            <Avatar
                              sx={{ width: 40, height: 40 }}
                              src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.png"
                            />
                          )}
                          <Typography variant="h4">{stat.chain}</Typography>
                        </Stack>

                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          sx={{ mt: 3 }}
                        >
                          {formatNumber(stat.amount)} CCIP-BnM
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                          {stat.count} Txs
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
          <FundingHistory />
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
