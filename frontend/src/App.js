import React from 'react';
import Waveform from './waveform';
import pianoClip from './piano.mp3'


function App() {
  return (
    <>
      <h1>Band Practice App</h1>
      <Waveform audio={pianoClip} />
    </>
  );
}

export default App;
