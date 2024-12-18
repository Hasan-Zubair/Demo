import React, { useState, useEffect } from "react";
import "./SignupSuccess.scss";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import MessageModal from "../../common/MessageModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupSuccess = () => {
  const navigate = useNavigate();
  const [isSuccessModal, setIsSuccessModal] = useState(true);
  const [isEmailSentAgain, setIsEmailSentAgain] = useState(false);
  const [email, setEmail] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);
  const sendMail = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/register/lawyer/email_resend/`,
        {
          email: email,
        },
      )
      .then((res) => {
        setIsEmailSentAgain(true);
      })
      .catch((err) => {
        setIsErrorModal(true);
        console.error("Error:", err);
        if (err.response) {
          console.error("Status Code:", err.response.status);
          console.error("Error Data:", err.response.data);
        }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    setEmail(email);
  }, []);

  return (
    <>
      <Box className="signupSuccess-wrapper">
        <Box className="signupSuccess-screen-top-logo">
          <Logo />
        </Box>
        <Container
          className="signupSuccess-screen-container"
          maxWidth="md"
          sx={{ backgroundColor: "white" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography
                my={3}
                variant="h4"
                fontFamily="Tomato Grotesk"
                fontWeight="bold"
                color="#006766"
                textAlign="center"
              >
                Congratulations! Your Account is Created Successfully.
              </Typography>

              <Typography
                variant="body1"
                color="initial"
                my={2}
                className="signup-success-page-icon-img-wrapper"
              >
                We have sent you the email with the link to activate your
                account. Didn't receive the email?{" "}
                <span onClick={() => sendMail()}>Resent it</span>
              </Typography>

              <Box display="flex" justifyContent="center" mt={5}>
                <Button
                  variant="contained"
                  className="event-booked-btn"
                  color="primary"
                  onClick={() => navigate("/")}
                >
                  Go to Homepage
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <MessageModal
        open={isSuccessModal}
        onClose={setIsSuccessModal}
        title="Account Created"
        content="Account Created Successfully."
      />
      <MessageModal
        open={isEmailSentAgain}
        onClose={setIsEmailSentAgain}
        title="Email Sent"
        content="Email Sent Successfully."
      />
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        error
        content="Something went wrong. Please try again later."
      />
    </>
  );
};

export default SignupSuccess;
