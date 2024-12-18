import React from "react";
import "./PhoneVerification.scss";
import { Box, Container, Typography, Button, TextField } from "@mui/material";
import { ReactComponent as Logo } from "../../assets/nav-vera-icon.svg";
import { InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
const PhoneVerification = () => {
  const navigate = useNavigate();
  return (
    <Box className="phone-verification-wrapper">
      <Box className="phone-verification-screen-top-logo">
        <Logo />
      </Box>
      <Container
        className="phone-verification-screen-container"
        maxWidth="md"
        sx={{ backgroundColor: "white" }}
      >
        <Box className="phone-verification-form-wrapper">
          <Typography
            className="phone-verification-heading"
            variant="h4"
            color="initial"
          >
            Phone Verification
          </Typography>

          <Typography
            variant="body1"
            className="phone-verification-para"
            color="initial"
            my={2}
          >
            Please enter 6-digit number you’ve received on your phone number
          </Typography>

          <Box mt={1}>
            <Typography mb={1} variant="body1" color="initial">
              Enter Phone
            </Typography>
            <TextField
              className="phone-verification-form-input"
              id="outlined-basic"
              label=""
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button className="input-btn" variant="contained">
                      Send OTP
                    </Button>
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your phone number "
              variant="outlined"
              size="medium"
              fullWidth
            />
          </Box>
          <Box mt={3}>
            <Typography mb={1} variant="body1" color="initial">
              Phone Verification
            </Typography>
            <TextField
              className="phone-verification-form-input"
              id="outlined-basic"
              placeholder="Enter 6 digit number"
              label=""
              variant="outlined"
              size="medium"
              fullWidth
            />
          </Box>

          <Box mt={3}>
            <Button
              className="phone-verification-form-button"
              variant="contained"
              size="large"
              fullWidth
              onClick={() => {
                navigate("/login");
              }}
            >
              Confirm
            </Button>
          </Box>
          <Typography
            variant="body1"
            my={2}
            className="last-para"
            color="initial"
          >
            Haven't received message ? <span>Resend</span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PhoneVerification;
