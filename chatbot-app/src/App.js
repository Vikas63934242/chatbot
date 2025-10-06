import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [chats, setChats] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleNewChat = () => {
    const newChat = {
      title: "New Chat",
      messages: [{ sender: "bot", text: "Hello! How can I help you?" }],
      createdAt: new Date(),
    };
    setChats([...chats, newChat]);
    setSelectedIndex(chats.length);
  };

  const handleSelectChat = (index) => {
    setSelectedIndex(index);
  };
  // Edit chat title
  const handleEditChat = (index, newTitle) => {
    const updatedChats = chats.map((chat, i) =>
      i === index ? { ...chat, title: newTitle } : chat
    );
    setChats(updatedChats);
  };

  // Delete chat
  const handleDeleteChat = (index) => {
    const updatedChats = chats.filter((_, i) => i !== index);
    setChats(updatedChats);
    // Adjust selectedIndex if needed
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleSend = async (input, resetInput) => {
    if (!input.trim() || selectedIndex === null) return;

    const updatedChats = [...chats];
    updatedChats[selectedIndex].messages.push({ sender: "user", text: input });

    // API call here 👇
    try {
      const response = await fetch("https://your-api-url.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      updatedChats[selectedIndex].messages.push({
        sender: "bot",
        text: data.answer,
      });
    } catch (err) {
      updatedChats[selectedIndex].messages.push({
        sender: "bot",
        text: "Error connecting to API",
      });
    }

    setChats(updatedChats);
    resetInput("");
  };

  return (
    <div style={styles.appContainer}>
      <Header botName="Naffa3" />
      <div style={styles.container}>
        <Sidebar
          chats={chats}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
        />
        <ChatWindow
          selectedChat={chats[selectedIndex]}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  container: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
};

export default App;
