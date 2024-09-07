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
        p: 3,
        borderRadius: "12px",
        width: "100%",
        maxWidth: "350px",
        mx: "auto",
        "@media (max-width: 600px)": {
          fontSize: "12px", 
        },
      }}
    >
      {!showForgotPassword ? (
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& input": {
                padding: "10px 12px",
                "@media (max-width: 600px)": {
                  padding: "8px 10px", 
                },
              },
            },
            "@media (max-width: 600px)": {
              fontSize: "12px", 
            },
          }}
        >
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
      borderRadius: "10px",
      height: "44px", // Set a specific height for the input field
      "& input": {
        padding: "0 12px",  // Adjust the padding for better vertical centering
        height: "44px",  // Ensure the input height matches
        lineHeight: "44px", // Adjust the line height
        "@media (max-width: 600px)": {
          padding: "0 10px", 
          height: "40px", // Smaller height for mobile
          lineHeight: "40px",
        },
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
      height: "44px", // Set a specific height for the input field
      "& input": {
        padding: "0 12px", // Adjust the padding for better vertical centering
        height: "44px", // Ensure the input height matches
        lineHeight: "44px", // Adjust the line height
        "@media (max-width: 600px)": {
          padding: "0 10px",
          height: "40px", // Smaller height for mobile
          lineHeight: "40px",
        },
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
              py: 1.2,
              borderRadius: "10px",
              fontSize: "15px",
              "@media (max-width: 600px)": {
                fontSize: "12px", 
                py: 1,
              },
            }}
          >
            Sign in
          </Button>
          <Typography
            variant="body2"
            color="primary"
            align="center"
            sx={{
              mt: 2,
              cursor: "pointer",
              "@media (max-width: 600px)": {
                fontSize: "12px", 
              },
            }}
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
