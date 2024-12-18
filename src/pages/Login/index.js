import React, { useEffect, useState } from "react";
import "./Login.scss";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Checkbox,
} from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import { ReactComponent as GoogleIcon } from "../../assets/google-icon.svg";
import { ReactComponent as AppleIcon } from "../../assets/apple-icon.svg";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import MessageModal from "../../common/MessageModal";
import { LoadingButton } from "@mui/lab";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import AppleLogin from "react-apple-login";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      checkValidations();
      submitData();
    }
  };

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const checkValidations = () => {
    if (!email || !isValidEmail(email)) {
      setIsEmailError(true);
    }

    if (!password) {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await axios
        .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/google/login/`, {
          access_token: codeResponse.access_token,
        })
        .then((res) => {
          setIsLoadingBtn(false);
          localStorage.setItem("token", res.data.data.access);
          localStorage.setItem("LoggedInObj", JSON.stringify(res.data.data));
          localStorage.setItem("user_name", res.data.data.name);
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }
          if (res.data.data.type === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          console.log("TCL: Login -> err", err);
          if (err.response && err.response.status === 400) {
            // Handle 400 errors
            setErrorMessage(
              err?.response?.data?.message.errors
                ? err?.response?.data?.message.errors[0]
                : "Invalid input. Please check your data."
            );
          } else {
            // Handle other errors
            setErrorMessage("An error occurred. Please try again later.");
          }

          // Display the error modal
          setIsErrorModal(true);
          setIsLoadingBtn(false);
        });
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  // const logout = () => {
  //   localStorage.removeItem("LoggedInObj");
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  const submitData = async () => {
    if (email && isValidEmail(email) && password) {
      setIsLoadingBtn(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/login/`,
          {
            email: email,
            password: password,
            // remember_me: rememberMe
          }
        );

        setIsLoadingBtn(false);

        const responseData = response.data.data;
        // const intervalInMilliseconds = 180 * 24 * 60 * 60 * 1000;
        // setInterval(logout, intervalInMilliseconds);

        localStorage.setItem("token", responseData.access);
        localStorage.setItem("LoggedInObj", JSON.stringify(responseData));
        localStorage.setItem("user_name", responseData.name);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        if (responseData.type === "admin") {
          navigate("/admin/dashboard");
        } else if (responseData.type === "lawyer") {
          navigate("/dashboard/lawyer");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Something Went Wrong"
        );
        setIsErrorModal(true);
        setIsLoadingBtn(false);
      }
    }
  };

  useEffect(() => {
    const isLoggedInObj = localStorage.getItem("LoggedInObj");
    const rememberMeChoice = localStorage.getItem("rememberMe");

    if (isLoggedInObj) {
      if (rememberMeChoice === "true") {
        const userObj = JSON.parse(isLoggedInObj);
        if (userObj.type === "admin") {
          navigate("/admin/dashboard");
        } else if (userObj.type === "lawyer") {
          navigate("/dashboard/lawyer");
        } else {
          navigate("/dashboard");
        }
      } else {
        localStorage.clear();
      }
    }
  }, [navigate]);

  const domain_name = `${window.location.protocol}//${window.location.hostname}/`;
  const appleResponse = (response) => {
    console.log("Apple Sign-In callback called");
    console.log("response: ", response);
    if (!response.error) {
      axios
        .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/apple-login/`, {
          response_code: response.authorization.code,
        })
        .then((res) => {
          setIsLoadingBtn(false);

          localStorage.setItem("token", res.data.access);
          localStorage.setItem("LoggedInObj", JSON.stringify(res.data.data));
          localStorage.setItem("user_name", res.data.data.name);
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }
          if (res.data.data.type === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            // Handle 400 errors
            setErrorMessage(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Invalid input. Please check your data."
            );
          } else {
            // Handle other errors
            setErrorMessage(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "An error occurred. Please try again later."
            );
          }

          // Display the error modal
          setIsErrorModal(true);
          setIsLoadingBtn(false);
        });
    }
  };

  return (
    <>
      <Box className="login-wrapper">
        <Box className="login-screen-top-logo">
          <Logo onClick={() => navigate("/")} style={{ cursor: "pointer" }} />
        </Box>
        <Container
          className="login-screen-container"
          maxWidth="md"
          sx={{ backgroundColor: "white" }}
          onKeyDown={handleKeyDown}
        >
          <Box className="login-form-wrapper">
            <Typography className="login-heading" variant="h4" color="initial">
              Sign in
            </Typography>
            <Typography
              my={2}
              variant="body1"
              className="login-para"
              color="initial"
            >
              Welcome back! Please enter your details.
            </Typography>

            <Box mt={3}>
              <Typography mb={1} variant="body1" color="initial">
                Email
              </Typography>
              <TextField
                className="login-form-input"
                id="outlined-basic"
                label=""
                value={email}
                error={isEmailError}
                helperText={isEmailError ? "Please enter valid email" : ""}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailError(false);
                }}
                variant="outlined"
                size="small"
                placeholder="Enter your email"
                fullWidth
              />
            </Box>

            <Box mt={3}>
              <Typography mb={1} variant="body1" color="initial">
                Password
              </Typography>
              <OutlinedInput
                className="login-form-input"
                id="outlined-basic"
                label=""
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsPasswordError(false);
                }}
                error={isPasswordError}
                helperText={
                  isPasswordError ? "Please enter valid password" : ""
                }
                variant="outlined"
                placeholder="Enter your password"
                size="small"
                fullWidth
              />
              <Box mt={1} display="flex" alignItems="center">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  style={{ marginLeft: "-9px" }}
                />
                <Typography variant="body1" color="initial">
                  Remember Me
                </Typography>
              </Box>
            </Box>

            <Box mt={4}>
              <LoadingButton
                className={isLoadingBtn ? "" : "login-form-button"}
                variant="contained"
                size="medium"
                loading={isLoadingBtn}
                onClick={() => {
                  checkValidations();
                  submitData();
                }}
                fullWidth
              >
                Sign in
              </LoadingButton>
            </Box>

            <Box mt={3}>
              <Button
                onClick={() => googleLogin()}
                className="google-login-button"
                variant="contained"
                size="medium"
                fullWidth
              >
                <GoogleIcon /> &nbsp; Sign in with Google
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
                    <AppleIcon /> &nbsp; Sign In with Apple
                  </Button>
                )}
              />
            </Box>

            <Typography
              variant="body1"
              className="forgot-pass-text"
              color="initial"
              onClick={() => {
                navigate("/forgot-password");
              }}
              sx={{ cursor: "pointer" }}
            >
              Forgot Password
            </Typography>
          </Box>
        </Container>
      </Box>
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        error
        content={errorMessage}
      />
    </>
  );
};

export default Login;
