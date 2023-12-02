import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "@/layouts/dashboard/layout";

export default function Home() {
  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Re-fresh ?</Typography>
            <Typography variant="body1">
              - Many IT and software-related service projects often generate
              high interest and excitement initially. However, as time
              progresses and new technologies emerge, these earlier projects
              often lose traction, cease updates, and gradually fade away. For
              instance, among numerous projects submitted in hackathons, only a
              few receive awards, while the rest disappear without further
              updates. Even award-winning projects frequently stop receiving
              updates after obtaining the prize money. Consequently, many
              projects tend to vanish along with the emergence of new
              technologies.
            </Typography>
            <Typography variant="body1">
              - Therefore, among the projects submerged in obscurity, some
              possess excellent structure and planning. These projects harbor
              potential to regain attention with fresh support. Hence, it's
              crucial to revitalize them by rebuilding in new directions. This
              endeavor could potentially rekindle the dormant potential of these
              previously promising projects, enabling them to receive new awards
              or investments and be revitalized.
            </Typography>
            <Typography variant="body2">
              - Our platform allows for the registration of projects that are no
              longer receiving updates or those seeking continuous updates. All
              details including project introductions and code are publicly
              available upon registration. Users can participate in these
              projects, collaborate on updates or rebuilds, and share profits
              through funding with both the original project owners and
              contributors to the revamped projects.
            </Typography>
            <Typography variant="body2">
              - User authentication utilizes Polygon IDs to establish the
              credibility of individual users and validate their association
              with projects. Upon joining project teams, participants enter the
              DAO system, automatically becoming eligible to share profits if
              they have participated in project funding.
            </Typography>
            <Typography variant="body2">
              - Additionally, the distribution of profits from DAOs and funding,
              as well as fund management, employs CCIP to offer users the
              convenience of investing in various tokens across multiple network
              chains. This allows users to utilize a wide range of tokens for
              investment purposes.
            </Typography>

            <Typography variant="body2">
              - Automatic creation of profit distribution system for funding
              rewards (vesting)
            </Typography>
            <Typography variant="body2">
              - Providing a job search social community for project rebuilding
            </Typography>
            <Typography variant="body2">
              - Providing DAO governance system for funding investors
            </Typography>
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
