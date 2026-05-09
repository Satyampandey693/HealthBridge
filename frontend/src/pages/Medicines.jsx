import React from 'react';
import './ComingSoon.css';

export const Medicines = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <h1 className="coming-soon-text">Coming Soon</h1>
        <p className="coming-soon-subtext">
          We’re working hard to bring you new features. Stay tuned!
        </p>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <button className="back-btn" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
};
