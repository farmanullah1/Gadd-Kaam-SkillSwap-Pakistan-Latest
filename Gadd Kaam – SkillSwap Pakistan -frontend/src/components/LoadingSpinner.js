// src/components/LoadingSpinner.js
import React from 'react';
import '../styles/LoadingSpinner.css'; // Import the CSS for the spinner

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;