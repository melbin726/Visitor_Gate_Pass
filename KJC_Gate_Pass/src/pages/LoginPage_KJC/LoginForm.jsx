import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = API_BASE_URL;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const notifyErr = (text) =>
    toast.error(`${text}`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });

  const notifySuccess = (text) =>
    toast.success(`${text}`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });

  const handleLogin = (event) => {
    event.preventDefault();
    const lowercaseEmail = email.toLowerCase();
    axios
      .post(`${API_URL}/login`, { email: lowercaseEmail, password })
      .then((result) => {
        if (result.data.message === "Success") {
          notifySuccess("Success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          notifyErr(result.data);
          navigate("/login");
        }
        setPassword("");
        setEmail("");
      })
      .catch((err) => console.log(err));
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <Paper
  elevation={6}
  sx={{
    p: 3, // Reduced padding
    borderRadius: "12px", // Slightly reduced border-radius
    width: "100%",
    maxWidth: "350px", // Reduced max width
    mx: "auto",
  }}
>
  {!showForgotPassword ? (
    <Box component="form" onSubmit={handleLogin}>
      
      <TextField
        label="Email"
        value={email}
        onChange={handleEmailChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px", // Reduced border radius
            "& input": {
              padding: "10px 12px", // Reduced padding
            },
          },
        }}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& input": {
              padding: "10px 12px",
            },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          py: 1.2, // Reduced padding for height
          borderRadius: "10px", // Slightly curved edges
          fontSize: "15px", // Reduced font size
        }}
      >
        Sign in
      </Button>
      <Typography
        variant="body2"
        color="primary"
        align="center"
        sx={{ mt: 2, cursor: "pointer" }}
        onClick={handleForgotPassword}
      >
        Forgot your password?
      </Typography>
    </Box>
  ) : (
    <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
  )}
  <ToastContainer />
</Paper>

  );
}

export default LoginForm;