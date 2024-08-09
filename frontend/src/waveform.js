import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import WaveSurfer from 'wavesurfer.js';
import styled from 'styled-components';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import AnnotationForm from './AnnotationForm';

const Waveform = ({ audio }) => {
  const containerRef = useRef();
  const waveSurferRef = useRef({
    isPlaying: () => false,
    getCurrentTime: () => 0,
    seekTo: (percent) => {}
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [isAnnotationMode, setAnnotationMode] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentAnnotationTime, setCurrentAnnotationTime] = useState(null);

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
      waveSurfer.seekTo(currentPosition);
    });

    waveSurfer.on('click', (relativeX) => {
      const duration = waveSurfer.getDuration();
      const clickedTime = (relativeX * duration).toFixed(2);

      if (isAnnotationMode) {
        setCurrentAnnotationTime(clickedTime);
      } else {
        waveSurfer.seekTo(relativeX);
      }
      setCurrentPosition(relativeX);
    });

    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      if (event.code === 'Escape') {
        setCurrentAnnotationTime(null);
      }

      // Check if the active element is an input or textarea to avoid triggering the event
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return;
      }
      if (event.code === 'KeyT') {
        event.preventDefault();
        setAnnotationMode((prev) => !prev);
        setCurrentPosition(waveSurfer.getCurrentTime() / waveSurfer.getDuration());
      }
      if (event.code === 'Space') {
        waveSurferRef.current.playPause();
        setIsPlaying(waveSurferRef.current.isPlaying());
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      waveSurfer.destroy();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [audio, isAnnotationMode, currentPosition]);

  const handleSaveAnnotation = (annotation) => {
    setAnnotations((prev) => [...prev, annotation]);
    setCurrentAnnotationTime(null); // Close the form
  };

  return (
    <>
    <WaveSurferWrap>
      <button
        onClick={() => {
          waveSurferRef.current.playPause();
          setIsPlaying(waveSurferRef.current.isPlaying());
        }}
        type="button"
      >
        {isPlaying ? <FaPauseCircle size="3em" /> : <FaPlayCircle size="3em" />}
      </button>
      <div ref={containerRef} />
    </WaveSurferWrap>
    <ModeIndicator>
      {isAnnotationMode ? 'Annotation Mode' : 'Seek Mode'}
    </ModeIndicator>
    <AnnotationList>
      {annotations.map((annotation, index) => (
        <li key={index}>
          <strong>{annotation.time}s:</strong> {annotation.text} by {annotation.userName}
        </li>
      ))}
    </AnnotationList>
    {currentAnnotationTime && (
      <AnnotationForm
        time={currentAnnotationTime}
        onSave={handleSaveAnnotation}
      />
    )}
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

const ModeIndicator = styled.div`
  margin-top: 10px;
  font-size: 1.2em;
  font-weight: bold;
`;

export default Waveform;
