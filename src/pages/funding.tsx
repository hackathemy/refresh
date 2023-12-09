import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { FundingHistory } from "@/components/funding/funding-history";

const Page = () => {
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
          <FundingHistory />
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
