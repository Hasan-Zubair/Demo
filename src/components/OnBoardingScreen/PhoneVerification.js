import { Modal } from "@mui/base";
import {
  Backdrop,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import OtpInput from "react-otp-input";
import { useState } from "react";
import MessageModal from "../../common/MessageModal";

function PhoneVerification({
  open,
  setOpen,
  phone,
  setPhoneVerify,
  setCountdownInProgress,
}) {
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  const handleClose = () => {
    setOpen(false);
    setOtp("");
  };

  const verifyOTP = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}api/auth/verification-otp/`, {
        phone,
        otp,
      })
      .then((response) => {
        setPhoneVerify(true);
        setCountdownInProgress(false);
        setModalContent({
          title: "Verified",
          description: "OTP verification process successfully done.",
        });
        setIsModalOpen(true);
        setOpen(false);
        setOtp("");
      })
      .catch((error) => {
        setOtp("");
        setModalContent({
          title: "Error",
          description: "OTP verification failed",
        });
        setIsModalOpen(true);
      });
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Container
          sx={{
            zIndex: "99999 !important",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            boxShadow: 24,
            p: 2,
            width: "365px",
          }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "center" }}
            >
              <Typography>
                <h1>Phone verification</h1>
              </Typography>
              <Typography>
                <p>
                  Please enter the verification code that was sent to your phone
                  number.
                </p>
              </Typography>
              <Grid container spacing={2} style={{ justifyContent: "center" }}>
                <Grid
                  item
                  m={2}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={5}
                    inputType="tel"
                    inputStyle={{ width: 40, height: 40, fontSize: 20 }}
                    renderSeparator={<span> - </span>}
                    renderInput={(props) => <input {...props} />}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={8}>
                  <Button variant="contained" onClick={verifyOTP} fullWidth>
                    Verify code
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Modal>
      <MessageModal
        open={isModalOpen}
        onClose={setIsModalOpen}
        content={modalContent.description}
        title={modalContent.title}
        error={false}
      />
    </>
  );
}

export default PhoneVerification;
