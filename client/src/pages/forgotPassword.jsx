import React, { useEffect, useState } from "react";
import { TextField, Paper, Box, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import showToast from "../components/showToast";
import theme from "../layout/theme";
import FullWidthSubmitButton from "../components/fullWidthSubmitButton";
import FullWidthLoadingButton from "../components/FullWidthLoadingButton";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(true);

  const userSchema = Yup.object({
    email: Yup.string()
      .required("Email address is required")
      .email("Invalid email address"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values, helpers) => {
      console.log(values);
      notify(200, values.email);
    },
    validationSchema: userSchema,
  });
  const notify = (status, message) => showToast(status, message);
  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <Box
            sx={{
              my: 12,
              mx: 4,
              px: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              height: 100,
            }}
          >
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              component={Paper}
              elevation={6}
              square
            >
              <Box sx={{ mx: 4, my: 4 }}>
                <Typography component="h3" variant="h3" align="left">
                  Reset Password
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type="email"
                    error={formik.errors.email}
                    onChange={formik.handleChange}
                    helperText={formik.errors.email}
                    autoFocus
                  />
                  {loading ? (
                    <FullWidthSubmitButton text={"Send Email"} />
                  ) : (
                    <FullWidthLoadingButton />
                  )}
                </form>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default ForgotPassword;
