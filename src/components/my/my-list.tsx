import { Box, Button, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { MyCard } from "./my-card";

export const MyList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/project`);
        const filteredProjects = result.data.projects.filter(
          (project: any) =>
            project.writer.toLowerCase() ==
            window.ethereum.selectedAddress.toLowerCase()
        );
        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="flex-end">
        <Button
          sx={{ mb: 3 }}
          variant="contained"
          size="large"
          onClick={() => (location.href = "/project/create")}
        >
          Create RE-fresh Project for Funding
        </Button>
      </Box>
      <Grid container spacing={3}>
        {projects &&
          projects.map((dao: any) => {
            return (
              <Grid item xs={12} md={12} lg={12} key={dao.id}>
                <MyCard dao={dao} />
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
};
