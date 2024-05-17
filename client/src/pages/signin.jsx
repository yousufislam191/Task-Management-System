import React, { useEffect, useState } from "react";
import {
  TextField,
  Link,
  IconButton,
  Paper,
  Box,
  InputAdornment,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";

import SideImage from "../components/SideImage";
import showToast from "../components/showToast";
import theme from "../layout/theme";
import FullWidthLoadingButton from "../components/FullWidthLoadingButton";
import apiHostName from "../../secret";
import Loading from "../components/Loading";
import FullWidthSubmitButton from "../components/FullWidthSubmitButton";

axios.defaults.withCredentials = true;

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkingkAccessToken, setCheckingkAccessToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const userSchema = Yup.object({
    email: Yup.string()
      .required("Email address is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, helpers) => {
      setLoading(false);
      const res = await axios
        .post(
          `${apiHostName}/auth/login`,
          {
            email: values.email,
            password: values.password,
          },
          { withCredentials: true }
        )
        .catch((err) => {
          setLoading(true);
          notify(err.response.status, err.response.data.message);
        });
      if (res.data.success === true) {
        setLoading(true);
        notify(res.status, res.data.message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    },
    validationSchema: userSchema,
  });
  const notify = (status, message) => showToast(status, message);

  const checkAccessToken = async () => {
    try {
      const res = await axios.get(`${apiHostName}/auth/refresh-token`, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        setCheckingkAccessToken(true);
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    checkAccessToken();
  }, []);

  return checkingkAccessToken ? (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <SideImage />
          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 12,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h3" align="left">
                Sign In
              </Typography>
              <Box sx={{ mt: 2 }}>
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
                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    id="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    error={formik.errors.password}
                    onChange={formik.handleChange}
                    helperText={formik.errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {loading ? (
                    <FullWidthSubmitButton text={"Sign In"} />
                  ) : (
                    <FullWidthLoadingButton />
                  )}
                </form>
                <div>
                  <Typography variant="body2" align="left">
                    <Link href="/forgot-password">Forgot Password?</Link>
                  </Typography>
                  <div className="flex justify-center text-center gap-3 mt-2">
                    <Typography variant="body2" align="center">
                      Don't have an account?
                    </Typography>
                    <Typography variant="body2" align="center">
                      <Link href="/signup">Sign Up</Link>
                    </Typography>
                  </div>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  ) : (
    <Loading />
  );
};

export default SignIn;
