import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import WaveSurfer from "wavesurfer.js";
import { Box } from "@mui/material";
import { ReactComponent as PlayBtn } from "../../assets/playBtn.svg";
import { ReactComponent as PauseBtn } from "../../assets/pauseBtn.svg";
import { ReactComponent as AudioIcon } from "../../assets/audio-icon.svg";

import "./style.scss";

const Player = ({ audioURL }) => {
  const [recordedAudioTime, setRecordedAudioTime] = useState("");
  const [waveSurferObj, setWaveSurferObj] = useState(null);
  const [playingState, setPlayingState] = useState(false);

  useEffect(() => {
    setWaveSurferObj(null);
    if (audioURL) {
      const waveContainer = document.querySelector("#waveform");
      while (waveContainer.firstChild) {
        waveContainer.removeChild(waveContainer.firstChild);
      }
      const waveSurfer = WaveSurfer.create({
        container: waveContainer,
        waveColor: "#C5C5C5",
        progressColor: "#008083",
        barWidth: 3,
        barHeight: 1,
        barGap: 10,
        height: 72,
        hideScrollbar: true,
        barMinHeight: 1,
      });
      waveSurfer.load(audioURL);

      waveSurfer.on("ready", function () {
        setWaveSurferObj(waveSurfer);
      });
      setRecordedAudioTime({
        total: Math.round(waveSurfer.getDuration()),
        current: Math.round(waveSurfer.getCurrentTime()),
      });
      waveSurfer.on("audioprocess", function () {
        setRecordedAudioTime({
          total: Math.round(waveSurfer.getDuration()),
          current: Math.round(waveSurfer.getCurrentTime()),
        });
      });
      waveSurfer.on("finish", function () {
        setPlayingState(false);
      });
      console.log("called");
    }
  }, [audioURL]);

  const handlePlayPause = () => {
    if (waveSurferObj) {
      setPlayingState(!playingState);
      waveSurferObj.playPause();
    }
  };

  const toHHMM = (mints) => {
    var hours = Math.floor(mints / 60);
    var minutes = mints % 60;
    return (
      hours.toString().padStart(1, "0") +
      ":" +
      minutes.toString().padStart(2, "0")
    );
  };

  return (
    <Box className="audio-voice-rec-wrapper">
      <Box className="audio-box-header">
        <AudioIcon /> &nbsp; Voice Recording
      </Box>

      <Box className="audio-box">
        {audioURL && (
          <Box className="recoded-audio">
            <div className="control" onClick={handlePlayPause}>
              {playingState ? <PauseBtn /> : <PlayBtn />}
            </div>
            <div id="waveform"></div>
            <div className="time">
              {toHHMM(recordedAudioTime.current)}/
              {toHHMM(recordedAudioTime.total)}
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
};

Player.propTypes = {
  audioURL: PropTypes.string,
};

export default Player;
