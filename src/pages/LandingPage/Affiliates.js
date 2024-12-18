import React from "react";
import { Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { ReactComponent as NextArrowIcon } from "../../assets/next-quote-icon.svg";
import { ReactComponent as PrevArrowIcon } from "../../assets/prev-quote-icon.svg";
import cityLaunchLab from "../../assets/affiliations/cityLaunchLab.png";
import msStartup from "../../assets/affiliations/msForStartup.png";
import barclays from "../../assets/LandingPage/Barclays.png";

import "./QuoteSection.scss";

const Affiliates = () => {
  const companyLogos = {
    lawtech:
      "https://lawtechuk.io/wp-content/themes/lawtechuk/assets/images/logo-dark.svg",
  };

  return (
    <>
      <Box mb={3}>
        <Container
          className="custom-container minWidth set-viewport img-wrapper"
        >
          <Box className="frequently-asked-questions-wrapper">
            <Typography
              mt={5}
              mb={6}
              variant="h4"
              className="faq-heading-main"
              color="initial"
            >
              Affiliated with
            </Typography>
          </Box>
        </Container>

        <Container sx={{ paddingBottom: "30px" }}>
          <Box
            mt={3}
            // ml={10}
            sx={{
              display: { xs: "grid", lg: "flex" },
              alignItems: "center",
              justifyContent: { xs: "center", lg: "space-between" },
            }}
          >
            <Box sx={{ margin: { xs: "10px 0", lg: "0px" }, display:"flex", justifyContent:"center" }}>
              <img
                src={companyLogos.lawtech}
                alt="lawtech"
                style={{ width: "170px" }}
              />
            </Box>
            <Box sx={{ margin: { xs: "10px 0", lg: "0px" }, display:"flex", justifyContent:"center"  }}>
              <img
                src={cityLaunchLab}
                alt="launchLabCity"
                style={{ width: "170px" }}
              />
            </Box>
            <Box sx={{ marginBottom: { xs: "10px 0", lg: "0px" }, paddingTop:{xs:"20px", lg:"0px"}, display:"flex", justifyContent:"center"  }}>
              <img src={barclays} alt="barclays" style={{ width: "270px" }} />
            </Box>
            <Box sx={{ marginBottom: { xs: "10px 0", lg: "0px" }, paddingTop:{xs:"30px", lg:"0px"}, display:"flex", justifyContent:"center"  }}>
              <img
                src={msStartup}
                alt="microsoft for startups"
                style={{ width: "200px" }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Affiliates;
