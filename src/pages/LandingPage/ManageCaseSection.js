import React from "react";
import Container from "@mui/material/Container";
import { Box, Typography } from "@mui/material";
import Img from "../../assets/dummyContent.png";
import { ReactComponent as LinePattern } from "../../assets/green-line-pattern.svg";

import { ReactComponent as MobileImg } from "../../assets/mobile-img-mob-view.svg";
import mobileImg from "../../assets/iPhone 14.png";
import tabImage from "../../assets/tab image.png";

import "./ManageCaseSection.scss";

const ManageCaseSection = () => {
  return (
    <Container p={4} mt={5} mb={5} className="custom-container setWidthMCS">
      <Box className="manage-case-section-wrapper">
        <Typography variant="h4" color="initial" className="manage-heading">
          Manage your case with ease online
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          className="manage-para"
          m={3}
          color="initial"
        >
          Vera allows you to manage your case online. Speak to your lawyer,
          manage documents and monitor progress at the touch of a button.
        </Typography>
        <Box className="manage-case-section-img">
          <Box className="manage-case-section-img-item-mob">
            <LinePattern className="line-pattern" />
            <img src={mobileImg} alt="device" />
          </Box>

          <Box className="manage-case-section-img-item">
            <LinePattern className="line-pattern-right-top" />
            <LinePattern className="line-pattern-left-bottom" />
            <Box className="device-img">
              <img src={tabImage} alt="device" className="tab-img" />
              <img src={mobileImg} alt="device" className="mobile-img" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ManageCaseSection;
