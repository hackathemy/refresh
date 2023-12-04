import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Unstable_Grid2 as Grid,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { useCallback, useState } from "react";
import { FundingGrid } from "@/components/project/funding-grid";
import { validator } from "web3";
import axios from "axios";

const Page = () => {
  const formik = useFormik({
    initialValues: {
      title: "",
      desc: "",
      goal: "",
      duration: "",
      submit: null,
    },
    onSubmit: async (values, helpers) => {
      try {
        axios
          .post("/api/project", values)
          .then(function (response) {
            if (response.status === 200) {
              console.log("success");
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
                  <TextField
                    error={!!(formik.touched.title && formik.errors.title)}
                    fullWidth
                    label="Title"
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.title}
                  />
                  <TextField
                    error={!!(formik.touched.desc && formik.errors.desc)}
                    fullWidth
                    label="Description"
                    name="desc"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.desc}
                  />
                  <TextField
                    error={!!(formik.touched.goal && formik.errors.goal)}
                    fullWidth
                    label="Funding Goal"
                    name="goal"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.goal}
                  />
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
                </Stack>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
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
