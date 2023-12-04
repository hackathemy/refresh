import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";

export default function Home() {
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <DashboardLayout>
      <Head>
        <title>Re-fresh</title>
      </Head>
      <Box
        sx={{
          bgcolor: "neutral.200",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Re-fresh?
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            To revive a dying project!
          </Typography>
          <Typography variant="body1">
            Many projects often lose momentum and updates over time, even after
            initially generating excitement or winning awards at a hackathon.
            Our goal is to see these projects see the light of day again.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          How can solve?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  // 16:9
                  pt: "56.25%",
                }}
                image="https://source.unsplash.com/random?money"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Funding
                </Typography>
                <Typography>
                  Automatic creation of profit distribution system for funding
                  rewards (vesting)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  // 16:9
                  pt: "56.25%",
                }}
                image="https://source.unsplash.com/random?secure"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Safe project
                </Typography>
                <Typography>
                  Discover safe projects through multiple certifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  // 16:9
                  pt: "56.25%",
                }}
                image="https://source.unsplash.com/random?group"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  DAO
                </Typography>
                <Typography>
                  Providing DAO governance system for funding investors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ py: 1 }} maxWidth="md">
        <Typography gutterBottom variant="h4">
          Architecture
        </Typography>

        <CardMedia
          sx={{ height: 500, borderRadius: 2, marginBottom: 2 }}
          image="/assets/images/tree.jpg"
          title="green iguana"
        />
      </Container>
    </DashboardLayout>
  );
}
