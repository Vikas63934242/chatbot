import React from 'react';

const Loader = ({ size = 'medium', type = 'spinner', overlay = false, message = '' }) => {
  const sizeStyles = {
    small: { width: '20px', height: '20px', borderWidth: '2px' },
    medium: { width: '40px', height: '40px', borderWidth: '4px' },
    large: { width: '60px', height: '60px', borderWidth: '6px' },
  };

  const spinnerStyle = {
    ...sizeStyles[size],
    border: `${sizeStyles[size].borderWidth} solid #f3f3f3`,
    borderTop: `${sizeStyles[size].borderWidth} solid #1a73e8`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const dotsStyle = {
    display: 'flex',
    gap: '8px',
  };

  const dotStyle = {
    width: sizeStyles[size].width,
    height: sizeStyles[size].height,
    backgroundColor: '#1a73e8',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
  };

  if (type === 'dots') {
    return (
      <div style={overlay ? styles.overlay : styles.container}>
        <div style={dotsStyle}>
          <div style={{ ...dotStyle, animationDelay: '-0.32s' }}></div>
          <div style={{ ...dotStyle, animationDelay: '-0.16s' }}></div>
          <div style={dotStyle}></div>
        </div>
        {message && <p style={styles.message}>{message}</p>}
        <style>{keyframes}</style>
      </div>
    );
  }

  return (
    <div style={overlay ? styles.overlay : styles.container}>
      <div style={spinnerStyle}></div>
      {message && <p style={styles.message}>{message}</p>}
      <style>{keyframes}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    gap: '10px',
  },
  message: {
    color: '#5f6368',
    fontSize: '14px',
    margin: '10px 0 0 0',
  },
};

const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

export default Loader;
