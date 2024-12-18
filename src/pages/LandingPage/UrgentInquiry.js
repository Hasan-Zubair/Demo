import React, { useState } from "react";
import "./UrgentInquiry.scss";
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

const UrgentInquiry = () => {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState(",");
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
      setLastNameError(true);
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
              style={{display:'flex', alignItems:'center'}}
              item
              xs={12}
              sm={6}
              md={5}
              lg={5}
              xl={5}
            >
              
                <Box>

                <Typography
                  className="contact-us-heading"
                  variant="h4"
                  m={2}
                  color="initial"
                >
                  Do you have an urgent inquiry?
                </Typography>
                <Typography
                  variant="body1"
                  color="initial"
                  m={2}
                  className="contact-us-desc"
                >
                  Fill out the form, and we will connect with you shortly
                </Typography>
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
                        Name
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
                          firstNameError ? "name is required" : ""
                        }
                        placeholder="Enter your name"
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
                    Message
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label=""
                    placeholder="Please provide a short description"
                    variant="outlined"
                    // className="text-area"
                    style={{ background: '#F7F7F7'}}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsDescriptionError(false);
                    }}
                    error={isDescriptionError}
                    helperText={isDescriptionError ? "Message is required" : ""}
                    multiline
                    rows={0}
                    fullWidth
                  />
                    </Grid>
                  </Grid>
                </Box>

                <Box className="contact-us-btn-wrapper" mt={3}>
                  <Box className="submit-btn-box" style={{display:"flex", alignItems:"center"}}>
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
                      style={{marginLeft:"10px", color: "grey"}}
                    >
                      By pressing the submit button, I agree to Vera contacting
                      me terms and condition
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

export default UrgentInquiry;
