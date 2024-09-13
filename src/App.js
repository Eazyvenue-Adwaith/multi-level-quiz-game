import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import EndScreen from './components/EndScreen';
import { questions } from './questions';
import './App.css';

const QUESTIONS_PER_LEVEL = 3;
const PASSING_SCORE = 2;

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [currentLevel, setCurrentLevel] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState({ easy: 0, medium: 0, hard: 0 });
  const [timer, setTimer] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState({});
  const [completedLevels, setCompletedLevels] = useState([]);
  const [failedLevel, setFailedLevel] = useState(null);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('quizProgress'));
    if (storedProgress) {
      setGameState(storedProgress.gameState);
      setCurrentLevel(storedProgress.currentLevel);
      setCurrentQuestionIndex(storedProgress.currentQuestionIndex);
      setScore(storedProgress.score);
      setCompletedLevels(storedProgress.completedLevels);
    }

    const storedHighScores = JSON.parse(localStorage.getItem('quizHighScores')) || [];
    setHighScores(storedHighScores);
  }, []);

  useEffect(() => {
    localStorage.setItem('quizProgress', JSON.stringify({
      gameState,
      currentLevel,
      currentQuestionIndex,
      score,
      completedLevels
    }));
  }, [gameState, currentLevel, currentQuestionIndex, score, completedLevels]);

  const shuffleQuestions = useCallback(() => {
    const shuffled = {};
    ['easy', 'medium', 'hard'].forEach(level => {
      shuffled[level] = [...questions[level]].sort(() => Math.random() - 0.5);
    });
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswer = useCallback((answer) => {
    const currentQuestion = shuffledQuestions[currentLevel][currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setFeedback(isCorrect ? "Correct!" : "Incorrect. The correct answer was: " + currentQuestion.correctAnswer);

    if (isCorrect) {
      setScore((prevScore) => ({
        ...prevScore,
        [currentLevel]: prevScore[currentLevel] + 1,
      }));
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex + 1 < QUESTIONS_PER_LEVEL) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        if (score[currentLevel] + (isCorrect ? 1 : 0) >= PASSING_SCORE) {
          setCompletedLevels(prev => [...prev, currentLevel]);
          if (currentLevel === 'easy') {
            setCurrentLevel('medium');
          } else if (currentLevel === 'medium') {
            setCurrentLevel('hard');
          } else {
            endGame();
            return;
          }
          alert(`Congratulations! You've passed the ${currentLevel} level. Moving to the next level.`);
        } else {
          setFailedLevel(currentLevel);
          endGame();
          return;
        }
        setCurrentQuestionIndex(0);
      }
      setTimer(30);
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, currentQuestionIndex, score, shuffledQuestions]);

  useEffect(() => {
    let interval;
    if (gameState === 'question' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleAnswer(null);
    }
    return () => clearInterval(interval);
  }, [gameState, timer, handleAnswer]);

  const startGame = () => {
    shuffleQuestions();
    setGameState('question');
    setCurrentLevel('easy');
    setCurrentQuestionIndex(0);
    setScore({ easy: 0, medium: 0, hard: 0 });
    setTimer(30);
    setCompletedLevels([]);
    setFailedLevel(null);
  };

  const getCurrentQuestion = () => {
    return shuffledQuestions[currentLevel][currentQuestionIndex];
  };

  const getTotalScore = () => {
    return score.easy * 10 + score.medium * 20 + score.hard * 30;
  };

  const navigate = (direction) => {
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === 'next' && currentQuestionIndex < QUESTIONS_PER_LEVEL - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const endGame = () => {
    const finalScore = getTotalScore();
    const newHighScores = [...highScores, { score: finalScore, date: new Date().toISOString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep only top 5 scores

    setHighScores(newHighScores);
    localStorage.setItem('quizHighScores', JSON.stringify(newHighScores));
    setGameState('end');
  };

  return (
    <div className="app">
      {gameState === 'start' && <StartScreen onStart={startGame} />}
      {gameState === 'question' && (
        <QuestionScreen
          question={getCurrentQuestion()}
          onAnswer={handleAnswer}
          timer={timer}
          feedback={feedback}
          onNavigate={navigate}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={QUESTIONS_PER_LEVEL}
        />
      )}
      {gameState === 'end' && (
        <EndScreen 
          score={getTotalScore()} 
          onRestart={startGame} 
          completedLevels={completedLevels}
          failedLevel={failedLevel}
          highScores={highScores}
        />
      )}
    </div>
  );
};

export default App;