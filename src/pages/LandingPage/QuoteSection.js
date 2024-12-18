import React from "react";
import { Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { ReactComponent as NextArrowIcon } from "../../assets/next-quote-icon.svg";
import { ReactComponent as PrevArrowIcon } from "../../assets/prev-quote-icon.svg";
import cityLaunchLab from "../../assets/affiliations/cityLaunchLab.png"
import msStartup from "../../assets/affiliations/msForStartup.png"
import barclays from "../../assets/LandingPage/Barclays.png"

import "./QuoteSection.scss";

const QuoteSection = () => {
  function CustomArrowNext({ onClick, direction }) {
    return (
      <NextArrowIcon
        className={`carousel-arrow control-arrow custom-arrow-quote  control-next carousel-arrow-${direction}`}
        onClick={onClick}
      />
    );
  }
  function CustomArrowPrev({ onClick, direction }) {
    return (
      <PrevArrowIcon
        className={`carousel-arrow control-arrow custom-arrow-quote  control-prev carousel-arrow-${direction}`}
        onClick={onClick}
      />
    );
  }

  const companyLogos = {
    lawtech: "https://lawtechuk.io/wp-content/themes/lawtechuk/assets/images/logo-dark.svg",
  };

  return (
    <>
      <Box className="quote-section-wrapper" mb={3}> 
        <Container className="quote-section-container ">
          <Carousel
            showIndicators={false}
            showStatus={false}
            showArrows={window.innerWidth < 500 ? false : true}
            infiniteLoop={true}
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <CustomArrowNext onClick={onClickHandler} direction="next" />
              )
            }
            renderArrowPrev={(onClickHandler, hasNext, label) =>
              hasNext && (
                <CustomArrowPrev onClick={onClickHandler} direction="prev" />
              )
            }
          >
            <Box className="quote-section-box">
              <Typography
                variant="h6"
                color="initial"
                mt={2}
                className="quote-text"
              >
                “The team was able to answer all my questions smoothly and being respectful of my circumstances."
              </Typography>

              <Box mt={3} className="quote-icon">
                <Typography
                  mt={2}
                  variant="body1"
                  color="initial"
                  className="quote-name"
                >
                  Anonymous
                </Typography>
              </Box>
            </Box>
            <Box className="quote-section-box">
              <Typography variant="h6" color="initial" className="quote-text">
                “I like how I can just log in and see progress, instead of calling multiple times or trying to get a hold of my lawyer."
              </Typography>

              <Box mt={3} className="quote-icon">
                <Typography
                  mt={2}
                  variant="body1"
                  color="initial"
                  className="quote-name"
                >
                  Andrew
                </Typography>
              </Box>
            </Box>
            <Box className="quote-section-box">
              <Typography variant="h6" color="initial" className="quote-text">
                "Needed legal advice on an urgent basis and tried Vera which was very easy to use."
              </Typography>

              <Box mt={3} className="quote-icon">
                <Typography
                  mt={2}
                  variant="body1"
                  color="initial"
                  className="quote-name"
                >
                  Sarah
                </Typography>
              </Box>
            </Box>
          </Carousel>
          
        </Container>

      </Box>
    </>
  );
};

export default QuoteSection;
