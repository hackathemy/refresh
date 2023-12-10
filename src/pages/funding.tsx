import Head from "next/head";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { FundingHistory } from "@/components/funding/funding-history";
import stats from "./api/stats";
import axios from "axios";
import { useState, useEffect } from "react";

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
                  <Grid item xs={12} sm={3} md={2}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h4">{stat.chain}</Typography>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          sx={{ mt: 2 }}
                        >
                          {stat.amount} CCIP-BnM
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          sx={{ mt: 2 }}
                        >
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
