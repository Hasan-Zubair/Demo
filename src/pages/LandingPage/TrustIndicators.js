import { Box, Grid, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import React from "react";
import barLogo from "../../assets/LandingPage/barLogo.png";
import registerLogo from "../../assets/LandingPage/registerLogo.png";
import solicitorLogo from "../../assets/LandingPage/solictorLogo.png";
import { ReactComponent as DocumentIcon } from "../../assets/documentIcon.svg";
import { ReactComponent as EmploymentLaw } from "../../assets/employment-law-icon.svg";
import { ReactComponent as TelegramIcon } from "../../assets/telegramIcon.svg";

import "./TrustIndicators.scss";

const TrustIndicators = () => {

  return (
    <Container className="fit-to-screen1">
      <Box className="feature-section-wrapper1">
        <Typography
          variant="h4"
          color="initial"
          // mt={3}
          className="feature-heading"
        >
          Why choose LegalEase?
        </Typography>

        <Grid className="feature-items-wrapper"  mt={3} container>
          <Grid className="featureItem" xs={12} sm={12} md={4} lg={4}>
            <Box className="feature-item-icon">
              <EmploymentLaw style={{ width: "80px", height: "80px" }} />
            </Box>
            <Typography
              variant="h5"
              color="initial"
              className="feature-item-heading no-wrap"
            >
              Connect with expert lawyers specialised in your case for free.
            </Typography>
          </Grid>

          <Grid className="featureItem" xs={12} sm={12} md={4} lg={4}>
            <Box className="feature-item-icon">
              <TelegramIcon style={{ width: "80px", height: "80px" }} />
            </Box>
            <Typography
              variant="h5"
              color="initial"
              textAlign="center"
              className="feature-item-heading no-wrap"
            >
              Simple process with no obligation.
            </Typography>
          </Grid>

          <Grid className="featureItem" xs={12} sm={12} md={4} lg={4}>
            <Box className="feature-item-icon">
              <DocumentIcon style={{ width: "80px", height: "80px" }} />
            </Box>
            <Typography
              variant="h5"
              color="initial"
              className="feature-item-heading no-wrap"
            >
              Secure software to save and retrieve all your documents.
            </Typography>
          </Grid>
        </Grid>
        <Grid className="feature-items-wrapper"  mt={6} container>
          <Grid className="featureItem" xs={12} sm={12} md={4} lg={4}>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading-affiliate no-wrap"
            >
              Registered with:
            </Typography>
            <Box mt={4}>
              <img src={registerLogo} alt="ico Logo" style={{ width: "7em" }} />
            </Box>
          </Grid>

          <Grid className="featureItem" xs={12} sm={12} md={4} lg={4}>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading-affiliate no-wrap"
            >
              All Solicitors regulated by:
            </Typography>
            <Box mt={4}>
              <img
                src={solicitorLogo}
                alt="Solicitor Logo"
                style={{ width: "15em" }}
              />
            </Box>
          </Grid>

          <Grid className="featureItem" xs={12} sm={12} md={4} lg={4}>
            <Typography
              variant="h6"
              color="initial"
              className="feature-item-heading-affiliate no-wrap"
            >
              All Barristers regulated by:
            </Typography>
            <Box mt={4}>
              <img
                src={barLogo}
                alt="Barristers Logo"
                style={{ width: "12em" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TrustIndicators;
