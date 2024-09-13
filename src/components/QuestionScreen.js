import React, { useState } from 'react';

const QuestionScreen = ({ question, onAnswer, timer, feedback, onNavigate, questionNumber, totalQuestions }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <div className="question-screen">
      <h2>Question {questionNumber} of {totalQuestions}</h2>
      <h3>{question.question}</h3>
      <p>Time remaining: {timer} seconds</p>
      <form onSubmit={handleSubmit}>
        {question.type === 'multiple-choice' && (
          <div className="options">
            {question.options.map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        )}
        {question.type === 'true-false' && (
          <div className="options">
            <label>
              <input
                type="radio"
                name="answer"
                value="true"
                checked={answer === 'true'}
                onChange={(e) => setAnswer(e.target.value)}
              />
              True
            </label>
            <label>
              <input
                type="radio"
                name="answer"
                value="false"
                checked={answer === 'false'}
                onChange={(e) => setAnswer(e.target.value)}
              />
              False
            </label>
          </div>
        )}
        {question.type === 'text-input' && (
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here"
          />
        )}
        <button type="submit">Submit</button>
      </form>
      {feedback && <div className="feedback">{feedback}</div>}
      <div className="navigation">
        <button onClick={() => onNavigate('prev')} disabled={questionNumber === 1}>Previous</button>
        <button onClick={() => onNavigate('next')} disabled={questionNumber === totalQuestions}>Next</button>
      </div>
    </div>
  );
};

export default QuestionScreen;