import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { useCallback, useState } from "react";
import { FundingGrid } from "@/components/project/funding-grid";

const Page = () => {
  return (
    <DashboardLayout>
      <Head>
        <title>Projects</title>
      </Head>
      <Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <FundingGrid />
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
