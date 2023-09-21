import React, { useState } from "react";
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
import FullWidthSubmitButton from "../components/FullWidthSubmitButton";
import FullWidthLoadingButton from "../components/FullWidthLoadingButton";
import apiHostName from "../../secret";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const userSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: Yup.string()
      .required("Email address is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values, helpers) => {
      setLoading(false);
      const res = await axios
        .post(`${apiHostName}/user/register`, {
          name: values.name,
          email: values.email,
          password: values.password,
        })
        .catch((err) => {
          notify(err.response.status, err.response.data.message);
        });
      if (res.data.success === true) {
        setLoading(true);
        notify(res.status, res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    },
    validationSchema: userSchema,
  });
  const notify = (status, message) => showToast(status, message);

  return (
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
                Sign Up
              </Typography>
              <Box sx={{ mt: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    type="name"
                    error={formik.errors.name}
                    onChange={formik.handleChange}
                    helperText={formik.errors.name}
                    autoFocus
                  />
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
                    <FullWidthSubmitButton text={"Sign Up"} />
                  ) : (
                    <FullWidthLoadingButton />
                  )}
                </form>
                <div className="flex justify-center text-center gap-3">
                  <Typography variant="body2" align="center">
                    Have an account?
                  </Typography>
                  <Typography variant="body2" align="center">
                    <Link href="/">Sign In</Link>
                  </Typography>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default SignUp;
