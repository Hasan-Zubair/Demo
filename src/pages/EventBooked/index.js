import React, { useState } from "react";
import "./EventBooked.scss";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import { ReactComponent as Clock } from "../../assets/clock.svg";
import { ReactComponent as Calender } from "../../assets/calender.svg";
import { ReactComponent as Globe } from "../../assets/globe.svg";
import MessageModal from "../../common/MessageModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventBooked = ({
  isEventScheduled,
  setIsEventScheduled,
  completeDate,
  email,
  completeTime,
}) => {
  const navigate = useNavigate();
  const [isEmailSentAgain, setIsEmailSentAgain] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);

  const styleLink = {
    textDecoration: "underline",
    color: "#006766",
    cursor: "pointer",
  };
  const sendMail = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/register/client/email_resend/`,
        {
          email: email,
        },
      )
      .then((res) => {
        setIsEmailSentAgain(true);
      })
      .catch((err) => {
        setIsErrorModal(true);
      });
  };

  return (
    <>
      <Box className="eventBooked-wrapper">
        <Box className="eventBooked-screen-top-logo">
          <Logo onClick={() => navigate("/")} style={{ cursor: "pointer" }} />
        </Box>
        <Container
          className="eventBooked-screen-container"
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
                Congratulations! Your Call is confirmed Successfully
              </Typography>
              <Typography
                my={3}
                variant="h5"
                fontFamily="Tomato Grotesk"
                fontWeight="bold"
                color="#006766"
                textAlign="center"
              >
                Initial Call with Vera law
              </Typography>

              <Typography
                variant="body1"
                color="initial"
                textAlign="center"
                my={3}
              >
                We have sent you the email with the details of the call. Didn't
                receive the email? Check your spam folder.
                {/* or{" "} */}
                {/* <span style={styleLink} onClick={() => sendMail()}>
                  Resend it
                </span> */}
                {/* . */}
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

              <Box display="flex" justifyContent="center" mt={5}>
                <Button
                  variant="contained"
                  className="event-booked-btn"
                  color="primary"
                  onClick={() => {
                    if (localStorage.getItem("token")) {
                      navigate("/dashboard");
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  Go to{" "}
                  {localStorage.getItem("token") ? "Dashboard" : "Homepage"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <MessageModal
        open={isEventScheduled}
        onClose={setIsEventScheduled}
        title="Event Scheduled"
        content="Event is Scheduled Successfully"
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

export default EventBooked;
