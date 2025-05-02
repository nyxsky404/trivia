import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(10);
  const [category, setCategory] = useState('general_knowledge');
  const [difficulty, setDifficulty] = useState('easy');

  const handleStartQuiz = () => {
    navigate(`/quiz?amount=${amount}&category=${category}&difficulty=${difficulty}`);
  };

  return (
    <main className="home-container">
      <div className="quiz-header">
        <h1>Welcome to the Trivia Quiz</h1>
        <p>Test your knowledge with our interactive quiz!</p>
      </div>

      <div className="quiz-config">
        <div className="config-section">
          <h2>Number of Questions</h2>
          <div className="amount-selector">
            <button
              onClick={() => setAmount(Math.max(5, amount - 5))}
              disabled={amount <= 5}
            >
              -
            </button>
            <span>{amount}</span>
            <button
              onClick={() => setAmount(Math.min(20, amount + 5))}
              disabled={amount >= 20}
            >
              +
            </button>
          </div>
        </div>

        <div className="config-section">
          <h2>Category</h2>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="general_knowledge">General Knowledge</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="entertainment">Entertainment</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <div className="config-section">
          <h2>Difficulty</h2>
          <div className="difficulty-buttons">
            <button
              className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => setDifficulty('medium')}
            >
              Medium
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        <button
          className="start-quiz-btn"
          onClick={handleStartQuiz}
        >
          Start Quiz
        </button>
      </div>

      <div className="quiz-info">
        <div className="info-card">
          <h3>How it works</h3>
          <ul>
            <li>Select your preferred quiz settings</li>
            <li>Answer questions within the time limit</li>
            <li>Get instant feedback on your answers</li>
            <li>View your final score at the end</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Time Limits</h3>
          <ul>
            <li>Easy: 30 seconds per question</li>
            <li>Medium: 20 seconds per question</li>
            <li>Hard: 15 seconds per question</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Home;
