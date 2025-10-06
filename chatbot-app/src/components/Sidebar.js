import React from "react";

function Sidebar({ chats, onNewChat, onSelectChat }) {
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
  return (
    <div style={styles.sidebar}>
      <button style={styles.newChatBtn} onClick={onNewChat}>
        + New Chat
      </button>

       <div style={styles.chatList}>
        <h4>Today</h4>
        {todayChats.map((chat, i) => (
          <div key={i} style={styles.chatItem} onClick={() => onSelectChat(i)}>{chat.title}</div>
        ))}

        <h4>Older</h4>
        {olderChats.map((chat, i) => (
          <div key={i} style={styles.chatItem} onClick={() => onSelectChat(i)}>{chat.title}</div>
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
  },
};

export default Sidebar;
