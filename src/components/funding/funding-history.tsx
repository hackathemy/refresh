import {
  Avatar,
  Box,
  Card,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import PersonIcon from "@mui/icons-material/Person";
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
      <Box sx={{ minWidth: 1200 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Chain</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Message</TableCell>
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
                    <TableCell style={{paddingLeft: 1}}>
                      <ListItem disableGutters>
                        <ListItemAvatar>
                
              
                      
                        {funding.chain == 'Sepolia' && (            
                          <Avatar src="/assets/images/eth-diamond-black-white.jpg"/>                   
                        )}
                        {funding.chain == 'Fuji' && (            
                          <Avatar src="/assets/images/avalanche-avax-logo.svg"/>                  
                        )}
                        {funding.chain == 'Bnb' && (            
                          <Avatar sx={{width:70, height:50, marginLeft:-2}} src="/assets/images/binance-smart-chain-bsc-seeklogo.com.svg"/>               
                        )}
                        {funding.chain == 'Optimism' && (            
                          <Avatar sx={{width:40, height:40,}} src="https://cryptologos.cc/logos/optimism-ethereum-op-logo.png"/>                  
                        )}
                        </ListItemAvatar>
                            <ListItemText
                              primary={funding.chain}
                            />
                    
                      </ListItem>
                    </TableCell>
                    <TableCell>
                      <Link
                        style={{ textDecoration: "none", color: "#80b6da" }}
                        href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                      >
                        {maskAddress(funding.address)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        style={{ textDecoration: "none", color: "#80b6da" }}
                        href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                      >
                        {maskAddress(funding.message_id)}
                      </Link>
                    </TableCell>
                    <TableCell>{funding.amount} CCIP-BnM</TableCell>
                    <TableCell>{funding.fund_date}</TableCell>
                    <TableCell>
                      <Link
                        href={`https://ccip.chain.link/msg/${funding.message_id}`}
                        target="_blank"
                      >
                        <Chip
                          label="CCIP Explorer"
                          color="primary"
                          variant="outlined"
                          sx={{ marginRight: 2 }}
                        />
                      </Link>

                      {funding.chain == 'Sepolia' && (            
                          <Link
                          href={`https://sepolia.etherscan.io/tx/${funding.src_tx}`}
                          target="_blank"
                          >
                            <Chip
                              label="Source"
                              color="primary"
                              variant="outlined"
                              sx={{ marginRight: 2 }}
                            />
                          </Link>              
                        )}
                        {funding.chain == 'Fuji' && (            
                          <Link
                          href={`https://testnet.snowtrace.io/tx/${funding.src_tx}`}
                          target="_blank"
                          >
                            <Chip
                              label="Source"
                              color="primary"
                              variant="outlined"
                              sx={{ marginRight: 2 }}
                            />
                          </Link>                      
                        )}
                        {funding.chain == 'Bnb' && (            
                          <Link
                          href={`https://testnet.bscscan.com/tx/${funding.src_tx}`}
                          target="_blank"
                          >
                            <Chip
                              label="Source"
                              color="primary"
                              variant="outlined"
                              sx={{ marginRight: 2 }}
                            />
                          </Link>   
                        )}
                        {funding.chain == 'Optimism' && (            
                          <Link
                          href={`https://goerli-optimism.etherscan.io/tx/${funding.src_tx}`}
                          target="_blank"
                          >
                            <Chip
                              label="Source"
                              color="primary"
                              variant="outlined"
                              sx={{ marginRight: 2 }}
                            />
                          </Link>   
                        )}

                      
                      <Link
                        href={`https://mumbai.polygonscan.com/tx/${funding.dest_tx}`}
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
