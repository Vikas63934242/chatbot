import React from "react";
import { useState } from "react";
import Loader from "./Loader";

function Sidebar({ chats, onNewChat, onSelectChat,  onEditChat, onDeleteChat, selectedChat, isLoading }) {
  const [editChat, setEditChat] = useState(null);
  const [editValue, setEditValue] = useState("");
    const isToday = (date) => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    const todayChats = chats.filter(chat => isToday(new Date(chat.createdAt)));
    const olderChats = chats.filter(chat => !isToday(new Date(chat.createdAt)));
    const handleEdit = (chat) => {
    setEditValue(chat.title);
    setEditChat(chat.chatId);
    };

    const handleEditSave = (chatId) => {
        onEditChat(chatId, editValue);
        setEditValue("");
        setEditChat(null);
    };
  return (
    <div style={styles.sidebar}>
      <button style={styles.newChatBtn} onClick={onNewChat}>
        + New Chat
      </button>
       <div style={styles.chatList}>
        <h4>Today</h4>
        {[...todayChats].reverse().map((chat, i) => (
          <div key={i} style={{
                                                                  ...styles.chatItem,
                                                                  background: chat.chatId === selectedChat.chatId ? "#0099A8" : "#004372",
                                                                  color: chat.chatId === selectedChat.chatId ? "#FFFFFF" : "#FFFFFF",
                                                                }} >
            {editChat === chat.chatId ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={styles.input}
                />
                <button onClick={() => handleEditSave(chat.chatId)} style={styles.iconBtn}>💾</button>
                <button onClick={() => setEditChat(null)} style={styles.iconBtn}>✖</button>
              </>
            ) : (
              <>
                <span onClick={() => !isLoading && onSelectChat(chat.chatId)} style={{ flex: 1, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1 }}>{chat.title}</span>
                {isLoading && chat.chatId === selectedChat?.chatId ? (
                  <Loader size="small" />
                ) : (
                  <>
                    <button onClick={() => handleEdit(chat)} style={styles.iconBtn} disabled={isLoading}>✏️</button>
                    <button onClick={() => onDeleteChat(chat.chatId)} style={styles.iconBtn} disabled={isLoading}>🗑️</button>
                  </>
                )}
              </>
            )
        }
          </div>
        ))}

        <h4>Older</h4>
        {[...olderChats].reverse().map((chat, i) => (
          <div key={i} style={{
                                     ...styles.chatItem,
                                     background: chat.chatId === selectedChat.chatId ? "#0099A8" : "#004372",
                                     color: chat.chatId === selectedChat.chatId ? "#FFFFFF" : "#FFFFFF",
                                   }}>
            {editChat === chat.chatId ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={styles.input}
                />
                <button onClick={() => handleEditSave(chat.chatId)} style={styles.iconBtn}>💾</button>
                <button onClick={() => setEditChat(null)} style={styles.iconBtn}>✖</button>
              </>
            ) : (
              <>
                <span onClick={() => !isLoading && onSelectChat(chat.chatId)} style={{ flex: 1, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1 }}>{chat.title}</span>
                {isLoading && chat.chatId === selectedChat?.chatId ? (
                  <Loader size="small" />
                ) : (
                  <>
                    <button onClick={() => handleEdit(chat)} style={styles.iconBtn} disabled={isLoading}>✏️</button>
                    <button onClick={() => onDeleteChat(chat.chatId)} style={styles.iconBtn} disabled={isLoading}>🗑️</button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    background: "#002E5B",
    color: "#FFFFFF",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  newChatBtn: {
    background: "#0099A8",
    color: "#FFFFFF",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  chatList: {
    flex: 1,
    overflowY: "auto",
  },
  chatItem: {
    padding: "10px",
    marginBottom: "10px",
    background: "#004372",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "18px",
  },
  input: {
    flex: 1,
    padding: "5px",
    borderRadius: "3px",
    border: "1px solid #E0E4E9",
  },
};

export default Sidebar;
