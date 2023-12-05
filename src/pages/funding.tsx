import Head from "next/head";
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { useCallback, useState } from "react";
import { FundingGrid } from "@/components/project/funding-grid";
import { FundingList } from "@/components/funding/funding-list";

const Page = () => {
  const [method, setMethod] = useState("funding");
  const handleMethodChange = useCallback((event: any, value: string) => {
    setMethod(value);
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
          <Stack spacing={3}>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Funding" value="funding" />
           
            </Tabs>
            {method == "funding" && <FundingList />}
         
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
