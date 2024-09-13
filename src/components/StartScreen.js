import React from 'react';

const StartScreen = ({ onStart }) => (
  <div className="start-screen">
    <h1>Multi-Level Quiz Game</h1>
    <button onClick={onStart}>Start Quiz</button>
  </div>
);

export default StartScreen;