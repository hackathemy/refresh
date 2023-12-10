import Head from "next/head";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Link,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Markdown from "react-markdown";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { useEffect, useState } from "react";
import SimpleDialog from "@/components/project/funding-modal";
import {
  formatDate,
  formatNumber,
  maskAddress,
} from "@/functions/string-functions";
import axios from "axios";
import { useRouter } from "next/router";
import { Progress } from "@/components/progress/linear-progress";

const Page = () => {
  const router = useRouter();
  const id = router.query.id;
  const [fundingList, setFundingList] = useState([]);
  const [project, setProject]: any = useState();
  const [open, setOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const markdown = `
  # A demo of \`react-markdown\`
  
  \`react-markdown\` is a markdown component for React.
  
  👉 Changes are re-rendered as you type.
  
  👈 Try writing some markdown on the left.
  
  ## Overview
  
  * Follows [CommonMark](https://commonmark.org)
  * Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
  * Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
  * Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
  * Has a lot of plugins
  
  ## Contents
  
  Here is an example of a plugin in action
  ([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
  **This section is replaced by an actual table of contents**.
  
  ## Syntax highlighting
  
  Here is an example of a plugin to highlight code:
  [\`rehype-highlight\`](https://github.com/rehypejs/rehype-highlight).
  
  \`\`\`js
  import React from 'react'
  import ReactDOM from 'react-dom'
  import Markdown from 'react-markdown'
  import rehypeHighlight from 'rehype-highlight'
  
  const markdown = \`
  # Your markdown here
  \`
  
  ReactDOM.render(
    <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>,
    document.querySelector('#content')
  )
  \`\`\`
  
  Pretty neat, eh?
  
  ## GitHub flavored markdown (GFM)
  
  For GFM, you can *also* use a plugin:
  [\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
  It adds support for GitHub-specific extensions to the language:
  tables, strikethrough, tasklists, and literal URLs.
  
  These features **do not work by default**.
  👆 Use the toggle above to add the plugin.
  
  | Feature    | Support              |
  | ---------: | :------------------- |
  | CommonMark | 100%                 |
  | GFM        | 100% w/ \`remark-gfm\` |
  
  ~~strikethrough~~
  
  * [ ] task list
  * [x] checked item
  
  https://example.com
  
  ## HTML in markdown
  
  ⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
  use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).
  You should probably combine it with
  [\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).
  
  <blockquote>
    👆 Use the toggle above to add the plugin.
  </blockquote>
  
  ## Components
  
  You can pass components to change things:
  
  \`\`\`js
  import React from 'react'
  import ReactDOM from 'react-dom'
  import Markdown from 'react-markdown'
  import MyFancyRule from './components/my-fancy-rule.js'
  
  const markdown = \`
  # Your markdown here
  \`
  
  ReactDOM.render(
    <Markdown
      components={{
        // Use h2s instead of h1s
        h1: 'h2',
        // Use a component instead of hrs
        hr(props) {
          const {node, ...rest} = props
          return <MyFancyRule {...rest} />
        }
      }}
    >
      {markdown}
    </Markdown>,
    document.querySelector('#content')
  )
  \`\`\`
  
  ## More info?
  
  Much more info is available in the
  [readme on GitHub](https://github.com/remarkjs/react-markdown)!
  
  ***
  
  A component by [Espen Hovlandsdal](https://espen.codes/)
  `;

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    const isConnect = localStorage.getItem("isConnect");
    if (isConnect != "true") {
      alert("지갑 연결이 필요합니다.");
      return;
    }
    setOpen(true);
  };

  const totalFundingAmount = () => {
    let totalAmount = 0;

    for (const funding of fundingList) {
      totalAmount += (funding as any).amount;
    }

    return formatNumber(totalAmount);
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/project/${id}`);
        setProject(result.data.project);
        const fundingResult = await axios.get(`/api/project/${id}/funding`);
        setFundingList(fundingResult.data.fundingList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      // 특정 위치(예: 200px)에서 스크롤이 발생하면 isFixed 상태를 true로 설정
      const scrollPosition = window.scrollY;
      const threshold = 200;

      if (scrollPosition > threshold) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <DashboardLayout>
      <Head>
        <title>Project Detail</title>
      </Head>
      <Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <SimpleDialog open={open} onClose={handleClose} />
        <Container maxWidth="xl">
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 8">
              <CardMedia
                sx={{ height: 300, borderRadius: 2, mb: 5 }}
                image="https://source.unsplash.com/random?it"
                title="green iguana"
              />
              <Typography variant="h3">{project?.title}</Typography>
              <Typography variant="body1">{project?.desc}</Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Category
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        {project?.category ?? "Web3"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>{" "}
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Funding Goal
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        {project?.goal} CCIP-BnM
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>{" "}
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Identity Certifiate
                      </Typography>
                      {project?.pid_verified ? (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="primary" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> with Polygon ID</small>
                        </Typography>
                      ) : (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="warning" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> Not verified</small>
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>{" "}
                <Grid item xs={12} sm={4} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ mt: 2 }}
                      >
                        Project Certificate
                      </Typography>
                      {project?.por_verified ? (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="primary" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> with Chainlink PoR</small>
                        </Typography>
                      ) : (
                        <Typography gutterBottom sx={{ mt: 2 }}>
                          <SvgIcon color="warning" fontSize="large">
                            <CheckBadgeIcon />
                          </SvgIcon>
                          <small> Not verified</small>
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box
                component={Paper}
                sx={{
                  padding: 3,
                  mt: 3,
                }}
              >
                <Markdown>{markdown}</Markdown>
              </Box>
              <Table sx={{ mt: 5 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Chain</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>CCIP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fundingList &&
                    fundingList.map((funding: any) => {
                      return (
                        <TableRow hover key={funding.id}>
                          <TableCell>
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "#80b6da",
                              }}
                              href={`https://refresh.hackathemy.me/project/${funding.project_id}`}
                            >
                              {funding.project_title}
                            </Link>
                          </TableCell>
                          <TableCell>{funding.chain}</TableCell>
                          <TableCell>
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "#80b6da",
                              }}
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Box>

            <Box
              component={Paper}
              gridColumn="span 4"
              sx={{
                // isFixed 값에 따라 스타일을 동적으로 설정
                position: isFixed ? "sticky" : "sticky",
                top: isFixed ? "0" : "200",
                borderRadius: 2,
                ml: 5,
                height: 300,
                padding: 3,
              }}
            >
              <Box>
                <Chip label="Now Funding" color="primary" variant="outlined" />
                <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
                  {totalFundingAmount()} CCIP-BnM
                </Typography>
                <Progress color="success" />
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 4 }}>
                  {formatDate(project?.start_date)} ~{" "}
                  {formatDate(project?.end_date)}
                </Typography>
              </Box>

              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                onClick={handleClickOpen}
              >
                Funding
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page;
