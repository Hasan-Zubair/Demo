import { Box, Container, Backdrop, Fade, Modal } from "@mui/material";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ReactComponent as NextArrowIcon } from "../../assets/nextArrow.svg";
import caseDashboard from "../../assets/onboard images/Case_dashboard.jpeg";
import mainDashboard from "../../assets/onboard images/Main_Dashboard.png";
import { ReactComponent as PrevArrowIcon } from "../../assets/backArrow.svg";
import "../HelpCarousel/HelpCarousel.scss";

// Define the custom arrow components outside the HelpCarousel component
function CustomArrowNext({ onClick, direction }) {
  return (
    <NextArrowIcon
      style={{ marginTop: "21%", width: "50", height: "auto" }}
      className={`carousel-arrow control-arrow custom-arrow-quote  control-next carousel-arrow-${direction}`}
      onClick={onClick}
    />
  );
}

function CustomArrowPrev({ onClick, direction }) {
  return (
    <PrevArrowIcon
      style={{ marginTop: "22%", width: "50", height: "auto" }}
      className={`carousel-arrow control-arrow custom-arrow-quote  control-prev carousel-arrow-${direction}`}
      onClick={onClick}
    />
  );
}

export default function HelpCarousel({ opened, setOpened }) {
  const handleClose = () => setOpened(false);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={opened}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={opened}>
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100%",
            }}
          >
            <Carousel
              showIndicators={false}
              showStatus={false}
              showArrows={window.innerWidth < 500 ? false : true}
              infiniteLoop={true}
              showThumbs={false}
              renderArrowNext={(onClickHandler) => (
                <CustomArrowNext onClick={onClickHandler} direction="next" />
              )}
              renderArrowPrev={(onClickHandler) => (
                <CustomArrowPrev onClick={onClickHandler} direction="prev" />
              )}
            >
              <Box>
                <img src={mainDashboard} alt="Main Dashboard" />
              </Box>
              <Box>
                <img src={caseDashboard} alt="Case dashboard" />
              </Box>
            </Carousel>
          </Container>
        </Fade>
      </Modal>
    </div>
  );
}
