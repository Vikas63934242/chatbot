import React, { useState } from "react";
import Loader from "./Loader";
import { useLoader } from "../hooks/useLoader";

function FeedbackModal({ isOpen, onClose, feedbackType, msgId, selectedChat }) {
  const [feedbackText, setFeedbackText] = useState("");
  const feedbackLoader = useLoader();
  let newMessages = selectedChat.messages;
  const index = newMessages.findIndex(m => m.id === msgId);
  const previousMsg = index > 0 ? newMessages[index - 1] : "";

  if (!isOpen) return null;

  const handleSubmit = async () => {
    await feedbackLoader.withLoader(async () => {
        try {
            const response = await fetch(
                        `/o/c/chatmessages/${msgId}`,
                      {
                        method: "GET",
                        headers: {
                          accept: "application/json",
                          "x-csrf-token": window.Liferay.authToken
                        },
                      }
                    );
            const data = await response.json();
            await fetch(`/o/c/chatmessages/${msgId}`,  {
              method: "PUT",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "x-csrf-token": window.Liferay.authToken
              },
              body: JSON.stringify({
               chatID: data.chatID,
               feedback: feedbackText,
               feedbackReaction: feedbackType,
               messageText: data.messageText,
               messageType: {
                 key: "bot",
                 name: "bot"
               },
               r_chatUserID_userId: data.r_chatUserID_userId,
               createdAt: data.createdAt
              })
            });
            const chatHistory = [{"user" : previousMsg.text},
                                    {"bot" : data.messageText}];
              const reqBody = {
                    user_name: window.themeDisplay.getUserName(),
                    feedback_flag: feedbackType,
                    feedback: feedbackText,
                    chat_history: chatHistory
                   }
              await fetch(
                 'https://4643b175b9e7.ngrok-free.app/api/store-feedback',
                 {
                   method: 'POST',
                   headers: {
                     'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(reqBody),
                 }
               );
          } catch (err) {
            console.error("Error creating user-chat mapping:", err);
          }

      setFeedbackText("");
      onClose();
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 style={styles.title}>Feedback</h2>
        <p style={styles.subtitle}>What did you like about this response?</p>
        <textarea
          style={styles.textarea}
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Type your feedback here..."
          disabled={feedbackLoader.loading}
        />
        <button
          style={{...styles.submitButton, opacity: feedbackLoader.loading ? 0.6 : 1}}
          onClick={handleSubmit}
          disabled={feedbackLoader.loading}
        >
          {feedbackLoader.loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader size="small" />
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    width: "90%",
    maxWidth: "500px",
    position: "relative",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  },
  closeButton: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "transparent",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "#636e72",
    lineHeight: 1,
    padding: "0",
    width: "28px",
    height: "28px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: "600",
    color: "#2d3436",
    textAlign: "center",
  },
  subtitle: {
    margin: "0 0 20px 0",
    fontSize: "14px",
    color: "#636e72",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
    marginBottom: "20px",
    boxSizing: "border-box",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#003d6b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default FeedbackModal;
