import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  StepIcon,
  Autocomplete,
  CircularProgress,
  IconButton,
} from "@mui/material";
import "../components/OnBoardingScreen/OnBoardingScreen.scss";
import InputMask from "react-input-mask";
import InputAdornment from "@mui/material/InputAdornment";
import StepContent from "@mui/material/StepContent";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";

import { ReactComponent as Logo } from "../assets/nav-vera-icon.svg";
import ukflag from "../assets/uk-flag.png";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";

import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import { ReactComponent as AudioBars } from "../assets/audio-bars.svg";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as QuestionnaireIcon } from "../assets/questionnarie-icon.svg";
import { ReactComponent as RecordVoiceIcon } from "../assets/record-voice-option-icon.svg";
import tickIcon from "../assets/icons/tickIcon.svg";
import crossIcon from "../assets/icons/crossIcon.svg";

import Paper from "@mui/material/Paper";
import { postalCodesUK } from "../common/PostalCodesUK";
import { ReactComponent as ListItemIcon } from "../assets/list-item-icon.svg";
import { ReactComponent as Pattern } from "../assets/green-line-pattern.svg";
import { ReactComponent as RightArrow } from "../assets/right-arrow.svg";
import { ReactComponent as VoiceIconGreen } from "../assets/voice-icon-green.svg";
import { ReactComponent as ActiveStepIcon } from "../assets/active-step-icon.svg";
import { ReactComponent as InActiveStepIcon } from "../assets/inactive-step-icon.svg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Calendery from "./Calendery";

import ScheduleEvent from "./ScheduleEvent";
import moment from "moment";
import EventBooked from "./EventBooked";
import MessageModal from "../common/MessageModal";

// component
import Recorder from "../components/Recorder";
import PhoneVerification from "../components/OnBoardingScreen/PhoneVerification";
import axios from "axios";
const OnBoardingScreen = () => {
  const navigate = useNavigate();
  const { screenId } = useParams();
  const [isModal, SetIsModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdownInProgress, setCountdownInProgress] = useState(false);

  const [steps, setSteps] = useState([
    {
      label: "Select how you want to proceed",
      description: ``,
    },
    {
      label: "What do you need help with?",
      description: "",
    },
    {
      label: "Tell us about your case",
      description: ``,
    },
    {
      label: "Let's talk",
      description: ``,
    },
  ]);

  const [activeStep, setActiveStep] = React.useState(0);
  console.log("TCL: OnBoardingScreen -> [activeStep", activeStep);
  const [category, setCategory] = useState(null);
  console.log("TCL: OnBoardingScreen -> [category", category);
  const [screen, setScreen] = useState(0);
  const [isQuestionaire, setIsQuestionaire] = useState(true);
  const [isCalender, setIsCalender] = useState(false);
  const [isScheduleEvent, setIsScheduleEvent] = useState(false);
  const [isEventBooked, setIsEventBooked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [isPostalCodeError, setIsPostalCodeError] = useState(false);
  const [caseDescription, setCaseDescription] = useState("");
  const [isCaseDescriptionError, setIsCaseDescriptionError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const currentDay = moment().format("dddd");
  const isWeekend = currentDay === "Saturday" || currentDay === "Sunday";
  const initialDate = isWeekend
    ? moment().day("Monday").format("YYYY-MM-DD")
    : moment(new Date()).format("YYYY-MM-DD");
  const [eventDate, setEventDate] = useState(initialDate);

  const [eventTime, setEventTime] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  const [googledata, setgoogledata] = useState({});
  const [isFullNameError, setIsFullNameError] = useState(false);

  const [isEventScheduled, setIsEventScheduled] = useState(false);
  const [completeDate, setCompleteDate] = useState(
    moment(new Date()).format("LL")
  );
  const [selectedOption, setSelectedOption] = useState("questionnaire");
  const [completeTime, setCompleteTime] = useState(null);
  const [isNotRecordedAudioModal, setIsNotRecordedAudioModal] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [isDashboard, setIsDashboard] = useState(null);

  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (screen == 20) {
      setSelectedOption("voice-memo");
    }
  }, [screen]);

  console.log(
    "jjj",
    (screen == 1 && category && selectedOption === "questionnaire"
      ? false
      : true) ||
      (screen == 2 && caseDescription && selectedOption === "questionnaire"
        ? false
        : true) ||
      (screen == 5 &&
      fullName &&
      email &&
      (phone ? phoneVerify : true) &&
      selectedOption === "questionnaire"
        ? false
        : true) ||
      (screen == 10 && recordedAudioURL && selectedOption === "voice-memo"
        ? false
        : true) ||
      (screen == 20 &&
      fullName &&
      email &&
      (phone ? phoneVerify : true) &&
      selectedOption === "voice-memo"
        ? false
        : true)
  );

  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "green",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "green",
            },
          },
        },
      },
    },
  });

  console.log(
    "jdfks",
    screen == 1 && category && selectedOption === "questionnaire"
      ? false
      : screen == 2 && caseDescription && selectedOption === "questionnaire"
      ? false
      : screen == 5 &&
        fullName &&
        email &&
        (phone ? phoneVerify : true) &&
        selectedOption === "questionnaire"
      ? false
      : screen == 10 && recordedAudioURL && selectedOption === "voice-memo"
      ? false
      : screen == 20 &&
        fullName &&
        email &&
        (phone ? phoneVerify : true) &&
        selectedOption === "voice-memo"
      ? false
      : true
  );

  const [isVoiceMemoDirect, setIsVoiceMemoDirect] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function isValidPostalCode(postalCode) {
    return /^[a-zA-Z0-9]{5}$/.test(postalCode);
  }

  const handleReset = () => {
    setActiveStep(0);
    setScreen(1);
  };

  const handleVoiceMemoClick = () => {
    setScreen(10);
    navigate(`/onboarding/${10}`);
    setIsVoiceMemoDirect(true);
    setActiveStep(0);
    setSteps([
      {
        label: "Tell us about your case",
        description: "",
      },
      {
        label: "Let's talk",
        description: `Provide details so we can set up a time to talk`,
      },
    ]);
    setSelectedOption("voice-memo");
  };

  const handleQuestionnaireOption = (category) => {
    setSelectedOption("questionnaire");
    if (category) {
      // setCategory(category);
      setScreen(1);
      navigate(`/onboarding/${1}`);
      setActiveStep(1);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const getSelectedOption = params.get("selectedOption");
    const isDasboard = params.get("dashboard");
    if (isDasboard) {
      setIsDashboard(isDasboard);
    }
    if (getSelectedOption === "voice-memo") {
      handleVoiceMemoClick();
    } else {
      handleQuestionnaireOption(category);
    }
  }, []);

  useEffect(() => {
    if (screenId) {
      setScreen(parseInt(screenId));
      if (
        screenId !== 1000 &&
        !isCalender &&
        !isScheduleEvent &&
        !isEventBooked
      )
        setIsQuestionaire(true);
      if (screenId == 10 || screenId == 2 || screenId == 5 || screenId == 20)
        setIsQuestionaire(true);
      if (isEventBooked) {
        if (localStorage.getItem("LoggedInObj")) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } else {
      setScreen(0);
    }
  }, [screenId]);
  function CustomStepIcon(props) {
    const { active, completed, icon } = props;
    return (
      <StepIcon
        icon={
          icon ? (
            active ? (
              <ActiveStepIcon />
            ) : completed ? (
              icon
            ) : (
              <InActiveStepIcon />
            )
          ) : (
            icon
          )
        }
        active={active}
        completed={completed}
      />
    );
  }

  const handleNextButton = () => {
    if (selectedOption === "questionnaire") {
      if (screen === 0) {
        setSteps([
          {
            label: "Select how you want to proceed",
            description: ``,
          },
          {
            label: "What do you need help with?",
            description: "",
          },

          {
            label: "Tell us about your case",
            description: ``,
          },

          {
            label: "Let's talk",
            description: ``,
          },
        ]);
        setScreen(screen + 1);
        navigate(`/onboarding/${screen + 1}`);
        handleNext();
      }
      if (screen < 5) {
        if (screen === 1) {
          if (category) {
            handleNext();
            setScreen(screen + 1);
            navigate(`/onboarding/${screen + 1}`);
          } else {
            setModalContent({
              title: "Category is missing",
              description: "Please select a category to proceed",
            });
            setIsModalOpen(true);
          }
        } else if (screen === 2) {
          if (caseDescription) {
            if (!localStorage.getItem("token")) {
              handleNext();
              setScreen(screen + 3);
              navigate(`/onboarding/${screen + 3}`);
            } else {
              setIsQuestionaire(false);
              setIsCalender(true);
              navigate(`/onboarding/${1000}`);
            }
          } else {
            setIsCaseDescriptionError(true);
          }
        } else {
        }
      } else {
        if (screen === 5) {
          if (fullName && email) {
            if (isValidEmail(email)) {
              setIsQuestionaire(false);
              setIsCalender(true);
              navigate(`/onboarding/${1000}`);
            } else {
              if (!isValidEmail(email)) {
                setIsEmailError(true);
              } else {
                setIsEmailError(false);
              }
              if (!isValidPostalCode(postalCode)) {
                // setIsPostalCodeError(true);
              } else {
                setIsPostalCodeError(false);
              }
            }
            const formData = {
              fullName,
              email,
              phone,
              postalCode,
            };
            localStorage.setItem("formData", JSON.stringify(formData));
          } else {
            if (!fullName) {
              setIsFullNameError(true);
            }
            if (!email) {
              setIsEmailError(true);
            }
            if (!postalCode) {
              // setIsPostalCodeError(true);
            }
          }
        } else if (screen === 3) {
          setScreen(screen - 1);
          navigate(`/onboarding/${screen - 1}`);
          handleNext();
        }
      }
    } else if (selectedOption === "voice-memo") {
      if (!isVoiceMemoDirect) {
        setSteps([
          {
            label: "Tell us about your problem",
            description: "",
          },
          {
            label: "Let's talk",
            description: ``,
          },
        ]);

        if (screen === 0) {
          setSteps([
            {
              label: "Tell us about your problem",
              description: "",
            },
            {
              label: "Let's talk",
              description: ``,
            },
          ]);

          setScreen(screen + 10);
          navigate(`/onboarding/${screen + 10}`);
        } else if (screen === 10) {
          if (recordedAudioURL) {
            if (!localStorage.getItem("token")) {
              setScreen(screen + 10);
              navigate(`/onboarding/${screen + 10}`);
              handleNext();
            } else {
              setIsQuestionaire(false);
              setIsCalender(true);
              navigate(`/onboarding/${1000}`);
            }
          } else {
            setIsNotRecordedAudioModal(true);
          }
        } else {
          if (fullName && email && phone && postalCode) {
            const formData = {
              fullName,
              email,
              phone,
              postalCode,
            };

            localStorage.setItem("formData", JSON.stringify(formData));
            if (isValidEmail(email)) {
              setIsQuestionaire(false);
              setIsCalender(true);
              navigate(`/onboarding/${1000}`);
            } else {
              setIsEmailError(true);
            }
          } else {
            if (!fullName) {
              setIsFullNameError(true);
            }
            if (!email) {
              setIsEmailError(true);
            }

            if (!postalCode) {
              // setIsPostalCodeError(true);
            }
          }
        }
      } else {
        setSteps([
          {
            label: "Your Problem",
            description: "",
          },
          {
            label: "Let's talk",
            description: `Provide details so we can set up a time to talk`,
          },
        ]);

        if (screen === 0) {
          setSteps([
            {
              label: "Tell us about your problem",
              description: "",
            },
            {
              label: "Let's talk",
              description: ``,
            },
          ]);

          setScreen(screen + 10);
          navigate(`/onboarding/${screen + 10}`);
          handleNext();
        } else if (screen === 10) {
          if (recordedAudioURL) {
            setScreen(screen + 10);
            navigate(`/onboarding/${screen + 10}`);
            handleNext();
          } else {
            setIsNotRecordedAudioModal(true);
          }
        } else {
          if (fullName && email) {
            if (isValidEmail(email)) {
              setIsQuestionaire(false);
              setIsCalender(true);
              navigate(`/onboarding/${1000}`);
            } else {
              setIsEmailError(true);
            }
          } else {
            if (!fullName) {
              setIsFullNameError(true);
            }
            if (!email) {
              setIsEmailError(true);
            }
          }
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNextButton();
    }
  };

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

  const calenderBack = () => {
    if (screenId == 1000) {
      if (selectedOption === "voice-memo") {
        if (localStorage.getItem("LoggedInObj")) {
          setScreen(10);
          navigate("/onboarding/10");
        } else {
          setScreen(20);
          navigate("/onboarding/20");
        }
      } else {
        if (localStorage.getItem("LoggedInObj")) {
          setScreen(2);
          navigate(`/onboarding/2`);
        } else {
          setScreen(5);
          navigate("/onboarding/5");
        }
      }
    }
  };

  const phoneNumber = phone.replace(/\s/g, "");

  const sendOTP = () => {
    setProgress(0);

    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/send-otp/`, {
        phone: phoneNumber,
      })
      .then((response) => {
        setModalContent({
          title: "Verification",
          description: "Verification code sent",
        });
        setIsModalOpen(true);
        SetIsModal(true);
      })
      .catch((error) => {
        if (error.detail === 'Method "GET" not allowed.') {
          setModalContent({
            title: "Error",
            description: "Please Wait One Minute Before Resending Code",
          });
        }
        setModalContent({
          title: "Error",
          description: "Verification code sent failed!",
        });
        setIsModalOpen(true);
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

  return (
    <>
      <Box className="onboarding-screen-wrapper">
        {isQuestionaire && (
          <Box className="onboarding-screen-top-logo">
            <Logo
              onClick={() => {
                if (
                  JSON.parse(localStorage.getItem("LoggedInObj"))?.type ===
                  "admin"
                ) {
                  navigate("/admin/dashboard");
                } else if (
                  JSON.parse(localStorage.getItem("LoggedInObj"))?.type ===
                  "lawyer"
                ) {
                  navigate("/dashboard/lawyer");
                } else if (JSON.parse(localStorage.getItem("LoggedInObj"))) {
                  navigate("/dashboard");
                } else {
                  navigate("/");
                }
              }}
            />
          </Box>
        )}

        <Container className="onboarding-screen-container custom-container">
          {isCalender && screen === 1000 && (
            <Calendery
              setIsScheduleEvent={setIsScheduleEvent}
              setIsCalender={setIsCalender}
              setEventDate={setEventDate}
              setEventTime={setEventTime}
              eventDate={eventDate}
              setCompleteTime={setCompleteTime}
              setCompleteDate={setCompleteDate}
              eventTime={eventTime}
              fullName={fullName}
              setFullName={setFullName}
              setIsEventBooked={setIsEventBooked}
              recordedAudioURL={recordedAudioURL}
              setIsQuestionaire={setIsQuestionaire}
              completeTime={completeTime}
              completeDate={completeDate}
              setIsEventScheduled={setIsEventScheduled}
              setEmail={setEmail}
              category={category}
              phone={phone}
              postalCode={postalCode}
              caseDescription={caseDescription}
              email={email}
              calenderBack={calenderBack}
            />
          )}
          {isEventBooked && (
            <EventBooked
              isEventScheduled={isEventScheduled}
              setIsEventScheduled={setIsEventScheduled}
              completeDate={completeDate}
              email={email}
              completeTime={completeTime}
            />
          )}
          {isScheduleEvent && (
            <ScheduleEvent
              fullName={fullName}
              setFullName={setFullName}
              setIsEventBooked={setIsEventBooked}
              setIsScheduleEvent={setIsScheduleEvent}
              completeTime={completeTime}
              eventTime={eventTime}
              eventDate={eventDate}
              completeDate={completeDate}
              setIsEventScheduled={setIsEventScheduled}
              setEmail={setEmail}
              category={category}
              postalCode={postalCode}
              caseDescription={caseDescription}
              email={email}
            />
          )}
          {isQuestionaire && (
            <Box>
              <Box className="pattern">
                <Pattern />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                  <Box className="onboarding-screen-left">
                    <Box sx={{ maxWidth: 400 }}>
                      <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                          <Step key={step.label} className="step-title">
                            <StepLabel
                              className="step-title"
                              StepIconComponent={CustomStepIcon}
                            >
                              {step.label}
                            </StepLabel>
                            <StepContent>
                              <Typography>{step.description}</Typography>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                      {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                          <Typography>
                            All steps completed - you&apos;re finished
                          </Typography>
                          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Reset
                          </Button>
                        </Paper>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                  {screen === 0 && (
                    <Box className="onboarding-screen-right">
                      <Typography
                        variant="h4"
                        className="heading-text"
                        color="initial"
                      >
                        Select how you want to proceed
                      </Typography>

                      <Box mt={4}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Box
                              onClick={() => {
                                setSelectedOption("questionnaire");
                                handleQuestionnaireOption("questionnaire");
                              }}
                              className="questionnaire-option-selected"
                              //   selectedOption === "questionnaire"
                              //     ? "questionnaire-option-selected"
                              //     : "questionnaire-option"
                              // }
                            >
                              <QuestionnaireIcon />
                              <Typography
                                variant="body1"
                                className="option-text"
                                color="initial"
                              >
                                Fill out the questionnaire
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Box
                              onClick={() => {
                                setSelectedOption("voice-memo");
                                handleVoiceMemoClick();
                              }}
                              className="questionnaire-option-selected"
                              // {
                              //   selectedOption === "voice-memo"
                              //     ? "questionnaire-option-selected"
                              //     : "questionnaire-option"
                              // }
                            >
                              <RecordVoiceIcon />
                              <Typography
                                variant="body1"
                                className="option-text"
                                color="initial"
                              >
                                Record a voice memo
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  )}
                  {screen === 10 && (
                    <Box className="onboarding-screen-right">
                      <Typography
                        variant="h4"
                        className="heading-text"
                        color="initial"
                      >
                        Tell us about your case
                      </Typography>

                      <Typography my={4} variant="h5" color="initial">
                        Tell us about the following three things
                      </Typography>

                      <Box>
                        <Typography className="question-para" variant="body1">
                          <ListItemIcon /> &nbsp; What is your name?
                        </Typography>
                        <Typography
                          my={2}
                          className="question-para"
                          variant="body1"
                        >
                          <ListItemIcon /> &nbsp; Where are you based?
                        </Typography>
                        <Typography className="question-para" variant="body1">
                          <ListItemIcon /> &nbsp; What is your problem?
                        </Typography>
                      </Box>

                      <Recorder recordedAudio={setRecordedAudioURL} />
                    </Box>
                  )}

                  {screen === 20 && (
                    <Box className="onboarding-screen-right screen2">
                      <Typography
                        variant="h4"
                        className="heading-text"
                        color="initial"
                      >
                        Let’s schedule a time to talk
                      </Typography>
                      <Typography variant="body1" color="initial">
                        Every case is individual and personal.
                      </Typography>

                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Name
                        </Typography>

                        <TextField
                          id="outlined-basic"
                          label=""
                          placeholder="Enter your full name"
                          fullWidth
                          error={isFullNameError}
                          helperText={isFullNameError && "Name is required"}
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            setIsFullNameError(false);
                          }}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Email
                        </Typography>

                        <TextField
                          id="outlined-basic"
                          type="email"
                          label=""
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailError(false);
                          }}
                          fullWidth
                          size="small"
                          error={isEmailError}
                          helperText={
                            isEmailError && "Email is required or invalid"
                          }
                          variant="outlined"
                        />
                      </Box>
                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Phone (not essential)
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
                            disabled={countdownInProgress || phoneVerify}
                            onChange={(e) => {
                              setPhone(e.target.value);
                            }}
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
                                          <img
                                            src={crossIcon}
                                            alt="Cross Icon"
                                          />
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
                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Postcode (not essential)
                        </Typography>

                        <ThemeProvider theme={theme}>
                          <TextField
                            id="outlined-basic"
                            label=""
                            placeholder="Enter your post code"
                            fullWidth
                            error={isPostalCodeError}
                            inputProps={{ maxLength: 7 }}
                            helperText={
                              isPostalCodeError &&
                              "Post Code is required or invalid"
                            }
                            value={postalCode}
                            onChange={(e) => {
                              setPostalCode(e.target.value);
                              setIsPostalCodeError(false);
                            }}
                            onKeyDown={handleKeyDown}
                            size="small"
                            variant="outlined"
                          />
                        </ThemeProvider>
                      </Box>
                    </Box>
                  )}

                  {screen === 1 && (
                    <Box className="onboarding-screen-right">
                      <Typography
                        variant="h4"
                        className="heading-text"
                        color="initial"
                      >
                        What do you need help with?
                      </Typography>

                      <Stack mt={4} spacing={2} direction="column">
                        <Box
                          onClick={() =>
                            setCategory("Getting a divorce or separation?")
                          }
                          className={
                            category === "Getting a divorce or separation?"
                              ? `onboarding-screen-right-item-active`
                              : `onboarding-screen-right-item`
                          }
                        >
                          <Typography
                            variant="h5"
                            className="heading-right-item"
                            color="initial"
                          >
                            Getting a divorce or separation?
                          </Typography>

                          {category === "Getting a divorce or separation?" && (
                            <Typography
                              variant="body1"
                              className="text-right-item"
                              color="initial"
                            >
                              We understand things don't always go as planned,
                              let us find a solution
                            </Typography>
                          )}
                        </Box>
                        <Box
                          onClick={() =>
                            setCategory("Need a visa or immigrating to the UK?")
                          }
                          className={
                            category === "Need a visa or immigrating to the UK?"
                              ? `onboarding-screen-right-item-active`
                              : `onboarding-screen-right-item`
                          }
                        >
                          <Typography
                            variant="h5"
                            className="heading-right-item"
                            color="initial"
                          >
                            Need a visa or immigrating to the UK?
                          </Typography>

                          {category ===
                            "Need a visa or immigrating to the UK?" && (
                            <Typography
                              variant="body1"
                              className="text-right-item"
                              color="initial"
                            >
                              We appreciate this is not always as simple as it
                              should be whether making the application, seeking
                              advice or navigating the home office let us help
                              you
                            </Typography>
                          )}
                        </Box>

                        <Box
                          onClick={() =>
                            setCategory(
                              "Are you a current or prospective Landlord or Tenant?"
                            )
                          }
                          className={
                            category ===
                            "Are you a current or prospective Landlord or Tenant?"
                              ? `onboarding-screen-right-item-active`
                              : `onboarding-screen-right-item`
                          }
                        >
                          <Typography
                            variant="h5"
                            className="heading-right-item"
                            color="initial"
                          >
                            Are you a current or prospective Landlord or Tenant?
                          </Typography>

                          {category ===
                            "Are you a current or prospective Landlord or Tenant?" && (
                            <Typography
                              variant="body1"
                              className="text-right-item"
                              color="initial"
                            >
                              Our experienced lawyers understand both sides
                            </Typography>
                          )}
                        </Box>
                        <Box
                          onClick={() => setCategory("Trouble at work?")}
                          className={
                            category === "Trouble at work?"
                              ? `onboarding-screen-right-item-active`
                              : `onboarding-screen-right-item`
                          }
                        >
                          <Typography
                            variant="h5"
                            className="heading-right-item"
                            color="initial"
                          >
                            Trouble at work?
                          </Typography>

                          {category === "Trouble at work?" && (
                            <Typography
                              variant="body1"
                              className="text-right-item"
                              color="initial"
                            >
                              Whether you're having trouble at your existing
                              work place or a new employment contract we can
                              guide you through all
                            </Typography>
                          )}
                        </Box>

                        <Box
                          onClick={() =>
                            setCategory("Falsely accused of a crime?")
                          }
                          className={
                            category === "Falsely accused of a crime?"
                              ? `onboarding-screen-right-item-active`
                              : `onboarding-screen-right-item`
                          }
                        >
                          <Typography
                            variant="h5"
                            className="heading-right-item"
                            color="initial"
                          >
                            Falsely accused of a crime?
                          </Typography>

                          {category === "Falsely accused of a crime?" && (
                            <Typography
                              variant="body1"
                              className="text-right-item"
                              color="initial"
                            >
                              The law and police exist to protect us, but that
                              doesn't mean you shouldn't protect yourself if an
                              allegation has been made
                            </Typography>
                          )}
                        </Box>

                        <Box
                          onClick={() => setCategory("Any Other challenges?")}
                          className={
                            category === "Any Other challenges?"
                              ? `onboarding-screen-right-item-active`
                              : `onboarding-screen-right-item`
                          }
                        >
                          <Typography
                            variant="h5"
                            className="heading-right-item"
                            color="initial"
                          >
                            Any Other challenges?
                          </Typography>

                          {category === "Any Other challenges?" && (
                            <Typography
                              variant="body1"
                              className="text-right-item"
                              color="initial"
                            ></Typography>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  )}

                  {screen === 4 && (
                    <Box className="onboarding-screen-right screen2">
                      <Typography
                        variant="h4"
                        className="heading-text"
                        color="initial"
                      >
                        Where is your case based?
                      </Typography>
                      <Typography variant="body1" color="initial">
                        We’ll look for a lawyer near you.
                      </Typography>

                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Postcode
                        </Typography>
                        <ThemeProvider theme={theme}>
                          <TextField
                            id="outlined-basic"
                            label=""
                            placeholder="Enter your post code"
                            fullWidth
                            error={isPostalCodeError}
                            inputProps={{ maxLength: 5 }}
                            helperText={
                              isPostalCodeError &&
                              "Post code is required or invalid"
                            }
                            value={postalCode}
                            onChange={(e) => {
                              setPostalCode(e.target.value);
                              setIsPostalCodeError(false);
                            }}
                            size="small"
                            variant="outlined"
                          />
                        </ThemeProvider>
                      </Box>
                    </Box>
                  )}

                  {screen === 2 && (
                    <Box className="onboarding-screen-right screen2">
                      <Typography
                        variant="h4"
                        className="heading-text"
                        color="initial"
                      >
                        Tell us about your case
                      </Typography>
                      <Typography variant="body1" color="initial">
                        We’ll look for a lawyer near you.
                      </Typography>

                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Description
                        </Typography>

                        <TextField
                          id="outlined-basic"
                          label=""
                          multiline
                          value={caseDescription}
                          error={isCaseDescriptionError}
                          helperText={
                            isCaseDescriptionError && "Description is required"
                          }
                          onChange={(e) => {
                            setCaseDescription(e.target.value);
                            setIsCaseDescriptionError(false);
                          }}
                          rows={4}
                          placeholder="Tell us about your case"
                          fullWidth
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  )}
                  {screen === 5 && (
                    <Box className="onboarding-screen-right screen2">
                      <Typography
                        variant="h4"
                        className="heading-text"
                        color="initial"
                      >
                        Let’s schedule a time to talk
                      </Typography>
                      <Typography variant="body1" color="initial">
                        Every case is individual and personal.
                      </Typography>

                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Name
                        </Typography>

                        <TextField
                          id="outlined-basic"
                          label=""
                          placeholder="Enter your full name"
                          fullWidth
                          error={isFullNameError}
                          helperText={isFullNameError && "Name is required"}
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            setIsFullNameError(false);
                          }}
                          onKeyDown={handleKeyDown}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box mt={3}>
                        <Typography
                          variant="h5"
                          mb={2}
                          className="postal-label"
                          color="initial"
                        >
                          Email
                        </Typography>

                        <TextField
                          id="outlined-basic"
                          type="email"
                          label=""
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailError(false);
                          }}
                          onKeyDown={handleKeyDown}
                          fullWidth
                          size="small"
                          error={isEmailError}
                          helperText={
                            isEmailError && "Email is required or invalid"
                          }
                          variant="outlined"
                        />

                        <Box mt={3}>
                          <Typography
                            variant="h5"
                            mb={2}
                            className="postal-label"
                            color="initial"
                          >
                            Phone (not essential)
                          </Typography>

                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <InputMask
                              mask="+44 9999 999999"
                              maskChar=""
                              disabled={countdownInProgress || phoneVerify}
                              onChange={(e) => {
                                setPhone(e.target.value);
                              }}
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
                                  style={{
                                    marginRight: "5px",
                                    marginLeft: "-8px",
                                  }}
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
                        <Box mt={3}>
                          <Typography
                            variant="h5"
                            mb={2}
                            className="postal-label"
                            color="initial"
                          >
                            Postcode (not essential)
                          </Typography>
                          <ThemeProvider theme={theme}>
                            <TextField
                              id="outlined-basic"
                              label=""
                              placeholder="Enter your post code"
                              fullWidth
                              error={isPostalCodeError}
                              inputProps={{ maxLength: 7 }}
                              helperText={
                                isPostalCodeError &&
                                "Post Code is required or invalid"
                              }
                              value={postalCode}
                              onChange={(e) => {
                                setPostalCode(e.target.value);
                                setIsPostalCodeError(false);
                              }}
                              onKeyDown={handleKeyDown}
                              size="small"
                              variant="outlined"
                            />
                          </ThemeProvider>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
          {isQuestionaire && (
            <Grid
              container
              spacing={2}
              className="onboarding-screen-bottom-btn"
            >
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}></Grid>

              <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box>
                    {screen === 1 && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSelectedOption("voice-memo");

                          setScreen(10);
                          navigate(`/onboarding/${10}`);
                          handleBack();
                          setIsVoiceMemoDirect(true);

                          setSteps([
                            {
                              label: "What is your problem?",
                              description: "",
                            },
                            {
                              label: "Let's talk",
                              description: `Provide details so we can set up a time to talk`,
                            },
                          ]);
                        }}
                        className="voice-btn"
                      >
                        <VoiceIconGreen />
                        &nbsp;use voice note instead
                      </Button>
                    )}
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    {screenId > 0 && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (
                              screen % 10 === 0 &&
                              selectedOption === "voice-memo"
                            ) {
                              if (screen === 0) {
                                if (isDashboard === "true") {
                                  navigate("/dashboard");
                                } else {
                                  navigate("/");
                                }
                              } else if (screen === 10) {
                                if (isDashboard === "true") {
                                  setScreen(screen - 10);
                                  // navigate("/dashboard");
                                  navigate(`/onboarding/${screen - 10}`);
                                } else {
                                  setScreen(screen - 10);
                                  navigate(`/onboarding/${screen - 10}`);
                                  // navigate("/");
                                }
                              } else {
                                if (isVoiceMemoDirect && screen === 10) {
                                  navigate("/");
                                } else {
                                  setScreen(screen - 10);
                                  handleBack();
                                  navigate(`/onboarding/${screen - 10}`);
                                }
                              }
                            } else {
                              if (screen === 0) {
                                if (isDashboard === "true") {
                                  navigate("/dashboard");
                                } else {
                                  navigate("/");
                                }
                              } else {
                                if (screen === 100) {
                                  setScreen(screen - 99);
                                  navigate(`/onboarding/${screen - 99}`);
                                  handleBack();
                                } else {
                                  if (screen === 2) {
                                    setScreen(screen - 1);
                                    handleBack();
                                    navigate(`/onboarding/${screen - 1}`);
                                  } else if (screen === 5) {
                                    setScreen(screen - 3);
                                    navigate(`/onboarding/${screen - 3}`);
                                    handleBack();
                                  } else {
                                    setScreen(screen - 1);
                                    handleBack();
                                    navigate(`/onboarding/${screen - 1}`);
                                  }
                                }
                              }
                            }
                          }}
                          className="back-btn"
                        >
                          Back
                        </Button>

                        <Button
                          variant="contained"
                          disabled={
                            screen == 1 &&
                            category &&
                            selectedOption === "questionnaire"
                              ? false
                              : screen == 2 &&
                                caseDescription &&
                                selectedOption === "questionnaire"
                              ? false
                              : screen == 5 &&
                                fullName &&
                                email &&
                                (phone ? phoneVerify : true) &&
                                selectedOption === "questionnaire"
                              ? false
                              : screen == 10 &&
                                recordedAudioURL &&
                                selectedOption === "voice-memo"
                              ? false
                              : screen == 20 &&
                                fullName &&
                                email &&
                                (phone ? phoneVerify : true) &&
                                selectedOption === "voice-memo"
                              ? false
                              : true
                            // (screen == 5 ? false : true)
                          }
                          onClick={() => {
                            handleNextButton();
                          }}
                          className={
                            (
                              screen == 1 &&
                              category &&
                              selectedOption === "questionnaire"
                                ? false
                                : screen == 2 &&
                                  caseDescription &&
                                  selectedOption === "questionnaire"
                                ? false
                                : screen == 5 &&
                                  fullName &&
                                  email &&
                                  (phone ? phoneVerify : true) &&
                                  selectedOption === "questionnaire"
                                ? false
                                : screen == 10 &&
                                  recordedAudioURL &&
                                  selectedOption === "voice-memo"
                                ? false
                                : screen == 20 &&
                                  fullName &&
                                  email &&
                                  (phone ? phoneVerify : true) &&
                                  selectedOption === "voice-memo"
                                ? false
                                : true
                            )
                              ? "disabled-next-btn"
                              : "next-btn"
                          }
                        >
                          Next &nbsp; <RightArrow />
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      <MessageModal
        open={isModalOpen}
        onClose={setIsModalOpen}
        content={modalContent.description}
        title={modalContent.title}
        error
      />
      <MessageModal
        open={isNotRecordedAudioModal}
        onClose={setIsNotRecordedAudioModal}
        content="Record your voice note to proceed"
        title="Record your voice note"
        error
      />
      <PhoneVerification
        open={isModal}
        setOpen={SetIsModal}
        phone={phoneNumber}
        setPhoneVerify={setPhoneVerify}
        setCountdownInProgress={setCountdownInProgress}
      />
    </>
  );
};

export default OnBoardingScreen;
