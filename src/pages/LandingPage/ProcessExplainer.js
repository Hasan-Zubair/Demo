import React, { useRef, useState } from "react";
import "./ProcessExplainer.scss";
import Container from "@mui/material/Container";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { AiFillPlayCircle } from "react-icons/ai";
import { AiFillPauseCircle } from "react-icons/ai";
import PlayCircleFilledOutlinedIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import PauseCircleFilledOutlinedIcon from "@mui/icons-material/PauseCircleFilledOutlined";
import { grey } from "@mui/material/colors";

import { ReactComponent as LinePattern } from "../../assets/green-line-pattern.svg";
import VeraVideo from "../../assets/LandingPage/vera-video.mp4";
import posterImage from "../../assets/LandingPage/thumb.png";

const ProcessExplainer = () => {
  const vidRef = useRef(null);
  const [isVidePlaying, setIsVideoPlaying] = useState(false);
  const handlePlayVideo = () => {
    vidRef.current.play();
    setIsVideoPlaying(true);
  };
  const handlePauseVideo = () => {
    vidRef.current.pause();
    setIsVideoPlaying(false);
  };
  return (
    <Box
      id="process"
      className="process-explainer-main-box set-viewport img-wrapper fit-to-screen"
    >
      <Container className="process-explainer-wrapper custom-container">
        <Grid container className="col-reverse">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={6}
            className="process-explainer-item-boxes"
          >
            <Typography
              variant="h4"
              fontFamily="Tomato Grotesk"
              color="initial"
              fontWeight={600}
            >
              How it works
            </Typography>
            <Stack flexDirection="column" spacing={2} marginTop={3}>
              <Box className="process-explainer-item-box">
                <Typography
                  variant="body1"
                  className="step-head"
                  color="initial"
                >
                  STEP 1
                </Typography>
                <Typography
                  mt={1}
                  mb={1}
                  className="sub-step"
                  variant="h6"
                  color="initial"
                >
                  Share Your Case
                </Typography>
                <Typography
                  variant="body1"
                  className="step-para"
                  color="initial"
                >
                  Click "Get Started" or fill out the form to provide details
                  about your case.
                </Typography>
              </Box>

              <Box className="process-explainer-item-box">
                <Typography
                  variant="body1"
                  className="step-head"
                  color="initial"
                >
                  STEP 2
                </Typography>
                <Typography
                  mt={1}
                  mb={1}
                  className="sub-step"
                  variant="h6"
                  color="initial"
                >
                  We Connect With You
                </Typography>
                <Typography
                  variant="body1"
                  className="step-para"
                  color="initial"
                >
                  We'll reach out to learn more about your issue before
                  referring it to a specialized lawyer.
                </Typography>
              </Box>

              <Box className="process-explainer-item-box">
                <Typography
                  variant="body1"
                  className="step-head"
                  color="initial"
                >
                  STEP 3
                </Typography>
                <Typography
                  mt={1}
                  mb={1}
                  className="sub-step"
                  variant="h6"
                  color="initial"
                >
                  Connect With Your Lawyer
                </Typography>
                <Typography
                  variant="body1"
                  className="step-para"
                  color="initial"
                >
                  Receive a message and a quotation from your suggested lawyer.
                  Decide if you'd like to accept it or not.
                </Typography>
              </Box>

            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={6}
            className="process-explainer-item-img-box"
          >
            <Box className="process-explainer-item-video">
              <LinePattern className="line-pattern-process-explainer" />
              {!isVidePlaying ? (
                <span onClick={() => handlePlayVideo()}>
                  <PlayCircleFilledOutlinedIcon sx={{ color: grey[50] }} />

                  {/* <AiFillPlayCircle /> */}
                </span>
              ) : (
                <span onClick={() => handlePauseVideo()}>
                  <PauseCircleFilledOutlinedIcon sx={{ color: grey[50] }} />

                  {/* <AiFillPauseCircle /> */}
                </span>
              )}

              <video ref={vidRef} width="100%" poster={posterImage}>
                <source src={VeraVideo} type="video/mp4" />
                Sorry, your browser doesn't support videos.
              </video>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProcessExplainer;
