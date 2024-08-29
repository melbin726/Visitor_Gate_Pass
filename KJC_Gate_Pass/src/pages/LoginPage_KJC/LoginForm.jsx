import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useWindowSize from "../../hooks/useWindowSize";
import eyeClosed from "../../assets/eye_Hide.svg";
import eyeOpened from "../../assets/eye_Show.svg";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper.js";
import ForgotPasswordForm from "./ForgotPasswordForm"; // Import the ForgotPasswordForm component

function LoginForm() {
  const { width, height } = useWindowSize();
  const [showPassword, setShowPassword] = useState(false);
  const [text, setText] = useState("Show");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for forgot password
  const navigate = useNavigate();
  const API_URL = API_BASE_URL;

  useEffect(() => {
    document.title = `Login: ${width} x ${height}`;
  }, [width, height]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setText((prevText) => (prevText === "Show" ? "Hide" : "Show"));
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
        console.log(result);

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
    setShowForgotPassword(true); // Show the forgot password form
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false); // Go back to the login form
  };

  return (
    <>
      {!showForgotPassword ? ( // Conditionally render the login form or forgot password form
        <div className="loginForm">
          <div className="textInput">
            <label className="textPara" htmlFor="emailText">
              Email
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
          <div className="textInput">
            <div className="textHide">
              <label className="textPara" htmlFor="passwordText">
                Password
              </label>
              <div onClick={togglePasswordVisibility}>
                <img
                  src={showPassword ? eyeOpened : eyeClosed}
                  alt="Toggleable"
                />
                <p className="textState">{text}</p>
              </div>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              id="passwordText"
              className="inputsB"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button" onClick={handleLogin}>
            Log in
          </button>
          <Link to="#" className="forgetPwd" onClick={handleForgotPassword}>
            <h3>Forgot your password?</h3>
          </Link>{" "}
          {/* Use Link instead of button */}
        </div>
      ) : (
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
      )}
      <ToastContainer />
    </>
  );
}

export default LoginForm;
