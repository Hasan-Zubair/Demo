import React from "react";
import Container from "@mui/material/Container";
import { Button, Typography, Grid } from "@mui/material";

import "./LandingPageCtaSec.scss";
import { useNavigate } from "react-router-dom";
import { ReactComponent as VoiceIcon } from "../../assets/voice-icon.svg";

const LandingPageCtaSec = () => {
  const navigate = useNavigate();
  return (
    <Container className="custom-container" >
      <Grid container className="landing-page-cta-sec-wrapper">
        <Grid item className="cta-text" lg={9} xl={9} md={9} sm={12} xs={12}>
          <Typography
            variant="h4"
            fontFamily="Tomato Grotesk"
            fontWeight={600}
            color="initial"
          >
            Start for free now
          </Typography>
          <Typography variant="body1" className="cta-sec-col" color="initial">
            Join countless people nationwide using Vera
          </Typography>
        </Grid>
        <Grid item className="cta-btns" lg={3} xl={3} md={3} sm={12} xs={12}>
          <Button
            className="cta-btn-voice"
            onClick={() => navigate("/onboarding/0")}
            variant="contained"
            color="primary"
          >
            Get Started
          </Button>
          <Button
            className="cta-btn-voice"
            onClick={() => navigate("/onboarding/0?selectedOption=voice-memo")}
            variant="contained"
            color="primary"
          >
            Tell Us <VoiceIcon />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPageCtaSec;
