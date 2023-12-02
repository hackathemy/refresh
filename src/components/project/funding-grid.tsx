import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProjectCard } from "./project-card";

export const FundingGrid = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/project");
        setProjects(result.data.projects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3}>
      {projects &&
        projects.map((project: any) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          );
        })}
    </Grid>
  );
};
