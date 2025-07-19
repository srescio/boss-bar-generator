import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner" />
      <p className="loading-text">
        Processing external image...
        <br />
        <span className="loading-subtext">
          This may take a few seconds
        </span>
      </p>
    </div>
  );
};

export default LoadingOverlay; 