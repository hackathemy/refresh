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
import { DaoList } from "@/components/dao/dao-list";
import { MyList } from "@/components/my/my-list";

const Page = () => {
  const [method, setMethod] = useState("my");
  const handleMethodChange = useCallback((event: any, value: string) => {
    setMethod(value);
  }, []);

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
          <Stack spacing={3}>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="My Projects" value="my" />
              <Tab label="Funded Projects" value="funding" />
            </Tabs>
            {method == "my" && <MyList />}
            {method == "funding" && <DaoList />}
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
