import React, { useState } from "react";

function ChatWindow({ selectedChat, onSend }) {
  const [input, setInput] = useState("");

  if (!selectedChat) {
    return <div style={styles.empty}>Select or start a new chat...</div>;
  }

  return (
    <div style={styles.chatWindow}>
      <div style={styles.messages}>
        {selectedChat.messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#74b9ff" : "#dfe6e9",
            }}
          >
            {msg.text}
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
    </div>
  );
}

const styles = {
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  messages: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    marginBottom: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 15px",
    background: "#0984e3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  empty: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#636e72",
  },
};

export default ChatWindow;
