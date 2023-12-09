import {
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { maskAddress } from "@/functions/string-functions";

const statusMap: any = {
  success: "success",
  fail: "error",
};

export const FundingHistory = () => {
  const [fundingList, setFundingList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/funding");
        setFundingList(result.data.fundingList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Chain</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Tracking</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fundingList &&
              fundingList.map((funding: any) => {
                return (
                  <TableRow hover key={funding.id}>
                    <TableCell>
                      <Link
                        style={{ textDecoration: "none", color: "#80b6da" }}
                        href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                      >
                        {funding.project_title}
                      </Link>
                    </TableCell>
                    <TableCell>{funding.chain}</TableCell>
                    <TableCell>
                      <Link
                        style={{ textDecoration: "none", color: "#80b6da" }}
                        href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                      >
                        {maskAddress(funding.address)}
                      </Link>
                    </TableCell>
                    <TableCell>{funding.amount} CCIP-BnM</TableCell>
                    <TableCell>{funding.fund_date}</TableCell>
                    <TableCell>
                      <Link
                        href={`https://ccip.chain.link/msg/0xdfcd24985af75ee603013f35a6eef92369132f7d62be898c6f0903e8ed11daf9`}
                        target="_blank"
                      >
                        <Chip
                          label="CCIP Explorer"
                          color="primary"
                          variant="outlined"
                          sx={{ marginRight: 2 }}
                        />
                      </Link>
                      <Link
                        href={`https://ccip.chain.link/msg/0xdfcd24985af75ee603013f35a6eef92369132f7d62be898c6f0903e8ed11daf9`}
                        target="_blank"
                      >
                        <Chip
                          label="Source"
                          color="primary"
                          variant="outlined"
                          sx={{ marginRight: 2 }}
                        />
                      </Link>
                      <Link
                        href={`https://ccip.chain.link/msg/0xdfcd24985af75ee603013f35a6eef92369132f7d62be898c6f0903e8ed11daf9`}
                        target="_blank"
                      >
                        <Chip
                          label="Destination"
                          color="primary"
                          variant="outlined"
                          sx={{ marginRight: 2 }}
                        />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};
