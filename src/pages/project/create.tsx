import Head from "next/head";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useEffect, useState } from "react";
import Web3 from "web3";
import axios from "axios";
import PolygonContractABI from "../../../public/assets/abi/polygon_contract.json";
import { useWeb3 } from "@/hooks/useWeb3";
import { MetaMaskInpageProvider } from "@metamask/providers";

const Page = () => {
  const [account, web3] = useWeb3();
  const [writer, setWriter] = useState("");

  useEffect(() => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    setWriter(eth.selectedAddress as any);
    formik.values.writer = eth.selectedAddress as any;
  }, [writer]);

  const getCurChainId = async () => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    const curChainId = await eth.request({
      method: "eth_chainId",
    });
    console.log("curChainId : " + curChainId);
    return curChainId;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      desc: "",
      markdown: "",
      tokenName: "",
      tokenSymbol: "",
      goal: "",
      duration: "",
      writer: "",
      submit: null,
    },
    onSubmit: async (values, helpers) => {
      console.log(values);
      //alues.writer = writer;
      try {
        await axios
          .post("/api/project", values)
          .then(async function (response) {
            if (response.status === 200) {
              console.log("success");
              const insertId = response.data.result[0].insertId;

              if ((await getCurChainId()) !== "80001") {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  // 0x13881 == 80001 == polygon testnet chain ID
                  params: [{ chainId: "0x13881" }],
                });
              }

              const web3 = new Web3((window as any).ethereum);
              await window.ethereum.request({
                method: "eth_requestAccounts",
              });

              if (!web3 || !web3.currentProvider) {
                return;
              }

              // DAI token contract
              const tokenContract =
                "0x9F70C778aD5A738beFD577f12e6e9C1Bc9fBfd48";
              // A DAI token holder
              const tokenHolder = window.ethereum.selectedAddress;
              const contract = new web3.eth.Contract(
                PolygonContractABI,
                tokenContract
              );

              // 메서드의 인자 값 설정
              const contentUri =
                "https://refresh.hackathemy.me/project/" + insertId;
              const tokenName = values.tokenName;
              const tokenSymbol = values.tokenSymbol;

              // Contract 메서드 호출 데이터 생성
              const data = (contract.methods as any)
                .createProject(contentUri, tokenName, tokenSymbol)
                .encodeABI();

              // 트랜잭션 객체 생성
              const transactionObject = {
                from: window.ethereum.selectedAddress,
                to: tokenContract,
                gas: "400000", // 예상 가스 비용
                data: data,
              };

              console.log(transactionObject);

              // MetaMask로 트랜잭션 전송 요청
              window.ethereum
                .request({
                  method: "eth_sendTransaction",
                  params: [transactionObject],
                })
                .then((txHash: any) => {
                  console.log("Transaction Hash:", txHash);
                })
                .catch((error: any) => {
                  console.error("Transaction Error:", error);
                });
            } else {
              console.error(JSON.stringify(response.data));
            }
          })
          .catch(function (error) {
            console.error(JSON.stringify(error));
          })
          .finally(() => {});
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

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
          <Card>
            <CardContent>
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <Typography variant="h4">Create Funding Project</Typography>
                  <Divider />
                  <Typography variant="body1">Project information</Typography>
                  <TextField
                    error={!!(formik.touched.writer && formik.errors.writer)}
                    fullWidth
                    label="Writer"
                    name="writer"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={writer}
                  />{" "}
                  <TextField
                    error={!!(formik.touched.title && formik.errors.title)}
                    fullWidth
                    label="Title"
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.title}
                  />{" "}
                  <TextField
                    error={!!(formik.touched.desc && formik.errors.desc)}
                    fullWidth
                    label="Summary"
                    name="desc"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.desc}
                  />{" "}
                  <TextField
                    error={!!(formik.touched.desc && formik.errors.desc)}
                    fullWidth
                    label="Description ( Markdown )"
                    name="markdown"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.markdown}
                  />{" "}
                  <Divider />
                  <Typography variant="body1">
                    Funding evidence & DAO Token Information
                  </Typography>
                  <TextField
                    error={
                      !!(formik.touched.tokenName && formik.errors.tokenName)
                    }
                    fullWidth
                    label="TokenName"
                    name="tokenName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.tokenName}
                  />
                  <TextField
                    error={
                      !!(
                        formik.touched.tokenSymbol && formik.errors.tokenSymbol
                      )
                    }
                    fullWidth
                    label="TokenSymbol"
                    name="tokenSymbol"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.tokenSymbol}
                  />{" "}
                  <Divider />
                  <Typography variant="body1">Funding goal</Typography>
                  <TextField
                    error={!!(formik.touched.goal && formik.errors.goal)}
                    fullWidth
                    label="Funding Goal"
                    name="goal"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.goal}
                  />{" "}
                  <Divider />
                  <Typography variant="body1">Funding duration</Typography>
                  <TextField
                    error={
                      !!(formik.touched.duration && formik.errors.duration)
                    }
                    fullWidth
                    label="Funding Duration"
                    name="duration"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.duration}
                  />
                  <Divider />
                </Stack>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 5 }}
                  type="submit"
                  variant="contained"
                >
                  Create Project
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
