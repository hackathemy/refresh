import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { DaoCard } from "./dao-card";

export const DaoList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `/api/funding/${window.ethereum.selectedAddress}`
        );
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
        projects.map((dao: any) => {
          return (
            <Grid item xs={12} md={12} lg={12} key={dao.id}>
              <DaoCard dao={dao} />
            </Grid>
          );
        })}
    </Grid>
  );
};
