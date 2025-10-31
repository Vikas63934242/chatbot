import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import Chatbot from './components/chatbot';

function App() {
 const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div>
      {/* Right-bottom icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={iconButtonStyle}
        >
          💬
        </button>
      )}

      {/* Mini chat window (image-size) */}
      {isOpen && !isFullScreen && (
        <div style={miniChatStyle}>
          {/* Your chat UI here */}
          <Chatbot
            isFullScreen={isFullScreen}
            setIsOpen={setIsOpen}
            setIsFullScreen={setIsFullScreen}
            hideSidebar={!isFullScreen}
          />
        </div>
      )}

      {/* Fullscreen chat */}
      {isOpen && isFullScreen && (
        <div style={fullScreenChatStyle}>
          <Chatbot
           isFullScreen={isFullScreen}
           setIsOpen={setIsOpen}
           setIsFullScreen={setIsFullScreen}
           hideSidebar={!isFullScreen}
          />
        </div>
      )}
    </div>
  );
}

const iconButtonStyle = {
  position: "fixed",
  bottom: 24,
  right: 24,
  zIndex: 9999,
  borderRadius: "50%",
  width: 60,
  height: 60,
  fontSize: 32,
  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  background: "#6B004B",
  color: "white",
  border: "none",
  cursor: "pointer"
};

const miniChatStyle = {
  position: "fixed",
  bottom: 32,
  right: 32,
  zIndex: 10000,
  width: 430,       // approx image size
  height: 600,      // adjust as per your image
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column"
};

const fullScreenChatStyle = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw", height: "100vh",
  zIndex: 10001,
  background: "#fff",
  borderRadius: 0,
  boxShadow: "0 4px 24px rgba(0,0,0,0.10)"
};

export default App;
