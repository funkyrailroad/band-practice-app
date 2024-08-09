import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';

const Waveform = ({ audio }) => {
  const containerRef = useRef();
  const waveSurferRef = useRef({
    isPlaying: () => false,
  });
  const [isPlaying, toggleIsPlaying] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [isAnnotationMode, setAnnotationMode] = useState(false);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      responsive: true,
      barWidth: 2,
      barHeight: 10,
      cursorWidth: 0,
    });

    waveSurfer.load(audio);

    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
    });

    waveSurfer.on('click', (relativeX) => {
      const duration = waveSurfer.getDuration();
      const clickedTime = relativeX * duration;

      if (isAnnotationMode) {
        const comment = prompt('Enter your annotation:');
        if (comment) {
          setAnnotations((prev) => [
            ...prev,
            { time: clickedTime.toFixed(2), text: comment },
          ]);
        }
      } else {
        console.log(`Clicked time: ${clickedTime.toFixed(2)} seconds`);
        waveSurfer.seekTo(relativeX);
      }
    });

    return () => {
      waveSurfer.destroy();
    };
  }, [audio, isAnnotationMode]);

  return (
    <>
    <WaveSurferWrap>
      <button
        onClick={() => {
          waveSurferRef.current.playPause();
          toggleIsPlaying(waveSurferRef.current.isPlaying());
        }}
        type="button"
      >
        {isPlaying ? <FaPauseCircle size="3em" /> : <FaPlayCircle size="3em" />}
      </button>
      <div ref={containerRef} />
      <button
        onClick={() => setAnnotationMode((prev) => !prev)}
        type="button"
      >
        {isAnnotationMode ? 'Switch to Seek Mode' : 'Switch to Annotation Mode'}
      </button>
    </WaveSurferWrap>
    <AnnotationList>
      {annotations.map((annotation, index) => (
        <li key={index}>
          <strong>{annotation.time}s:</strong> {annotation.text}
        </li>
      ))}
    </AnnotationList>
    </>
  );
};

Waveform.propTypes = {
  audio: PropTypes.string.isRequired,
};

const WaveSurferWrap = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;

  button {
    width: 40px;
    height: 40px;
    border: none;
    padding: 0;
    background-color: white;
  }
`;

const AnnotationList = styled.ul`
  margin-top: 10px;
  list-style: none;
  padding: 0;
  li {
    margin-bottom: 5px;
  }
`;

export default Waveform;
