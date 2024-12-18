import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import "./Footer.scss";
import PrivacyPolicyFile from "../..//assets/Privacy&TermsFiles/PrivacyPolicy.pdf";
import { ReactComponent as VeraLogo } from "../../assets/vera-footer-icon.svg";
import TermsAndConditionsFile from "../..//assets/Privacy&TermsFiles/TermsAndConditions.pdf";
import { useNavigate } from "react-router-dom";

const FooterWP = () => {
  const navigate = useNavigate();
  const openFileInNewTab = (filePath) => {
    const newWindow = window.open(filePath, "_blank");
    if (newWindow) {
      newWindow.opener = null; // Prevent the opened tab from redirecting the parent window
    }
  };

  const location = window.location.href;
  const blogLocation = location === 'https://app.veralegal.uk/footer/public-footer' ? 'https://app.veralegal.uk' : '';
  const navigationURL = (url) => {
    if (blogLocation) {
      window.open(blogLocation + url, '_blank');
    } else {
      navigate(url)
    }
  }

  return (
    <>
      <Container className="footer-container custom-container">
        <Grid container mb={3} spacing={2}>
          <Grid item xs={12} sm={6} lg={4} xl={8}>
            <VeraLogo />
            <Typography mt={1} variant="body1" color="initial">
              © 2023 LegalEase. All rights reserved.
            </Typography>
            {/* <Typography
              variant="body1"
              mt={3}
              className="footer-atorney-link"
              color="initial"
              // onClick={() => navigate("/signup")}
            >
              Join our attorney network <RedirectArrow />
            </Typography> */}
          </Grid>
          <Grid className="footer-list" item xs={6} sm={6} lg={4} xl={2}>
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
              display={"block"}
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.linkedin.com/company/veralegal/?viewAsMember=true"
              target="_blank"
            >
              LinkedIn
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display={"block"}
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.instagram.com/veralegaluk/ "
              target="_blank"
            >
              Instagram
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              display={"block"}
              className="footer-list-item"
              color="initial"
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://www.facebook.com/veralegaluk"
              target="_blank"
            >
              Facebook
            </Typography>

            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display={"block"}
              component={"a"}
              sx={{ textDecoration: "none" }}
              href="https://twitter.com/VeraLegalUk"
              target="_blank"
            >
              Twitter
            </Typography>
          </Grid>

          <Grid className="footer-list" item xs={6} sm={6} lg={4} xl={2}>
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
              onClick={() => navigationURL('/terms')}
            >
              Terms
            </Typography>
            <Typography
              mt={1}
              variant="body1"
              className="footer-list-item"
              color="initial"
              display={"block"}
              component={"a"}
              sx={{ textDecoration: "none", cursor: "pointer" }}
              onClick={() => navigationURL('/privacy')}
            >
              Privacy
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default FooterWP;
