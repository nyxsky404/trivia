import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const amount = searchParams.get('amount') ?? '5';
  const category = searchParams.get('category') ?? 'general_knowledge';
  const difficulty = searchParams.get('difficulty') ?? 'medium';

  const getCurrentQuestion = useCallback(() => {
    try {
      if (!questions?.length || currentQuestionIndex >= questions.length) {
        return null;
      }
      return questions[currentQuestionIndex];
    } catch (err) {
      console.error('Error accessing current question:', err);
      return null;
    }
  }, [questions, currentQuestionIndex]);

  const currentQuestion = getCurrentQuestion();

  const getTimeLimit = useCallback((diff) => {
    switch (diff) {
      case 'easy': return 30;
      case 'medium': return 20;
      case 'hard': return 15;
      default: return 30;
    }
  }, []);

  const handleAnswer = useCallback((answer) => {
    try {
      if (!questions?.length || currentQuestionIndex >= questions.length) {
        return;
      }

      const question = getCurrentQuestion();
      if (!question?.correctAnswer) {
        console.warn('No valid question found at index:', currentQuestionIndex);
        return;
      }

      setSelectedAnswer(answer);
      setShowFeedback(true);

      const isCorrect = answer === question.correctAnswer;
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setTimeLeft(getTimeLimit(difficulty));
        } else {
          const finalScore = score + (isCorrect ? 1 : 0);
          setScore(finalScore);
          navigate(`/result?score=${finalScore}&total=${questions.length}`);
        }
      }, 2000);
    } catch (err) {
      console.error('Error in handleAnswer:', err);
      setError('An error occurred while processing your answer. Please try again.');
    }
  }, [questions, currentQuestionIndex, difficulty, getTimeLimit, navigate, getCurrentQuestion, score]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://the-trivia-api.com/v2/questions?limit=${amount}&categories=${category}&difficulty=${difficulty}`
        );
        
        if (!response?.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format from API');
        }

        const transformedQuestions = response.data
          .filter(item => item?.question?.text && item?.correctAnswer)
          .map(item => {
            try {
              const incorrectAnswers = Array.isArray(item.incorrectAnswers) ? item.incorrectAnswers : [];
              const allAnswers = [...incorrectAnswers];
              
              if (item.correctAnswer) {
                allAnswers.push(item.correctAnswer);
              }
              
              for (let i = allAnswers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
              }
              
              return {
                question: item.question.text,
                correctAnswer: item.correctAnswer,
                incorrectAnswers,
                shuffledAnswers: allAnswers
              };
            } catch (err) {
              console.warn('Error processing question:', item, err);
              return null;
            }
          })
          .filter(Boolean);

        if (!transformedQuestions.length) {
          throw new Error('No valid questions found in the response');
        }

        setQuestions(transformedQuestions);
        setTimeLeft(getTimeLimit(difficulty));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message || 'Failed to load questions. Please try again.');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [amount, category, difficulty, getTimeLimit]);

  useEffect(() => {
    let timer;
    
    if (!questions.length) return;

    const handleTimeout = () => {
      try {
        if (timeLeft === 0 && !showFeedback) {
          handleAnswer(null);
        }
      } catch (err) {
        console.error('Error in timer callback:', err);
      }
    };

    if (timeLeft > 0 && !showFeedback) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        handleTimeout();
      }, 1000);
    } else {
      handleTimeout();
    }
    
    return () => timer && clearTimeout(timer);
  }, [timeLeft, showFeedback, questions.length, handleAnswer]);

  if (isLoading) {
    return (
      <main>
        <div className="container">
          <div className="card">
            <h2 style={{ textAlign: 'center' }}>Loading questions...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="container">
          <div className="card">
            <h2 style={{ textAlign: 'center', color: 'var(--error-color)' }}>{error}</h2>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => navigate('/')}
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main>
        <div className="container">
          <div className="card">
            <h2 style={{ textAlign: 'center' }}>No questions available</h2>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => navigate('/')}
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="card">
          <div className="timer">Time left: {timeLeft}s</div>
          <h2 style={{ marginBottom: '1rem' }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
            {currentQuestion.question}
          </p>
          <div>
            {currentQuestion.shuffledAnswers.map((answer, index) => (
              <div
                key={`${answer}-${index}`}
                className={`answer-option ${
                  showFeedback
                    ? answer === currentQuestion.correctAnswer
                      ? 'correct'
                      : answer === selectedAnswer
                      ? 'incorrect'
                      : ''
                    : ''
                }`}
                onClick={() => !showFeedback && handleAnswer(answer)}
              >
                {answer}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Quiz; 