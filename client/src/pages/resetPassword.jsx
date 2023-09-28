import { ThemeProvider } from "@emotion/react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import theme from "../layout/theme";
import FullWidthSubmitButton from "../components/FullWidthSubmitButton";
import FullWidthLoadingButton from "../components/FullWidthLoadingButton";
import apiHostName from "../../secret";
import showToast from "../components/showToast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const notify = (status, message) => showToast(status, message);

  const userSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf(
        [Yup.ref("password"), null],
        "Confirm password does not match with New password"
      ),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, helpers) => {
      setLoading(false);
      try {
        const res = await axios.put(`${apiHostName}/user/reset-password`, {
          token: token,
          password: values.confirmPassword,
        });
        if (res.data.success === true) {
          setLoading(true);
          notify(res.status, res.data.message);
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } catch (err) {
        setLoading(true);
        notify(err.response.status, err.response.data.message);
      }
    },
    validationSchema: userSchema,
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 2,
              mt: 6,
              width: "100%",
              height: 100,
            }}
          >
            <Typography component="h3" variant="h3">
              Task Management System
            </Typography>
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              mt={6}
              component={Paper}
              elevation={4}
              square
              borderRadius={2}
            >
              <Box
                sx={{
                  mx: 3,
                  my: 3,
                }}
              >
                <Typography component="h3" variant="h3">
                  Set Your New Password
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="New Password"
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
                  <TextField
                    margin="normal"
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    id="confirmPassword"
                    autoComplete="current-password"
                    type={showConfirmPassword ? "text" : "password"}
                    error={formik.errors.confirmPassword}
                    onChange={formik.handleChange}
                    helperText={formik.errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
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
                    <FullWidthSubmitButton text={"Reset Password"} />
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

export default ResetPassword;
