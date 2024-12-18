import React, { useState } from "react";
// import "./ScheduleEvent.scss";
import { Box, Container, Typography, Grid, TextField } from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";

import { ReactComponent as Clock } from "../../assets/clock.svg";
import { ReactComponent as Calender } from "../../assets/calender.svg";
import { ReactComponent as Globe } from "../../assets/globe.svg";
import Checkbox from "@mui/material/Checkbox";
import { LoadingButton } from "@mui/lab";

import FormControlLabel from "@mui/material/FormControlLabel";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import MessageModal from "../../common/MessageModal";
import axios from "axios";

const ScheduleEvent = ({
  fullName,
  setFullName,
  email,
  setEmail,
  setIsScheduleEvent,
  setIsEventScheduled,
  category,
  issueType,
  postalCode,
  eventDate,
  eventTime,
  completeTime,
  caseDescription,
  completeDate,
  setIsEventBooked,
}) => {
  const [phone, setPhone] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isTermsAgree, setIsTermsAgree] = useState(false);
  const [isAllFieldsNotFilled, setIsAllFieldsNotFilled] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const sendData = async () => {
    if (
      // phone &&
      isTermsAgree &&
      fullName &&
      email &&
      category &&
      issueType &&
      postalCode &&
      eventDate &&
      eventTime &&
      caseDescription
    ) {
      setIsBtnLoading(true);
      await axios
        .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/register/`, {
          type: "client",
          email: email,
          name: fullName,
          mobile: phone,
          appointment: {
            date: eventDate,
            time: eventTime,
            zip_code: postalCode,
            case_category: category,
            case_type: issueType,
            case_description: caseDescription,
          },
        })
        .then((res) => {
          // gtag('event', 'conversion', {'send_to': 'AW-11314798198/xW1XCIuk3NcYEPa8qJMq'});

          setIsEventScheduled(true);
          setIsScheduleEvent(false);
          setIsEventBooked(true);
          setIsBtnLoading(false);
        })
        .catch((err) => {
          setIsErrorModal(true);
          setIsBtnLoading(false);
        });
    } else {
      setIsAllFieldsNotFilled(true);
    }
  };

  return (
    <>
      <Box className="ScheduleEvent-wrapper">
        <Box className="ScheduleEvent-screen-top-logo">
          <Logo />
        </Box>
        <Container
          className="ScheduleEvent-screen-container"
          maxWidth="md"
          sx={{ backgroundColor: "white" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="body1" color="initial">
                Vera
              </Typography>
              <Typography
                my={3}
                variant="h4"
                fontFamily="Tomato Grotesk"
                fontWeight="bold"
                color="#006766"
              >
                Initial Call with Vera law
              </Typography>

              <Typography
                variant="body1"
                color="initial"
                my={2}
                className="event-page-icon-img-wrapper"
              >
                <Clock />
                &nbsp; 15 min
              </Typography>
              <Typography
                variant="body1"
                color="initial"
                my={4}
                className="event-page-icon-img-wrapper"
              >
                <Calender />
                &nbsp;{" "}
                <span>
                  {" "}
                  {completeDate} at {completeTime}{" "}
                </span>
              </Typography>
              <Typography
                variant="body1"
                color="initial"
                my={2}
                className="event-page-icon-img-wrapper"
              >
                <Globe />
                &nbsp; UK, Time
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box className="ScheduleEvent-form-wrapper">
                <Typography
                  className="ScheduleEvent-heading"
                  variant="h4"
                  color="initial"
                >
                  Enter Details
                </Typography>
                <Typography
                  my={2}
                  variant="body1"
                  className="ScheduleEvent-para"
                  color="initial"
                >
                  Welcome back! Please enter your details.
                </Typography>

                <Box mt={3}>
                  <Typography mb={1} variant="body1" color="initial">
                    Full Name
                  </Typography>
                  <TextField
                    className="ScheduleEvent-form-input"
                    id="outlined-basic"
                    label=""
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="Full Name"
                    fullWidth
                  />
                </Box>
                <Box mt={3}>
                  <Typography mb={1} variant="body1" color="initial">
                    Email
                  </Typography>
                  <TextField
                    className="ScheduleEvent-form-input"
                    id="outlined-basic"
                    label=""
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    placeholder="Enter your email"
                    fullWidth
                  />
                </Box>
                <Box mt={3}>
                  <Typography mb={1} variant="body1" color="initial">
                    Phone Number
                  </Typography>

                  <PhoneInput
                    country={"us"}
                    inputClass="phone-input"
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                  />
                </Box>

                <Box mt={3}>
                  <Typography mb={1} variant="body1" color="initial">
                  By pressing the submit button, I agree to Vera contacting
                      me by email and/or phone. I also understand that any
                      information I&apos;ve shared in this form is subject to
                      Vera&apos;s Privacy Policy.
                  </Typography>
                  <Box>
                    <FormControlLabel
                      label="Approve"
                      control={
                        <Checkbox
                          onChange={(e) => setIsTermsAgree(e.target.checked)}
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

                <Box mt={3}>
                  <LoadingButton
                    className={
                      !isTermsAgree
                        ? "ScheduleEvent-form-button-disable"
                        : `${isBtnLoading ? "" : "ScheduleEvent-form-button"}`
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
            </Grid>
          </Grid>
        </Container>
      </Box>
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        content="This user already exists. Please login to continue."
        error
      />
      <MessageModal
        open={isAllFieldsNotFilled}
        onClose={setIsAllFieldsNotFilled}
        title="Error"
        content="Please fill all the fields."
        error
      />
    </>
  );
};

export default ScheduleEvent;
