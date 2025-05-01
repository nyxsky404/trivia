import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Result = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const score = parseInt(searchParams.get('score') ?? '0');
  const total = parseInt(searchParams.get('total') ?? '0');
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (percentage >= 80) {
      return 'Excellent! You\'re a trivia master!';
    } else if (percentage >= 60) {
      return 'Good job! You know your stuff!';
    } else if (percentage >= 40) {
      return 'Not bad! Keep learning!';
    } else {
      return 'Keep practicing! You\'ll get better!';
    }
  };

  return (
    <main>
      <div className="container">
        <div className="result-container">
          <div className="card">
            <h2>Quiz Complete!</h2>
            <div className="score">
              {score} / {total}
            </div>
            <p>{getMessage()}</p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => navigate('/')}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Result; 