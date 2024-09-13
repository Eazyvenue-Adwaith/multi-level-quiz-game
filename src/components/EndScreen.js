import React from "react";

const EndScreen = ({ score, onRestart, completedLevels, failedLevel, highScores }) => {
  let message;
  if (failedLevel) {
    message = `You failed at the ${failedLevel} level. Try again!`;
  } else if (completedLevels.includes('hard')) {
    message = "Congratulations! You've completed all levels!";
  } else {
    message = `You've completed the ${completedLevels[completedLevels.length - 1]} level!`;
  }

  return (
    <div className="end-screen">
      <h2>Quiz Completed!</h2>
      <h3>{message}</h3>
      <p>Your final score: {score}</p>
      {highScores && highScores.length > 0 && (
        <>
          <h3>High Scores:</h3>
          <ol>
            {highScores.map((entry, index) => (
              <li key={index}>
                {entry.score} points - {new Date(entry.date).toLocaleDateString()}
              </li>
            ))}
          </ol>
        </>
      )}
      <button onClick={onRestart}>Restart Quiz</button>
    </div>
  );
};

export default EndScreen;