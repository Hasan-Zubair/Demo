import React, { useState, useEffect } from "react";
import "./TokenVerification.scss";
import { Box, Container, Typography } from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import { useNavigate } from "react-router-dom";
import MessageModal from "../../common/MessageModal";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
const TokenVerification = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const activateLawyerAccount = async (token) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/register/lawyer/activate/`,
        {
          token: token,
        }
      );
      // Request was successful, handle success
      navigate("/login");
      setIsLoading(false);
    } catch (error) {
      // Request encountered an error, handle the error
      setIsErrorModal(true);
      setIsLoading(false);

      // Set the error message in the component state
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred.");
      }
    }
  };
  const activateClientAccount = (token) => {
    navigate(`/create-new-password/?token=${token}`);
    setIsLoading(false);
  };

  const passwordReset = (token) => {
    navigate(`/create-new-password/?token=${token}&passwordReset=true`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const type = params.get("type");

    if (type === "lawyer") {
      activateLawyerAccount(token);
    } else if (type === "client") {
      activateClientAccount(token);
    } else {
      passwordReset(token);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box className="token-verification-wrapper">
        <Box className="token-verification-screen-top-logo">
          <Logo />
        </Box>
        <Container
          className="token-verification-screen-container"
          maxWidth="md"
          sx={{ backgroundColor: "white" }}
        >
          {isLoading ? (
            <Box className="token-verification-form-wrapper">
              <Typography
                className="token-verification-heading"
                variant="h4"
                color="initial"
              >
                Verifying....
              </Typography>

              <Typography
                variant="body1"
                className="token-verification-para"
                color="initial"
                my={2}
              >
                Please wait. Your Account is activating...
              </Typography>
              <Box className="verification-loader">
                <CircularProgress />
              </Box>
            </Box>
          ) : (
            isErrorModal && (
              <Box className="token-verification-form-wrapper">
                <Typography
                  className="token-verification-heading"
                  variant="h4"
                  color="initial"
                >
                  Something went Wrong.
                </Typography>
              </Box>
            )
          )}
        </Container>
      </Box>
      <MessageModal
        isErrorModal={isErrorModal}
        setIsErrorModal={setIsErrorModal}
        error
        content={errorMessage}
      />
    </>
  );
};

export default TokenVerification;
