import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper.js";

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const sendOtp = (event) => {
    event.preventDefault();
    if (email === "") {
      toast.error("Email is required");
      return;
    } else {
      axios
        .post(`${API_BASE_URL}/send-otp`, { email })
        .then((response) => {
          toast.success("OTP sent to your email");
          setOtpSent(true);
        })
        .catch((err) => {
          toast.error("Enter correct E-mail address");
          console.error(err);
        });
    }
  };

  const verifyOtp = (event) => {
    event.preventDefault();

    axios
      .post(`${API_BASE_URL}/verify-otp`, { email, otp })
      .then((response) => {
        toast.success("OTP verified successfully");
        setOtpVerified(true);
      })
      .catch((err) => {
        toast.error("Invalid OTP");
        console.error(err);
      });
  };

  const changePassword = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    axios
      .post(`${API_BASE_URL}/change-password`, { email, newPassword })
      .then((response) => {
        toast.success("Password changed successfully");
        onBackToLogin();
      })
      .catch((err) => {
        toast.error("Failed to change password");
        console.error(err);
      });
  };

  return (
    <div className="loginForm">
      {!otpSent ? (
        <>
          <div className="textInput">
            <label className="textPara" htmlFor="emailText">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              id="emailText"
              className="inputsB"
              placeholder="Enter your email"
            />
          </div>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              type="button"
              color="primary"
              onClick={sendOtp}
            >
              Send OTP
            </Button>
          </Stack>
        </>
      ) : !otpVerified ? (
        <>
          <label htmlFor="otpText">
            <h3>Enter the OTP :</h3>
          </label>
          <MuiOtpInput
            name="otpText"
            value={otp}
            onChange={handleOtpChange}
            length={5}
          />
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              type="button"
              color="primary"
              onClick={verifyOtp}
            >
              Verify OTP
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <div className="textInput">
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              id="newPassword"
              className="inputsB"
              placeholder="Enter new password"
            />
          </div>
          <div className="textInput">
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              id="confirmPassword"
              className="inputsB"
              placeholder="Confirm new password"
            />
          </div>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              type="button"
              color="primary"
              onClick={changePassword}
            >
              Change Password
            </Button>
          </Stack>
        </>
      )}
      <Stack spacing={2} direction="row">
        <Button color="primary" onClick={onBackToLogin}>
          Back to Login
        </Button>
      </Stack>
    </div>
  );
};

export default ForgotPasswordForm;
