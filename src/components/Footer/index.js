import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import "./Footer.scss";
import PrivacyPolicyFile from "../../assets/Privacy&TermsFiles/PrivacyPolicy.pdf";
import { ReactComponent as VeraLogo } from "../../assets/LegalEase.svg";
import { ReactComponent as RedirectArrow } from "../../assets/redirect-arrow.svg";
import TermsAndConditionsFile from "../../assets/Privacy&TermsFiles/TermsAndConditions.pdf";
import { useNavigate } from "react-router-dom";
import linkedinIcon from "../../assets/socialIcons/linkedin.png"
import facebookIcon from "../../assets/socialIcons/facebook.png"
import instagramIcon from "../../assets/socialIcons/instagram.png"
import twitterIcon from "../../assets/socialIcons/twitter.png"
import cityLaunchLab from "../../assets/affiliations/cityLaunchLab.png"
import msStartup from "../../assets/affiliations/msForStartup.png"

import { useMediaQuery } from '@mui/material';

const Footer = () => {
  const navigate = useNavigate();
  const openFileInNewTab = (filePath) => {
    const newWindow = window.open(filePath, "_blank");
    if (newWindow) {
      newWindow.opener = null; // Prevent the opened tab from redirecting the parent window
    }
  };

  const isXsOrSm = useMediaQuery('(max-width: 1200px)');

  return (
    <>
      <Container className="footer-container custom-container">
        <Grid container mb={3} spacing={2}>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <VeraLogo />
            <Typography mt={1} variant="body1" color="initial">
              © 2023 LegalEase. All rights reserved.
            </Typography>
            <Typography
              variant="body1"
              mt={3}
              className="footer-atorney-link"
              color="initial"
              onClick={() => navigate("/signup")}
            >
              Join our attorney network 
              <RedirectArrow />
            </Typography>
          </Grid>

          <Grid className={`${isXsOrSm ? 'footer-list-responsive' : 'footer-list-exception'}`} item xs={12} sm={6} lg={2} xl={2}>
            <Typography
              className="footer-list-item-head"
              variant="subtitle1"
              color="initial"
              style={{marginBottom: "0.7rem"}}
            >
              Affiliations
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display="flex" 
              alignItems="center" 
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://lawtechuk.io/"
              target="_blank"
            >
                <img src="https://lawtechuk.io/wp-content/themes/lawtechuk/assets/images/logo-dark.svg" alt="lawtechuk" style={{ width: "100px"}} />
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display="flex" 
              alignItems="center" 
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.city.ac.uk/business/start/launch/launch-lab"
              target="_blank"
            >
                <img src={cityLaunchLab} alt="city-launch-lab" style={{ width: "95px", marginLeft: "-1px", marginBottom: "12px" }} />
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display="flex" 
              alignItems="center" 
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://labs.uk.barclays/"
              target="_blank"
            >
              <span>
              <img src="https://www.inclusivegrowthleeds.com/sites/default/files/2022-06/Barclays-ELs-primary-cyan-rgb%20%28002%29.png" alt="barclays-eagle-labs" style={{ width: "170px", marginLeft: "-12px", marginTop: "-17px" }} />
              </span>
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display="flex" 
              alignItems="center" 
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.microsoft.com/en-us/startups/"
              target="_blank"
            >
              <span>
              <img src={msStartup} alt="ms startup" style={{ width: "120px",  marginTop: "-17px" }} />
              </span>
            </Typography>
          </Grid>

          <Grid className="footer-list" item xs={12} sm={6} lg={2} xl={2}>
            <Typography
              className="footer-list-item-head"
              variant="subtitle1"
              color="initial"
            >
              Social
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display="flex" 
              alignItems="center" 
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.linkedin.com/company/veralegal/?viewAsMember=true"
              target="_blank"
            >
                <img src={linkedinIcon} alt="LinkedIn" style={{ marginRight: "8px" }} /> LinkedIn
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display="flex" 
              alignItems="center" 
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.instagram.com/veralegaluk/ "
              target="_blank"
            >
              <img src={instagramIcon} alt="LinkedIn" style={{ marginRight: "8px" }} /> Instagram
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              display="flex" 
              alignItems="center" 
              className="footer-list-item"
              color="initial"
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.facebook.com/veralegaluk"
              target="_blank"
            >
              <img src={facebookIcon} alt="LinkedIn" style={{ marginRight: "8px" }} /> Facebook
            </Typography>

            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display="flex" 
              alignItems="center" 
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://twitter.com/VeraLegalUk"
              target="_blank"
            >
              <img src={twitterIcon} alt="LinkedIn" style={{ marginRight: "8px" }} /> Twitter
            </Typography>
          </Grid>

          <Grid className="footer-list" item xs={12} sm={6} lg={2} xl={2}>
            <Typography
              variant="subtitle1"
              color="initial"
              className="footer-list-item-head"
            >
              Legal
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display={"block"}
              component={"a"}
              sx={{ textDecoration: "none", cursor: "pointer" }}
              onClick={() => navigate('/terms')}
            >
              Terms & Conditions
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display={"block"}
              component={"a"}
              sx={{ textDecoration: "none", cursor: "pointer" }}
              onClick={() => navigate('/privacy')}
            >
              Privacy Policy
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Footer;
