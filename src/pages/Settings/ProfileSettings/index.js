import React, { useState, useEffect } from "react";
import styles from "./ProfileSettings.scss";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Avatar,
  InputAdornment,
  Autocomplete,
  Stack,
  createTheme,
  ThemeProvider,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import VeraButton from "./../../../components/VeraButton";
import InputMask from "react-input-mask";
import ukflag from "./../../../assets/uk-flag.png";
import MessageModal from "../../../common/MessageModal";
import axios from "axios";
import { postalCodesUK } from "../../../common/PostalCodesUK";
import { Container } from "@mui/system";
import PhoneVerification from "../../../components/OnBoardingScreen/PhoneVerification";
import tickIcon from "../../../assets/icons/tickIcon.svg";
import crossIcon from "../../../assets/icons/crossIcon.svg";

const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const inputRef = React.useRef(null);
  const [message, setMessage] = useState({});
  const [isModal, SetIsModal] = useState(false);
  const [countdownInProgress, setCountdownInProgress] = useState(false);
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [phone, setPhone] = useState("");
  const [progress, setProgress] = useState(0);

  const updateMessage = [
    {
      description: "Profile Updated Successfully",
      title: "Profile Updated",
    },
    {
      title: "Verification",
      description: "Verification code sent",
    },
    {
      title: "Error",
      description: "Please Wait One Minute Before Resending Code",
    },
    {
      title: "Error",
      description: "Verification code sent failed!",
    },
  ];
  const phoneNumber = phone.replace(/\s/g, "");

  const sendOTP = () => {
    setProgress(0);

    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/send-otp/`, {
        phone: phoneNumber,
      })
      .then((response) => {
        setMessage(updateMessage[1]);
        setIsSuccessModal(true);
        SetIsModal(true);
      })
      .catch((error) => {
        if (error.detail === 'Method "GET" not allowed.') {
          setMessage(updateMessage[2]);
        }
        setMessage(updateMessage[3]);

        setIsSuccessModal(true);
      });
    setCountdownInProgress(true);

    // Start the countdown
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 1
      );
    }, 1000);

    // Clear the countdown timer after 60 seconds
    setTimeout(() => {
      clearInterval(timer);
      setCountdownInProgress(false);
    }, 100000);
  };

  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "green",
            },
          },
        },
      },
    },
  });

  const uploadMessage = {
    description: "Image Type is Invalid",
    title: "Image Upload",
  };
  const getUserDetails = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/user/${
          JSON.parse(localStorage.getItem("LoggedInObj")).id
        }/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
        setPhoneNo(res.data.mobile);
        setImage(res.data.image);
        setPostalCode(res.data.zip_code === null ? "" : res.data.zip_code);
        localStorage.setItem("user_name", res.data.name);
        // getTasksData(caseID);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const updateUser = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", phoneNo);
    formData.append("zip_code", postalCode);
    if (file) {
      formData.append("image", file);
    }

    await axios
      .put(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/user/${
          JSON.parse(localStorage.getItem("LoggedInObj")).id
        }/`,
        formData,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setIsSuccessModal(true);
        getUserDetails();
        setMessage(updateMessage[0]);
      })
      .catch((err) => {});
  };

  function CircularProgressWithLabel(props) {
    const totalSeconds = 60;
    const remainingSeconds = totalSeconds - Math.round(props.value);

    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${remainingSeconds}`}
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleChange = function (e) {
    console.log("e.target.files", e.target.files);
    e.preventDefault();
    if (
      e.target.files &&
      e.target.files[0] &&
      allowedFileTypes.includes(e.target.files[0].type)
    ) {
      // handleFiles(e.target.files);
      setImage(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    } else {
      setIsSuccessModal(true);
      setMessage(uploadMessage);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  // const postalCodesUK = ["SW1A 1AA", "EC2M 7PY"];

  const [postalCodeSuggestions, setPostalCodeSuggestions] = useState([]);

  const handlePostalCodeChange = (value) => {
    setPostalCode(value);
    setPostalCodeSuggestions(getPostalCodeSuggestions(value));
  };

  const getPostalCodeSuggestions = (value) => {
    const inputValue = value.trim().toUpperCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : postalCodesUK.filter((code) =>
          code.toUpperCase().startsWith(inputValue)
        );
  };

  return (
    <>
      <Grid container spacing={2} className="profile-setting-wrapper">
        <Grid item md={6}>
          <Box mt={4} className="upload-img">
            <input
              ref={inputRef}
              className="input-file-upload"
              type="file"
              id="input-file-upload"
              multiple={true}
              onChange={handleChange}
            />
            <Avatar
              src={!imageUrl ? image : imageUrl}
              style={{ cursor: "pointer" }}
              onClick={onButtonClick}
            />
            <VeraButton
              style={{
                margin: "25px 0px",
                width: "fit-content",
              }}
              onClick={onButtonClick}
            >
              Upload Image
            </VeraButton>
          </Box>
          <Box mt={2}>
            <Typography variant="body1" color="initial">
              Name
            </Typography>
            <TextField
              fullWidth
              id="outlined-basic"
              label=""
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </Box>
          <Box my={4}>
            <Typography variant="body1" color="initial">
              Email
            </Typography>
            <TextField
              fullWidth
              id="outlined-basic"
              label=""
              disabled
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
          </Box>

          <Box mt={3}>
            <Typography variant="body1" color="initial">
              Phone
            </Typography>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <InputMask
                mask="+99 999 9999999"
                maskChar=""
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                disabled={countdownInProgress || phoneVerify}
                placeholder="+44 1234 56789"
                value={phone}
                style={{ flex: 1, marginRight: "10px" }}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img
                            src={ukflag}
                            style={{ height: "19px" }}
                            alt="flag"
                          />
                        </InputAdornment>
                      ),
                      endAdornment:
                        countdownInProgress || phoneVerify ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setCountdownInProgress(false);
                                setPhoneVerify(false);
                              }}
                            >
                              <img src={crossIcon} alt="Cross Icon" />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                    }}
                    label=""
                    placeholder="+44 1234 56789"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled={countdownInProgress || phoneVerify}
                  />
                )}
              </InputMask>
              {countdownInProgress ? (
                <>
                  <Button
                    variant="contained"
                    style={{ margin: "0px 7px" }}
                    onClick={() => SetIsModal(true)}
                  >
                    Verify
                  </Button>
                  <CircularProgressWithLabel value={progress} />
                </>
              ) : (
                <>
                  {phoneVerify ? (
                    <img src={tickIcon} alt="Tick Icon" />
                  ) : (
                    <Button
                      variant="contained"
                      disabled={!(phoneNumber.length >= 13)}
                      onClick={() => {
                        if (!phoneVerify) sendOTP();
                      }}
                    >
                      Verify
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>

          <Box my={4}>
            <Typography variant="body1" color="initial">
              Postcode
            </Typography>
            <ThemeProvider theme={theme}>
              <TextField
                id="outlined-basic"
                label=""
                placeholder="Enter your post code"
                fullWidth
                inputProps={{ maxLength: 7 }}
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value);
                }}
                size="small"
                variant="outlined"
              />
            </ThemeProvider>
          </Box>
          <VeraButton variant="contained" onClick={updateUser}>
            Save
          </VeraButton>
        </Grid>
        <Grid item md={6}></Grid>
      </Grid>
      <MessageModal
        open={isSuccessModal}
        onClose={setIsSuccessModal}
        title={message.title}
        content={message.description}
      />
      <PhoneVerification open={isModal} setOpen={SetIsModal} />
    </>
  );
};

export default ProfileSettings;
