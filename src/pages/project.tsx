import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { ProjectGrid } from "@/components/project/project-grid";

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
          <ProjectGrid />
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
