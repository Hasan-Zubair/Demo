import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Calendery.scss";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import { LoadingButton } from "@mui/lab";

import FormControlLabel from "@mui/material/FormControlLabel";
import moment from "moment";
import MessageModal from "../../common/MessageModal";
import { useNavigate } from "react-router-dom";

const Calendery = ({
  setIsScheduleEvent,
  setIsCalender,
  setEventDate,
  eventDate,
  eventTime,
  setCompleteTime,
  setEventTime,
  fullName,
  email,
  setIsQuestionaire,
  setIsEventScheduled,
  category,
  postalCode,
  recordedAudioURL,
  phone,
  caseDescription,
  setIsEventBooked,
  calenderBack,
}) => {
  const [value, setValue] = useState(new Date(eventDate ? eventDate : ""));
  // eslint-disable-next-line
  const [selectedTime, setSelectedTime] = useState(eventTime);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const navigate = useNavigate();
  const [isErrorModalTime, setIsErrorModalTime] = useState(false);
  const [isTermsAgree, setIsTermsAgree] = useState(false);
  const [isAllFieldsNotFilled, setIsAllFieldsNotFilled] = useState(false);
  const [notValidPhoneModal, setNotValidPhoneModal] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const selectedDay = eventDate
    ? eventDate
    : value.$d.toISOString().substring(0, 10);

  const sendData = async () => {
    if (caseDescription.length > 0) {
      if (!localStorage.getItem("token")) {
        if (
          // phone &&
          isTermsAgree &&
          fullName &&
          email &&
          eventDate &&
          eventTime
        ) {
          setIsBtnLoading(true);
          await axios
            .post(
              `${process.env.REACT_APP_BASE_API_URL}api/auth/register/client/`,
              {
                type: "client",
                email: email,
                name: fullName,
                mobile: phone,
                appointment: eventDate + " " + eventTime,
                zip_code: postalCode,
                category: category,
                description: caseDescription,
              }
            )
            .then(() => {
              setIsEventScheduled(true);
              setIsScheduleEvent(false);
              setIsEventBooked(true);
              setIsCalender(false);
              setIsBtnLoading(false);
            })
            .catch((err) => {
              if (err.message === "Network Error") {
                setIsNetworkError(true);
                setIsBtnLoading(false);
              } else {
                setIsErrorModal(true);
                setIsBtnLoading(false);
              }
            });
        } else {
          if (!eventDate || !eventTime) {
            setIsErrorModalTime(true);
          } else {
            if (
              // !phone &&
              isTermsAgree &&
              fullName &&
              email &&
              category &&
              postalCode &&
              eventDate &&
              eventTime &&
              caseDescription
            ) {
              setNotValidPhoneModal(true);
            } else {
              setIsAllFieldsNotFilled(true);
            }
          }
        }
      } else {
        if (isTermsAgree && eventDate && eventTime) {
          let user = JSON.parse(localStorage.getItem("LoggedInObj"));

          setIsBtnLoading(true);
          await axios
            .post(
              `${process.env.REACT_APP_BASE_API_URL}api/auth/register/client/?login=true`,
              {
                type: "client",
                appointment: eventDate + " " + eventTime,
                category: category,
                description: caseDescription,
                email: user.email,
              }
            )
            .then(() => {
              setIsEventScheduled(true);
              setIsScheduleEvent(false);
              setIsEventBooked(true);
              setIsCalender(false);
              setIsBtnLoading(false);
            })
            .catch((err) => {
              if (err.message === "Network Error") {
                setIsNetworkError(true);
                setIsBtnLoading(false);
              } else {
                setIsErrorModal(true);
                setIsBtnLoading(false);
              }
            });
        } else {
          if (!eventDate || !eventTime) {
            setIsErrorModalTime(true);
          } else {
            if (
              // !phone &&
              isTermsAgree &&
              fullName &&
              email &&
              category &&
              postalCode &&
              eventDate &&
              eventTime &&
              caseDescription
            ) {
              setNotValidPhoneModal(true);
            } else {
              setIsAllFieldsNotFilled(true);
            }
          }
        }
      }
    } else if (recordedAudioURL) {
      if (!localStorage.getItem("token")) {
        if (
          // phone &&
          isTermsAgree &&
          fullName &&
          email &&
          eventDate &&
          eventTime
        ) {
          setIsBtnLoading(true);

          const formData = new FormData();

          formData.append(
            "voice_note",
            new File([recordedAudioURL], "voice_note")
          );
          formData.append("type", "client");
          formData.append("email", email);
          formData.append("name", fullName);
          formData.append("mobile", phone);
          formData.append("appointment", eventDate + " " + eventTime);
          formData.append("zip_code", postalCode);

          await axios
            .post(
              `${process.env.REACT_APP_BASE_API_URL}api/auth/register/client/`,
              formData
            )
            .then(() => {
              setIsEventScheduled(true);
              setIsScheduleEvent(false);
              setIsEventBooked(true);
              setIsCalender(false);
              setIsBtnLoading(false);
            })
            .catch((err) => {
              if (err.message === "Network Error") {
                setIsNetworkError(true);
                setIsBtnLoading(false);
              } else {
                setIsErrorModal(true);
                setIsBtnLoading(false);
              }
            });
        } else {
          if (!eventDate || !eventTime) {
            setIsErrorModalTime(true);
          } else {
            if (
              // !phone &&
              isTermsAgree &&
              fullName &&
              email &&
              category &&
              postalCode &&
              eventDate &&
              eventTime &&
              caseDescription
            ) {
              setNotValidPhoneModal(true);
            } else {
              setIsAllFieldsNotFilled(true);
            }
          }
        }
      } else {
        if (isTermsAgree && eventDate && eventTime) {
          setIsBtnLoading(true);
          let user = JSON.parse(localStorage.getItem("LoggedInObj"));

          const formData = new FormData();

          formData.append(
            "voice_note",
            new File([recordedAudioURL], "voice_note")
          );
          formData.append("type", "client");
          formData.append("email", user.email);

          formData.append("appointment", eventDate + " " + eventTime);
          formData.append("zip_code", postalCode);

          await axios
            .post(
              `${process.env.REACT_APP_BASE_API_URL}api/auth/register/client/?login=true`,
              formData
            )
            .then((res) => {
              setIsEventScheduled(true);
              setIsScheduleEvent(false);
              setIsEventBooked(true);
              setIsCalender(false);
              setIsBtnLoading(false);
            })
            .catch((err) => {
              if (err.message === "Network Error") {
                setIsNetworkError(true);
                setIsBtnLoading(false);
              } else {
                setIsErrorModal(true);
                setIsBtnLoading(false);
              }
            });
        } else {
          if (!eventDate || !eventTime) {
            setIsErrorModalTime(true);
          } else {
            if (
              // !phone &&
              isTermsAgree &&
              fullName &&
              email &&
              category &&
              postalCode &&
              eventDate &&
              eventTime &&
              caseDescription
            ) {
              setNotValidPhoneModal(true);
            } else {
              setIsAllFieldsNotFilled(true);
            }
          }
        }
      }
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/slot/?date=${selectedDay}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      );

      const bookedSlotTimes = response.data.data.map((slot) => slot.time);
      setBookedSlots(bookedSlotTimes);

      const filteredSlots = timeSlots.filter(
        (time) => !bookedSlotTimes.includes(time.btime)
      );

      setAvailableSlots(filteredSlots);
    } catch (error) {
      console.error("Error fetching booked slots: ", error);
    }
  };

  const timeSlots = [
    {
      id: 1,
      ftime: "3:00PM",
      btime: "15:00:00",
    },

    {
      id: 2,
      ftime: "3:30PM",
      btime: "15:30:00",
    },

    {
      id: 3,
      ftime: "4:00PM",
      btime: "16:00:00",
    },

    {
      id: 4,
      ftime: "4:30PM",
      btime: "16:30:00",
    },

    {
      id: 5,
      ftime: "5:00PM",
      btime: "17:00:00",
    },

    {
      id: 6,
      ftime: "5:30PM",
      btime: "17:30:00",
    },
  ];

  const filteredSlots = timeSlots.filter(
    (time) => !bookedSlots.includes(time.btime)
  );
  const noSlotsAvailable = filteredSlots.length === 0;
  const shouldDisableDate = (date) => {
    // Disable if the date is a Saturday (6) or Sunday (0)
    const isWeekend = [0, 6].includes(date.day());
    const isPastDay = date.isBefore(moment(), "day");

    return isWeekend || isPastDay;
  };

  useEffect(() => {
    timeSlots.forEach((item) => {
      if (item.btime === eventTime) {
        setSelectedTime(item.ftime);
      }
    });

    if (selectedDay) {
      fetchBookedSlots();
    }
  }, [selectedDay]);

  return (
    <>
      <Box className="calendery-wrapper">
        <Box className="calendery-screen-top-logo">
          <Logo
            onClick={() => {
              if (
                JSON.parse(localStorage.getItem("LoggedInObj")).type === "admin"
              ) {
                navigate("/admin/dashboard");
              } else if (
                JSON.parse(localStorage.getItem("LoggedInObj")).type ===
                "lawyer"
              ) {
                navigate("/dashboard/lawyer");
              } else if (JSON.parse(localStorage.getItem("LoggedInObj"))) {
                navigate("/dashboard");
              }
            }}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Container
          className="calendery-screen-container"
          maxWidth="lg"
          sx={{ backgroundColor: "white" }}
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography
                variant="h4"
                className="calendery-heading"
                color="initial"
              >
                Let’s schedule a time to talk
              </Typography>
              <Box mt={3} className="calender-wrapper">
                <Typography
                  variant="h6"
                  className="select-time-text"
                  fontFamily="Inter"
                  fontWeight={600}
                  color="initial"
                >
                  Select a Date & Time
                </Typography>
                <Grid container spacing={2} className="calendery-grid">
                  <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Box className="calendery-grid-item">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                          displayStaticWrapperAs="desktop"
                          value={value}
                          className="calender-calendery"
                          onChange={(value) => {
                            setValue(value);

                            setEventDate(
                              moment(value?.$d).format("YYYY-MM-DD")
                            );
                            // fetchBookedSlots();
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          shouldDisableDate={shouldDisableDate} // Disable weekends
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <Box className="calendery-grid-item margin-top">
                      <Typography variant="body1" color="initial">
                        {moment(value?.$d).format("dddd")}{" "}
                        {moment(value?.$d).format("LL")}
                      </Typography>

                      <Box my={3} className="time-wrapper">
                        <Stack
                          direction="column"
                          spacing={2}
                          className="time-stack"
                        >
                          {noSlotsAvailable ? (
                            <Typography variant="body1" color="initial">
                              No Time Slots Available
                            </Typography>
                          ) : (
                            availableSlots.map((time) => (
                              <Box
                                key={time.id}
                                className={`${
                                  selectedTime === time.ftime
                                    ? "time-box-active"
                                    : "time-box"
                                }`}
                                onClick={() => {
                                  setSelectedTime(time.ftime);
                                  setEventTime(time.btime);
                                  setCompleteTime(time.ftime);
                                }}
                              >
                                <Typography variant="body1" color="initial">
                                  {time.ftime}
                                </Typography>
                              </Box>
                            ))
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box display="flex" sx={{ margin: "19px 3px" }}>
                <Box className="bottom-box-wrapper">
                  <Box className="ScheduleEvent-form-wrapper">
                    <Box>
                      <Typography mb={1} variant="body1" color="initial">
                        I agree to LegalEase contacting me by email and/or phone. I
                        also understand that any information I’ve shared in this
                        form is subject to LegalEase's Privacy Policy.
                      </Typography>
                      <Box className="terms-checkbox-wrapper">
                        <FormControlLabel
                          label="I Agree"
                          control={
                            <Checkbox
                              onChange={(e) =>
                                setIsTermsAgree(e.target.checked)
                              }
                              sx={{
                                "&.Mui-checked": {
                                  color: "#006766",
                                },
                              }}
                            />
                          }
                        />
                      </Box>
                    </Box>

                    <Box mt={3} display="flex" justifyContent="flex-start">
                      <Button
                        style={{ marginRight: "10px" }}
                        className="calendly-back-btn"
                        onClick={() => {
                          setIsCalender(false);
                          setIsQuestionaire(true);
                          calenderBack();
                        }}
                        variant="contained"
                      >
                        Back
                      </Button>
                      <LoadingButton
                        style={{ width: "76%" }}
                        className={
                          !isTermsAgree
                            ? "ScheduleEvent-form-button-disable"
                            : `${
                                isBtnLoading ? "" : "ScheduleEvent-form-button"
                              }`
                        }
                        variant="contained"
                        loading={isBtnLoading}
                        size="large"
                        fullWidth
                        onClick={() => sendData()}
                      >
                        Schedule Event
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <MessageModal
        open={isErrorModalTime}
        onClose={setIsErrorModalTime}
        title="Error"
        error
        content={`${
          !eventTime && !eventDate
            ? "Please select a date and time"
            : !eventTime
            ? "Please select a time"
            : !eventDate
            ? "Please select a date"
            : ""
        }`}
      />
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        content="This user already exists. Please login to continue."
        error
      />
      <MessageModal
        open={isNetworkError}
        onClose={setIsNetworkError}
        title="Error"
        content="Something went wrong. Please try again later."
        error
      />
      <MessageModal
        open={isAllFieldsNotFilled}
        onClose={setIsAllFieldsNotFilled}
        title="Error"
        content="Please fill all the fields."
        error
      />
      <MessageModal
        open={notValidPhoneModal}
        onClose={setNotValidPhoneModal}
        title="Error"
        content="Phone Number is not valid."
        error
      />
    </>
  );
};

Calendery.propTypes = {
  setIsScheduleEvent: PropTypes.func.isRequired,
  setIsCalender: PropTypes.func.isRequired,
  setEventDate: PropTypes.func.isRequired,
  eventDate: PropTypes.string,
  eventTime: PropTypes.string,
  setCompleteTime: PropTypes.func.isRequired,
  setEventTime: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  setIsQuestionaire: PropTypes.func.isRequired,
  setIsEventScheduled: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  recordedAudioURL: PropTypes.string,
  phone: PropTypes.string.isRequired,
  caseDescription: PropTypes.string.isRequired,
  setIsEventBooked: PropTypes.func.isRequired,
};

export default Calendery;
