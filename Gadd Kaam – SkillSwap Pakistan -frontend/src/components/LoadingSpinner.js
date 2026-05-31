// src/components/LoadingSpinner.js
import React from 'react';


const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
      <div className="spinner-label">Gadd Kaam...</div>
    </div>
  );
};

export default LoadingSpinner;