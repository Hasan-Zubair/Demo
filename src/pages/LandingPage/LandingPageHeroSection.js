import React from "react";
import Container from "@mui/material/Container";
import "./LandingPageHeroSection.scss";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import coverImg from "../../assets/hero-image.jpeg";
import { ReactComponent as LinePattern } from "../../assets/green-line-pattern.svg";
import { ReactComponent as VoiceIcon } from "../../assets/voice-icon.svg";

// import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPageHeroSection = () => {
  const navigate = useNavigate();
  return (
    <Box className="hero-box-wrapper1" sx={{ md: { paddingBottom: "2rem" } }} mb={3}>
      <Container className="hero-section-wrapper custom-container setWidth" >
        <Grid container className="hero-item-wrapper res">
          <Grid item md={12} lg={6} xl={6} sm={12} xs={12}>
            <Typography variant="h1" className="hero-heading " style={{color:'white'}}>
              We connect you with expert lawyers for free
            </Typography>
            <Typography
              mt={2}
              variant="h2"
              style={{color:'white'}}
              className="hero-para"
            >
              Unlock the legal expertise you need without any cost. Whether you
              have questions, need advice, or require representation.
            </Typography>
            <Box mt={2} sx={{display:"flex", alignItems:{xs:"top", md:"center"}}}>
              <Button
                variant="contained"
                style={{ marginRight: "10px", color: "#006766", backgroundColor:"white"}}
                sx={{width:{xs:"50%", md:"fit-content"}}}
                onClick={() => {
                  localStorage.clear();
                  navigate("/onboarding/0");
                }}
              >
                Get Started
              </Button>
              <Typography variant="body2" style={{color:'white'}}>
                Get started with a free no-obligation chat
              </Typography>
            </Box>
          </Grid>
          {/* <Grid
            p={3}
            className="hero-item-img img-wrapper"
            item
            md={12}
            lg={6}
            xl={6}
            sm={12}
            xs={12}
            textAlign={"right"}
          >
            <img
              src={coverImg}
              style={{ borderRadius: "30% 0 0 0" }}
              width={"90%"}
              alt="hero"
              className="widthForZoomIn"
            />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPageHeroSection;
