import React, { useState } from "react";
import "./ContactForm.scss";
import { Grid, Container, TextField, Typography, Box } from "@mui/material";
import { ReactComponent as MessageIcon } from "../../assets/msg-icon.svg";
// import { ReactComponent as PhoneIcon } from "../../assets/call-icon.svg";
import { ReactComponent as LocationIcon } from "../../assets/location-icon.svg";
import InputAdornment from "@mui/material/InputAdornment";
import { LoadingButton } from "@mui/lab";
import InputMask from "react-input-mask";
import axios from "axios";
import ukflag from "../../assets/uk-flag.png";
import MessageModal from "../../common/MessageModal";

const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [feedbackDoneModal, setFeedbackDoneModal] = useState(false);
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const sendContactUsData = async () => {
    setIsBtnLoading(true);
    const data = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      message: description,
      phone: phone,
    };
    try {
      await axios
        // .post(`http://localhost:8000/api/auth/contact/`, data)
        .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/contact/`, data)
        .then((res) => {
          setFeedbackDoneModal(true);
          setFirstName("");
          setLastName("");
          setEmail("");
          setDescription("");
          setPhone("");
          setIsBtnLoading(false);
        });
    } catch (error) {
      setIsBtnLoading(false);
    }
  };

  const contactUsFormValidation = () => {
    if (firstName === "") {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
    if (lastName === "") {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
    if (email === "") {
      setEmailError(true);
    } else {
      if (isEmailValid(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
    if (description === "") {
      setIsDescriptionError(true);
    } else {
      setIsDescriptionError(false);
    }
    if (phone === "") {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }

    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      description !== "" &&
      phone !== "" &&
      isEmailValid(email) &&
      !emailError &&
      !firstNameError &&
      !lastNameError &&
      !phoneError &&
      !isDescriptionError
    ) {
      sendContactUsData();
    }
  };

  const isEmailValid = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <>
      <Container className="custom-container-contact ">
        <Box mt={5} mb={5} className="contact-us-wrapper">
          <Grid container>
            <Grid
              className="contact-us-left"
              item
              xs={12}
              sm={6}
              md={5}
              lg={5}
              xl={5}
            >
              <Box p={3}>
                <Typography
                  className="contact-us-heading"
                  variant="h4"
                  m={2}
                  color="initial"
                >
                  Contact Us
                </Typography>
                <Typography
                  variant="body1"
                  color="initial"
                  m={2}
                  className="contact-us-desc"
                >
                  If you have any questions or just need to have a chat, please
                  reach out.
                </Typography>
                <Box m={2} className="box-item">
                  <MessageIcon />
                  <Box>
                    <Typography
                      ml={1}
                      className="title"
                      variant="h6"
                      color="initial"
                    >
                      Email us
                    </Typography>
                    <Typography
                      ml={1}
                      className="desc"
                      variant="subtitle1"
                      color="initial"
                    >
                      Reach out to us at
                      <a href="mailto:legalEase@legal.uk" className="anchor">
                        legalEase@legal.uk
                      </a>
                    </Typography>
                  </Box>
                </Box>
                <Box m={2} className="box-item">
                  <LocationIcon />
                  <Box>
                    <Typography
                      ml={1}
                      className="title"
                      variant="h6"
                      color="initial"
                    >
                      Our Office
                    </Typography>
                    <Typography
                      ml={1}
                      className="desc"
                      variant="subtitle1"
                      color="initial"
                    >
                      Launch Lab, Franklin Building, <br /> 124 Goswell Rd.,
                      London EC1V 7DP
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={7} lg={7} xl={7}>
              <Box className="contact-us-right">
                <Box className="contact-us-form">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <Typography
                        mb={1}
                        variant="body1"
                        fontWeight={600}
                        color="initial"
                      >
                        First Name
                      </Typography>
                      <TextField
                        id="outlined-basic"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setFirstNameError(false);
                        }}
                        label=""
                        error={firstNameError}
                        helperText={
                          firstNameError ? "First name is required" : ""
                        }
                        placeholder="Enter your first name"
                        variant="standard"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <Typography
                        mb={1}
                        variant="body1"
                        fontWeight={600}
                        color="initial"
                      >
                        Last Name
                      </Typography>
                      <TextField
                        id="outlined-basic"
                        label=""
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);

                          setLastNameError(false);
                        }}
                        error={lastNameError}
                        helperText={
                          lastNameError ? "Last Name is required" : ""
                        }
                        placeholder="Enter your last name"
                        variant="standard"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid mt={3} container spacing={2}>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <Typography
                        mb={1}
                        variant="body1"
                        fontWeight={600}
                        color="initial"
                      >
                        Email
                      </Typography>
                      <TextField
                        id="outlined-basic"
                        label=""
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(false);
                        }}
                        error={emailError}
                        helperText={
                          emailError ? "Email is required or invalid" : ""
                        }
                        variant="standard"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <Typography
                        mb={1}
                        variant="body1"
                        fontWeight={600}
                        color="initial"
                      >
                        Phone Number
                      </Typography>
                      <InputMask
                        mask="+44 9999 999999"
                        maskChar=""
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneError(false);
                        }}
                        placeholder="+44 1234 567890"
                        value={phone}
                      >
                        {(inputProps) => (
                          <TextField
                            error={phoneError}
                            placeholder="+44 1234 567890"
                            helperText={
                              phoneError ? "Phone Number is required" : ""
                            }
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
                            variant="standard"
                            fullWidth
                          />
                        )}
                      </InputMask>
                    </Grid>
                  </Grid>
                </Box>

                <Box mt={3}>
                  <Typography
                    mb={1}
                    variant="body1"
                    fontWeight={600}
                    color="initial"
                  >
                    Message
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label=""
                    placeholder="Please provide a short description of your legal case."
                    variant="outlined"
                    className="text-area"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsDescriptionError(false);
                    }}
                    error={isDescriptionError}
                    helperText={isDescriptionError ? "Message is required" : ""}
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Box>
                <Box className="contact-us-btn-wrapper" mt={3}>
                  <Box className="submit-btn-box">
                    <LoadingButton
                      loading={isBtnLoading}
                      variant="contained"
                      color="primary"
                      className={
                        isBtnLoading
                          ? "contact-us-btn-loading"
                          : "contact-us-btn"
                      }
                      onClick={() => {
                        contactUsFormValidation();
                      }}
                    >
                      Submit
                    </LoadingButton>
                    <Typography
                      variant="body1"
                      className="contact-us-btn-right-desc"
                      color="initial"
                    >
                      By pressing the submit button, I agree to LegalEase contacting
                      me by email and/or phone. I also understand that any
                      information I&apos;ve shared in this form is subject to
                      LegalEase&apos;s Privacy Policy.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <MessageModal
        open={feedbackDoneModal}
        onClose={setFeedbackDoneModal}
        title="Thank you for contacting us"
        content="We will get back to you shortly"
      />
    </>
  );
};

export default ContactForm;
