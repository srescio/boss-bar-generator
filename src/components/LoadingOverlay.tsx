import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: '#fff',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '4px solid #3b82f6',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ marginTop: '16px', fontSize: '18px', textAlign: 'center' }}>
        Processing external image...
        <br />
        <span style={{ fontSize: '14px', opacity: 0.8 }}>
          This may take a few seconds
        </span>
      </p>
    </div>
  );
};

export default LoadingOverlay; 