import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { FundingList } from "@/components/funding/funding-list";

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
          <FundingList />
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
