import React, { useState } from "react";
import "./ForgotPassword.scss";
import { Box, Container, Typography, TextField } from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import MessageModal from "../../common/MessageModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const buttonRef = React.useRef(null);
  const sendForgetPasswordRequest = async () => {
    if (!email) {
      setIsErrorModal(true);
      setMsg("Email field may not be blank..");
      return;
    }
    setIsLoading(true);
    await axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/password_reset/request/`,
        {
          email: email,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setIsSuccessModal(true);
        setEmail("");
        setMsg("A password reset link has been sent to your registered email.");
      })
      .catch((err) => {
        // Request encountered an error, handle the error
        if (err.response) {
          if (err.response.status === 400) {
            // Handle 400 Bad Request errors
            setMsg(err.response?.data?.message[0]?.errors[0]);
          } else {
            // Handle other errors
            console.log(err);
            setMsg("An error occurred. Please try again.");
          }
        } else {
          // Handle network or request-related errors
          console.log(err);
          setMsg("Network or request error. Please try again.");
        }
        setIsErrorModal(true);
        setIsLoading(false);
        setEmail("");
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      sendForgetPasswordRequest();
    }
  };

  return (
    <>
      <Box className="forgot-password-wrapper">
        <Box className="forgot-password-screen-top-logo">
          <Logo
            onClick={() => {
              navigate("/");
            }}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Container
          className="forgot-password-screen-container"
          maxWidth="md"
          sx={{ backgroundColor: "white" }}
        >
          <Box className="forgot-password-form-wrapper">
            <Typography
              className="forgot-password-heading"
              variant="h4"
              color="initial"
            >
              Forgot Password
            </Typography>

            <Typography
              variant="body1"
              className="forgot-password-para"
              color="initial"
              my={2}
            >
              Please enter your registered email address to receive a password
              reset link
            </Typography>

            <Box mt={3}>
              <Typography mb={1} variant="body1" color="initial">
                Email
              </Typography>
              <TextField
                className="forgot-password-form-input"
                id="outlined-basic"
                placeholder="Enter registered email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label=""
                variant="outlined"
                size="small"
                fullWidth
                onKeyDown={handleKeyDown}
              />
            </Box>

            <Box mt={3}>
              <LoadingButton
                ref={buttonRef}
                loading={isLoading}
                className={isLoading ? "" : "forgot-password-form-button"}
                variant="contained"
                size="medium"
                fullWidth
                onClick={() => {
                  sendForgetPasswordRequest();
                }}
              >
                Confirm
              </LoadingButton>
            </Box>
          </Box>
        </Container>
      </Box>
      <MessageModal
        open={isErrorModal}
        title="Error"
        content={msg}
        onClose={setIsErrorModal}
      />
      <MessageModal
        open={isSuccessModal}
        title="Success"
        content={msg}
        onClose={setIsSuccessModal}
      />
    </>
  );
};

export default ForgotPassword;
