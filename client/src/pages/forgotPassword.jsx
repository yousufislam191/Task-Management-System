import React, { useState } from "react";
import { TextField, Paper, Box, Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import showToast from "../components/showToast";
import theme from "../layout/theme";
import FullWidthSubmitButton from "../components/FullWidthSubmitButton";
import FullWidthLoadingButton from "../components/FullWidthLoadingButton";
import { useNavigate } from "react-router-dom";
import apiHostName from "../../secret";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const notify = (status, message) => showToast(status, message);

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
      setLoading(false);
      try {
        const res = await axios.post(`${apiHostName}/user/forgot-password`, {
          email: values.email,
        });
        if (res.data.success === true) {
          setLoading(true);
          notify(res.status, res.data.message);
        }
      } catch (err) {
        setLoading(true);
        notify(err.response.status, err.response.data.message);
      }
    },
    validationSchema: userSchema,
  });

  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <Box
            sx={{
              my: 12,
              mx: 4,
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
              borderRadius={4}
            >
              <Box sx={{ mx: 3, my: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ArrowBackIcon
                    onClick={() => navigate("/")}
                    sx={{ cursor: "pointer" }}
                  />
                  <Typography component="h3" variant="h3" align="left">
                    Reset Password
                  </Typography>
                </Box>
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
