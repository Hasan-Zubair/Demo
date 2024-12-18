import React, { useState, useEffect } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import WaveSurfer from "wavesurfer.js";
import { Box } from "@mui/material";
import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import VeraButton from "../../components/VeraButton";
import Visualizer from "./Visualizer";
import { ReactComponent as PlayBtn } from "../../assets/playBtn.svg";
import { ReactComponent as PauseBtn } from "../../assets/pauseBtn.svg";
import { ReactComponent as AudioIcon } from "../../assets/audio-icon.svg";
import { ReactComponent as Trash } from "../../assets/trash-2.svg";
import PropTypes from "prop-types";

import "./styles.scss";

const Recorder = ({ recordedAudio }) => {
  const [isShowRecordedAudio, setIsShowRecordedAudio] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [recordedAudioTime, setRecordedAudioTime] = useState("");
  const [waveSurferObj, setWaveSurferObj] = useState(null);
  const [playingState, setPlayingState] = useState(false);

  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    recordingTime,
  } = useAudioRecorder();

  useEffect(() => {
    setIsShowRecordedAudio(false);
    if (recordingBlob) {
      const url = URL.createObjectURL(recordingBlob);
      setRecordedAudioURL(url);
      recordedAudio(recordingBlob);
      setIsShowRecordedAudio(true);
    }
  }, [recordingBlob]);

  useEffect(() => {
    setWaveSurferObj(null);
    if (recordedAudioURL && isShowRecordedAudio) {
      const waveContainer = document.querySelector("#waveform");
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
      waveSurfer.load(recordedAudioURL);
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
    }
  }, [recordedAudioURL]);

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
        {isRecording && (
          <div style={{ marginLeft: "auto" }}>{toHHMM(recordingTime)}</div>
        )}
        {isShowRecordedAudio && (
          <IconButton
            style={{ marginLeft: "auto" }}
            onClick={() => {
              setIsShowRecordedAudio(false);
              recordedAudio(null);
              waveSurferObj.pause();
              setPlayingState(false);
            }}
          >
            <Trash width={16} />
          </IconButton>
        )}
      </Box>

      <Box className="audio-box">
        {!isShowRecordedAudio && (
          <Box className="recoding">
            <VeraButton
              variant="contained"
              icon={isRecording ? <StopRoundedIcon /> : <MicIcon />}
              onClick={isRecording ? stopRecording : startRecording}
              danger={isRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </VeraButton>
            <Visualizer isRecording={isRecording} />
            {/* <img className="soundWave" src={soundWave} alt="soundWave" /> */}
          </Box>
        )}
        {isShowRecordedAudio && (
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

Recorder.propTypes = {
  recordedAudio: PropTypes.object,
};

export default Recorder;
