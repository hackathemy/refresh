import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { DaoCard } from "./dao-card";

export const DaoList = () => {
  const [fundingList, setFundingList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `/api/funding/${window.ethereum.selectedAddress}`
        );
        setFundingList(result.data.projects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3}>
      {fundingList &&
        fundingList.map((funding: any) => {
          return (
            <Grid item xs={12} md={12} lg={12} key={funding.id}>
              <DaoCard funding={funding} />
            </Grid>
          );
        })}
    </Grid>
  );
};
