import React from "react";
import { useState } from "react";

function Sidebar({ chats, onNewChat, onSelectChat,  onEditChat, onDeleteChat  }) {
  const [editIndex, setEditIndex] = useState(null);
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
    const handleEdit = (index, chat) => {
    setEditIndex(index);
    setEditValue(chat.title);
    };

    const handleEditSave = (index) => {
        onEditChat(index, editValue);
        setEditIndex(null);
        setEditValue("");
    };
  return (
    <div style={styles.sidebar}>
      <button style={styles.newChatBtn} onClick={onNewChat}>
        + New Chat
      </button>

       <div style={styles.chatList}>
        <h4>Today</h4>
        {todayChats.map((chat, i) => (
          <div key={i} style={styles.chatItem} >
            {editIndex === i ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={styles.input}
                />
                <button onClick={() => handleEditSave(i)} style={styles.iconBtn}>💾</button>
                <button onClick={() => setEditIndex(null)} style={styles.iconBtn}>✖</button>
              </>
            ) : (
              <>
                <span onClick={() => onSelectChat(i)} style={{ flex: 1, cursor: "pointer" }}>{chat.title}</span>
                <button onClick={() => handleEdit(i, chat)} style={styles.iconBtn}>✏️</button>
                <button onClick={() => onDeleteChat(i)} style={styles.iconBtn}>🗑️</button>
              </>
            )
        }
          </div>
        ))}

        <h4>Older</h4>
        {olderChats.map((chat, i) => (
          <div key={i} style={styles.chatItem}>
            {editIndex === i + todayChats.length ? (
              <>
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={styles.input}
                />
                <button onClick={() => handleEditSave(i + todayChats.length)} style={styles.iconBtn}>💾</button>
                <button onClick={() => setEditIndex(null)} style={styles.iconBtn}>✖</button>
              </>
            ) : (
              <>
                <span onClick={() => onSelectChat(i + todayChats.length)} style={{ flex: 1, cursor: "pointer" }}>{chat.title}</span>
                <button onClick={() => handleEdit(i + todayChats.length, chat)} style={styles.iconBtn}>✏️</button>
                <button onClick={() => onDeleteChat(i + todayChats.length)} style={styles.iconBtn}>🗑️</button>
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
    background: "#2f3542",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  newChatBtn: {
    background: "#1e90ff",
    color: "white",
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
    background: "#57606f",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
  },
  input: {
    flex: 1,
    padding: "5px",
    borderRadius: "3px",
    border: "1px solid #ccc",
  },
};

export default Sidebar;
