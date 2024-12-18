import React, { useEffect, useRef } from "react";

const Visualizer = ({ isRecording }) => {
  const audioContextRef = useRef(null);
  const visualMainElementRef = useRef(null);
  const visualElementsRef = useRef([]);
  const visualValueCount = 24;
  const createDOMElements = () => {
    const visualMainElement = visualMainElementRef.current;
    visualMainElement.innerHTML = "";
    for (let i = 0; i < visualValueCount; ++i) {
      const elm = document.createElement("div");
      visualMainElement.appendChild(elm);
      visualElementsRef.current[i] = elm;
    }
  };

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    if (isRecording) {
      audioContextRef.current = audioContext;
      const initDOM = () => {
        createDOMElements();
      };
      initDOM();

      const dataMap = {
        0: 15,
        1: 10,
        2: 4,
        3: 3,
        4: 5,
        5: 10,
        6: 8,
        7: 4,
        8: 10,
        9: 4,
        10: 7,
        11: 3,
        12: 4,
        13: 7,
        14: 13,
        15: 14,
        16: 15,
        17: 9,
        18: 10,
        19: 12,
        20: 3,
        21: 4,
        22: 3,
        23: 6,
      };
      const processFrameWrapper = (data) => {
        const values = Object.values(data);
        let i;
        for (i = 0; i < visualValueCount; ++i) {
          const value = values[dataMap[i]] / 255;
          const elmStyles = visualElementsRef.current[i].style;
          elmStyles.height = `${Math.round(value * 50)}px`;
          elmStyles.opacity = 1;
          // elmStyles.opacity = Math.max(.25, value);
        }
      };

      const processErrorWrapper = (error) => {
        const visualMainElement = visualMainElementRef.current;
        visualMainElement.classList.add("error");
        visualMainElement.innerText =
          "Please allow access to your microphone in order to see this demo.\nNothing bad is going to happen... hopefully :P";
      };
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          const audioContext = audioContextRef.current;
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.smoothingTimeConstant = 0.5;
          analyser.fftSize = 32;

          const frequencyData = new Uint8Array(analyser.frequencyBinCount);
          const renderFrame = () => {
            analyser.getByteFrequencyData(frequencyData);
            processFrameWrapper(frequencyData);
            requestAnimationFrame(renderFrame);
          };

          requestAnimationFrame(renderFrame);

          return () => {
            audioContextRef.current.close();
          };
        })
        .catch((error) => {
          processErrorWrapper(error);
        });
    } else {
      const audioContextStop = audioContextRef?.current;
      audioContextStop?.close();
      const visualMainElement = visualMainElementRef.current;
      visualMainElement.innerHTML = "";
    }
  }, [isRecording]); // Add isPlaying to dependency array

  return (
    <main
      className="audio-visualizer-wrapper"
      ref={visualMainElementRef}
    ></main>
  );
};

export default Visualizer;
