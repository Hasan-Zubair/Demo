import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import PlayCircleFilledOutlinedIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import PauseCircleFilledOutlinedIcon from "@mui/icons-material/PauseCircleFilledOutlined";
import { grey } from "@mui/material/colors";

import VeraVideo from "../../assets/LandingPage/vera-video.mp4";
import posterImage from "../../assets/LandingPage/thumb.png";

const Video = () => {
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
            sx={{
                maxWidth: 520,
                position: 'relative',
                marginX: 'auto',
                height: '100%',
                minHeight: 520,
                'span, video': {
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 92,
                    zIndex: 999,
                    cursor: 'pointer',
                },
                'video': {
                    zIndex: 10,
                },
                ".pause": {
                    opacity: 0,
                },
                "&:hover": {
                    ".pause": {
                        opacity: 1,
                    },
                }
            }}
        >
            {!isVidePlaying ? (
                <span onClick={() => handlePlayVideo()}>
                    <PlayCircleFilledOutlinedIcon fontSize="inherit" sx={{ color: grey[50] }} />
                </span>
            ) : (
                <span className="pause" onClick={() => handlePauseVideo()}>
                    <PauseCircleFilledOutlinedIcon fontSize="inherit" sx={{ color: grey[50] }} />
                </span>
            )}

            <video ref={vidRef} width="100%" poster={posterImage} style={{ aspectRatio: '1/1', objectFit: 'cover' }}>
                <source src={VeraVideo} type="video/mp4" />
                Sorry, your browser doesn't support videos.
            </video>
        </Box>
    )
}

export default Video
