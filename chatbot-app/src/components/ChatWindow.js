import React, { useState } from "react";
import FeedbackModal from "./FeedbackModal";

function ChatWindow({ selectedChat, onSend }) {
  const [input, setInput] = useState("");
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, type: null, id: null });

  const handleFeedback = (type, id) => {
    setFeedbackModal({ isOpen: true, type, id });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!selectedChat) {
    return <div style={styles.empty}>Select or start a new chat...</div>;
  }

  return (
    <div style={styles.chatWindow}>
      <div style={styles.messages}>
        {selectedChat.messages.map((msg, i) => (
          <div key={i} style={styles.messageContainer}>
            <div style={styles.messageContent}>
              <div style={styles.messageHeader}>
                <span style={styles.senderIcon}>
                  {msg.sender === "user" ? "👤" : "💬"}
                </span>
                <span style={styles.senderLabel}>
                  {msg.sender === "user" ? "YOU" : "Naffa3"}
                </span>
              </div>
              <div
                style={styles.messageBubbleWrapper}
                onMouseEnter={() => msg.sender === "bot" && setHoveredMessageIndex(i)}
                onMouseLeave={() => msg.sender === "bot" && setHoveredMessageIndex(null)}
              >
                {msg.sender === "bot" && hoveredMessageIndex === i && (
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleFeedback("up", msg.id)}
                      title="Thumbs up"
                    >
                      👍
                    </button>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleFeedback("down", msg.id)}
                      title="Thumbs down"
                    >
                      👎
                    </button>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleCopy(msg.text)}
                      title="Copy"
                    >
                      📋
                    </button>
                  </div>
                )}
                <div style={styles.messageBubble}>
                  <div style={styles.messageText}>{msg.text}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend(input, setInput)}
          placeholder="Type a message..."
        />
        <button
          style={styles.button}
          onClick={() => onSend(input, setInput)}
        >
          Send
        </button>
      </div>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, type: null, id: null })}
        feedbackType={feedbackModal.type}
        msgId={feedbackModal.id}
      />
    </div>
  );
}

const styles = {
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#e8eaed",
    overflowX: "hidden",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
  messageContainer: {
    width: "100%",
    padding: "20px 60px",
  },
  messageContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  messageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  },
  senderIcon: {
    fontSize: "12px",
  },
  senderLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#5f6368",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  messageBubbleWrapper: {
    position: "relative",
  },
  messageBubble: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "16px 20px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  messageText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#202124",
  },
  actionButtons: {
    position: "absolute",
    top: "-24px",
    right: "12px",
    display: "flex",
    gap: "4px",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "4px 8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  actionButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    padding: "2px 4px",
    opacity: 0.8,
    transition: "opacity 0.2s",
  },
  inputBox: {
    padding: "20px 60px 30px",
    backgroundColor: "#e8eaed",
    display: "flex",
    gap: "12px",
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    border: "none",
    borderRadius: "24px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    resize: "none",
  },
  button: {
    padding: "14px 28px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
  },
  empty: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#636e72",
    backgroundColor: "#e8eaed",
  },
};

export default ChatWindow;
