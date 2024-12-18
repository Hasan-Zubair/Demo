import React, { useCallback, useState } from "react";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { ReactComponent as GoogleIcon } from "../../assets/google-icon.svg";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import { ReactComponent as AppleIcon } from "../../assets/apple-icon.svg";
import MessageModal from "../../common/MessageModal";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import "./Signup.scss";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [googleLoading, setgoogleLoading] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isEmailExistModal, setIsEmailExistModal] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [cpassword, setCpassword] = useState("");
  const [isCpasswordError, setIsCpasswordError] = useState(false);
  const [googledata, setgoogledata] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [appleToken, setAppleToken] = useState("");

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await axios
        .post(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/google/register/`,
          {
            access_token: codeResponse.access_token,
            user_type: "lawyer",
          }
        )
        .then((res) => {
          setIsLoadingBtn(false);
          localStorage.setItem("token", res.data.data.access);
          localStorage.setItem("LoggedInObj", JSON.stringify(res.data.data));
          localStorage.setItem("user_name", res.data.data.name);
          if (res.data.data.type === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        })
        .catch(async (err) => {
          if (err.response && err.response.status === 400) {
            // Handle 400 errors
            console.log("Client Error: " + err.response.data.message);
            setErrorMessage(
              err?.response?.data?.message.errors
                ? err?.response?.data?.message.errors[0]
                : "Invalid input. Please check your data."
            );
          } else {
            // Handle other errors
            console.log("Error: " + err.response.data.message);
            setErrorMessage(
              err?.response?.data?.message.errors
                ? err?.response?.data?.message.errors[0]
                : "Something Went Wrong"
            );
          }

          setIsErrorModal(true);
          setIsLoadingBtn(false);
        });
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkValidations();
    }
  };

  const submitData = async () => {
    if (email && isValidEmail(email) && password) {
      setIsLoadingBtn(true);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/register/lawyer/`,
          {
            email: email,
            password: password,
            confirm_password: cpassword,
          }
        )
        .then((res) => {
          setIsLoadingBtn(false);
          navigate(`/signup-success/?email=${email}`);
        })
        .catch((error) => {
          console.log("error", error);

          if (error.response && error.response.status === 400) {
            // Handle 400 errors
            const emailErrors = error.response.data.message.email;
            const passwordErrors = error.response.data.message.password;

            let errorMsg = "";

            if (emailErrors && emailErrors.length > 0) {
              errorMsg += emailErrors[0] + "\n";
            }

            if (passwordErrors && passwordErrors.length > 0) {
              errorMsg += passwordErrors[0];
            }

            setErrorMessage(
              errorMsg || "Invalid input. Please check your data."
            );
          } else {
            // Handle other errors
            setErrorMessage("Something Went Wrong");
          }

          setIsErrorModal(true);
          setIsLoadingBtn(false);
        });
    }
  };

  const checkValidations = () => {
    if (!email || !isValidEmail(email)) {
      setIsEmailError(true);
    }

    if (!password || password.length < 8) {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }

    if (!cpassword || cpassword !== password) {
      setIsCpasswordError(true);
    }

    if (
      email &&
      password &&
      cpassword &&
      password === cpassword &&
      isValidEmail(email) &&
      password.length >= 8
    ) {
      submitData();
    }
  };

  const domain_name = `${window.location.protocol}//${window.location.hostname}/`;
  const appleResponse = (response) => {
    console.log("Apple Sign-In callback called");
    console.log("response: ", response);
    if (!response.error) {
      axios
        .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/apple-register/`, {
          response_code: response.authorization.code,
          user_type: "lawyer",
        })
        .then((res) => {
          setIsLoadingBtn(false);
          localStorage.setItem("token", res.data.access);
          localStorage.setItem("LoggedInObj", JSON.stringify(res.data.data));
          localStorage.setItem("user_name", res.data.data.name);
          if (res.data.data.type === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        })
        .catch(async (err) => {
          // console.log("<<<<<<<<<<<<<<::: ", err)
          if (err.response && err.response.status === 400) {
            // Handle 400 errors
            console.log("Client Error: " + err.response.data.message);
            setErrorMessage(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Invalid input. Please check your data."
            );
          } else {
            // Handle other errors
            console.log("Error: " + err.response.data.message);
            setErrorMessage(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Something Went Wrong"
            );
          }

          setIsErrorModal(true);
          setIsLoadingBtn(false);
        });
    }
  };

  return (
    <Box className="signup-wrapper">
      {console.log("Rendering errorMessage:", errorMessage)}
      <Box className="signup-screen-top-logo">
        <Logo onClick={() => navigate("/")} style={{ cursor: "pointer" }} />
      </Box>
      <Container
        className="signup-screen-container"
        maxWidth="md"
        sx={{ backgroundColor: "white" }}
      >
        <Box className="signup-form-wrapper">
          <Typography className="signup-heading" variant="h4" color="initial">
            Welcome to Vera
          </Typography>
          <Box mt={3}>
            <Typography mb={1} variant="body1" color="initial">
              Email
            </Typography>
            <TextField
              className="signup-form-input"
              id="outlined-basic"
              label=""
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailError(false);
              }}
              onKeyDown={handleKeyDown}
              error={isEmailError}
              helperText={isEmailError ? "Please enter a valid email" : ""}
              placeholder="Enter your email"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box mt={3}>
            <Typography mb={1} variant="body1" color="initial">
              Password
            </Typography>
            <TextField
              className="signup-form-input"
              id="outlined-basic"
              label=""
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordError(false);
              }}
              onKeyDown={handleKeyDown}
              error={isPasswordError}
              helperText={
                isPasswordError ? "Please enter a valid password" : ""
              }
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
          <Box mt={3}>
            <Typography mb={1} variant="body1" color="initial">
              Confirm Password
            </Typography>
            <TextField
              className="signup-form-input"
              id="outlined-basic"
              label=""
              type="password"
              placeholder="Confirm your password"
              error={isCpasswordError}
              helperText={
                isCpasswordError
                  ? "Password and confirm password must match"
                  : ""
              }
              variant="outlined"
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
                setIsCpasswordError(false);
              }}
              onKeyDown={handleKeyDown}
              size="small"
              fullWidth
            />
          </Box>
          <Box mt={3}>
            <Button
              className="signup-form-button"
              variant="contained"
              onClick={() => {
                checkValidations();
              }}
              size="medium"
              fullWidth
            >
              Sign up
            </Button>
          </Box>
          <Box mt={3}>
            <Button
              onClick={() => googleLogin()}
              className="google-signup-button"
              variant="contained"
              size="medium"
              fullWidth
            >
              <GoogleIcon /> &nbsp; Sign Up with Google
            </Button>
          </Box>

          <Box mt={3}>
            <AppleLogin
              clientId="vera.veralegal.uk"
              redirectURI={domain_name}
              usePopup={true}
              callback={appleResponse}
              scope="email name"
              responseMode="query"
              responseType={"id_token"}
              render={(renderProps) => (
                <Button
                  className="google-signup-button"
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={renderProps.onClick}
                >
                  <AppleIcon /> &nbsp; Sign Up with Apple
                </Button>
              )}
            />
          </Box>

          <Typography
            variant="body1"
            my={2}
            className="last-text"
            color="initial"
          >
            Do you already have an account?{" "}
            <span
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign in
            </span>
          </Typography>
        </Box>

        <MessageModal
          open={isErrorModal}
          onClose={setIsErrorModal}
          title="Error"
          error
          content={errorMessage}
        />

        <MessageModal
          open={isEmailExistModal}
          onClose={setIsEmailExistModal}
          title="Error"
          error
          content={errorMessage}
        />
      </Container>
    </Box>
  );
};

export default Signup;
