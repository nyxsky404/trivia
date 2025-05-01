import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '5',
    category: 'general_knowledge',
    difficulty: 'medium'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(formData);
    navigate(`/quiz?${searchParams.toString()}`);
  };

  return (
    <main>
      <div className="container">
        <div className="home-container">
          <div className="quiz-header">
            <h1>Welcome to Trivia Quiz!</h1>
            <p>Test your knowledge with our fun and challenging questions.</p>
          </div>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="amount">Number of Questions:</label>
                <select
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general_knowledge">General Knowledge</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="arts_and_literature">Arts & Literature</option>
                  <option value="sports_and_leisure">Sports & Leisure</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty:</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Start Quiz
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home; 