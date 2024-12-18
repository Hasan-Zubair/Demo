import React, { useState, useEffect } from "react";
import "./CreateNewPassword.scss";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import MessageModal from "../../common/MessageModal";
import { LoadingButton } from "@mui/lab";
import { useGoogleLogin } from "@react-oauth/google";
import { ReactComponent as GoogleIcon } from "../../assets/google-icon.svg";
import { ReactComponent as AppleIcon } from "../../assets/apple-icon.svg";
import AppleLogin from "react-apple-login";

import axios from "axios";

import { useNavigate } from "react-router-dom";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [token, setToken] = useState("");
  const [passwordReset, setPasswordReset] = useState(null);
  const [isCpasswordError, setIsCpasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const submitData = async () => {
    if (!passwordReset) {
      if (password && cpassword && password === cpassword) {
        setIsBtnLoading(true);
        await axios
          .post(
            `${process.env.REACT_APP_BASE_API_URL}api/auth/register/client/activate/`,
            {
              confirm_password: cpassword,
              password: password,
              token: token,
            }
          )
          .then((res) => {
            window.localStorage.setItem("token", token);
            localStorage.setItem("LoggedInObj", JSON.stringify(res.data.data));
            if (rememberMe) {
              localStorage.setItem("rememberMe", "true");
            } else {
              localStorage.removeItem("rememberMe");
            }
            setIsBtnLoading(false);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          })
          .catch(() => {
            setIsErrorModal(true);
            setIsBtnLoading(false);
          });
      } else {
        if (!password) {
          setIsPasswordError(true);
        }
        if (!cpassword) {
          setIsCpasswordError(true);
        }
        if (password !== cpassword) {
          setIsCpasswordError(true);
        }
      }
    } else {
      if (password && cpassword && password === cpassword) {
        setIsBtnLoading(true);
        await axios
          .post(
            `${process.env.REACT_APP_BASE_API_URL}api/auth/register/client/activate/`,
            {
              confirm_password: cpassword,
              password: password,
              token: token,
            }
          )
          .then(() => {
            setIsBtnLoading(false);
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          })
          .catch(() => {
            setIsErrorModal(true);
            setIsBtnLoading(false);
          });
      } else {
        if (!password) {
          setIsPasswordError(true);
        }
        if (!cpassword) {
          setIsCpasswordError(true);
        }
        if (password !== cpassword) {
          setIsCpasswordError(true);
        }
      }
    }
  };

  const getEmail = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const passwordReset = params.get("passwordReset");
    setPasswordReset(passwordReset);
    setToken(token);
    if (!passwordReset) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/register/check/?token=${token}`
        );

        setEmail(response.data.data.email);
        localStorage.setItem("rememberMe", "true");
        // localStorage.removeItem("rememberMe"); // You can choose to include or remove this line
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            // Handle 400 Bad Request error
            setErrorMessage("Bad Request: " + error.response.data.message);
          } else {
            // Handle other HTTP errors
            setErrorMessage(
              error.response.data.message ||
                "An error occurred. Please try again."
            );
          }
        } else {
          // Handle network or request-related errors
          setErrorMessage("Network or request error. Please try again.");
        }

        setOpenErrorModal(true);
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/google/register/`,
          {
            access_token: codeResponse.access_token,
            user_type: "client",
            token: token,
          }
        )
        .then((res) => {
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
          console.log("Error: " + err.response.data.message);
          setErrorMessage(
            err?.response?.data?.message?.errors
              ? err?.response?.data?.message?.errors[0]
              : "Something Went Wrong"
          );
          setOpenErrorModal(true);
        });
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  useEffect(() => {
    getEmail();
  }, []);

  const domain_name = `${window.location.protocol}//${window.location.hostname}/`;
  // \

  const appleResponse = (response) => {
    console.log("Apple Sign-In callback called");
    console.log("response: ", response);
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!response.error) {
      axios
        .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/apple-register/`, {
          response_code: response.authorization.code,
          user_type: "client",
          token: token,
        })
        .then((res) => {
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
        });
    }
  };

  return (
    <>
      <Box className="createNewPassword-wrapper">
        <Box className="createNewPassword-screen-top-logo">
          <Logo />
        </Box>
        <Container
          className="createNewPassword-screen-container"
          maxWidth="md"
          sx={{ backgroundColor: "white" }}
        >
          <Box className="createNewPassword-form-wrapper">
            <Typography
              className="createNewPassword-heading"
              variant="h4"
              color="initial"
            >
              Create a New Password
            </Typography>
            {!passwordReset && (
              <Box mt={3}>
                <Typography mb={1} variant="body1" color="initial">
                  Email
                </Typography>
                <TextField
                  className="createNewPassword-input-email-disabled"
                  id="outlined-basic"
                  label=""
                  value={email}
                  disabled
                  placeholder="Enter your email"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Box>
            )}

            <Box mt={3}>
              <Typography mb={1} variant="body1" color="initial">
                Password
              </Typography>
              <TextField
                className="createNewPassword-form-input"
                id="outlined-basic"
                label=""
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsPasswordError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitData();
                  }
                }}
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
                className="createNewPassword-form-input"
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitData();
                  }
                }}
                size="small"
                fullWidth
              />
            </Box>
            <Box mt={3}>
              <LoadingButton
                className={isBtnLoading ? "" : "createNewPassword-form-button"}
                variant="contained"
                loading={isBtnLoading}
                onClick={() => {
                  submitData();
                }}
                size="medium"
                fullWidth
              >
                {passwordReset ? "Reset Password" : "Create Account"}
              </LoadingButton>
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
                // redirectURI="https://virtually-keen-seasnail.ngrok-free.app/"
                redirectURI={domain_name}
                usePopup={true}
                callback={appleResponse} // Catch the response
                scope="email name"
                responseMode="query"
                responseType={"id_token"}
                render={(
                  renderProps //Custom Apple sign in Button
                ) => (
                  <Button
                    className="google-signup-button"
                    variant="contained"
                    size="medium"
                    fullWidth
                    onClick={renderProps.onClick}
                  >
                    <AppleIcon /> &nbsp; Continue with Apple
                  </Button>
                )}
              />
            </Box>

          </Box>
        </Container>
      </Box>
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        content="Something went wrong. Please try again later."
        error
      />
      <MessageModal
        open={openErrorModal}
        onClose={setOpenErrorModal}
        title="Error"
        content={errorMessage}
        error
      />
    </>
  );
};

export default CreateNewPassword;
