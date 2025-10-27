import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const userId = window.Liferay.ThemeDisplay.getUserId();

    useEffect( () => {
     async function fetchData() {
        const items = await getUserChatMappingByChatId("r_userIdChat_userId" , userId);
        const oldChat = items ? items.map(item =>
        ({     title: item.chatTitle,
                chatId: item.chatId,
                createdAt: item.createdAt,
              messages: []
        })) : [];
        let storedChats = JSON.parse(localStorage.getItem('chat'));
        if(storedChats){
            let baseChats = chats;
            if(oldChat && oldChat.length > 0){
                baseChats=oldChat;
            }
            setChats(baseChats);
            setSelectedChat(storedChats);
            localStorage.setItem('chat', JSON.stringify(storedChats));
        }else{
            handleNewChat();
        }

      }
      fetchData();
    }, [userId]);

    async function deleteUserChatMapping(mappingId) {
      try {
        const response = await fetch(`http://localhost:8080/o/c/userandchatidmappings/${mappingId}`, {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',
            'x-csrf-token': 't47acYb6',
            "Authorization": "Basic dGVzdEBnbWFpbC5jb206dGVzdDE=",
            "Cookie": "COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; JSESSIONID=650FDE5C5D48296107F43573BB51DC3C"

          },
        });

        if (response.ok) {
          console.log('Mapping deleted successfully');
          return true;
        } else {
          const errMessage = await response.text();
          console.error('Failed to delete mapping:', errMessage);
          return false;
        }
      } catch (error) {
        console.error('Error deleting user-chat mapping:', error);
        return false;
      }
    }

    async function getUserChatMappingByChatId(field, value) {
      try {
        const response = await fetch(
            `http://localhost:8080/o/c/userandchatidmappings/?filter=${field} eq '${value}'`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-csrf-token": 'hgUi2GwN',
              "Authorization": "Basic dGVzdEBnbWFpbC5jb206dGVzdDE=",
              "Cookie": "COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; JSESSIONID=650FDE5C5D48296107F43573BB51DC3C"

            },
          }
        );
            console.log("Response :", response);
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Error ${response.status}: ${errText}`);
        }

        const data = await response.json();

        // Extract id from the first item if any
        if (data.items && data.items.length > 0 && field === "chatId") {
          const id = data.items[0].id;
          console.log("Mapping id:", id);
          return id;
        } else if(data.items.length > 0 && field === "r_userIdChat_userId") {
          return data.items;
        }else {
            console.log("No mapping found for", field, value);
          return null;
        }
      } catch (error) {
        console.error("Error fetching user-chat mapping:", error);
        return null;
      }
    }

    async function addMessageIntoObject(messageType, input) {
        try {
              const response = await fetch("http://localhost:8080/o/c/chatmessages/", {
                        method: "POST",
                        headers: {
                          "accept": "application/json",
                          "Content-Type": "application/json",
                          "x-csrf-token": "H6GryH4k",
                          "Authorization": "Basic dGVzdEBnbWFpbC5jb206dGVzdDE=",
                          "Cookie": "COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; JSESSIONID=650FDE5C5D48296107F43573BB51DC3C"
                        },
                        body: JSON.stringify({
                           chatID: selectedChat.chatId,
                           feedback: "string",
                           feedbackReaction: "string",
                           messageText: input,
                           messageType: {
                             key: messageType,
                             name: messageType
                           },
                           r_chatUserID_userId: userId,
                           createdAt: new Date().toISOString()
                         })
                  });
        }catch (error) {
            console.error("Error fetching in chatMessage:", error);
        }
    }


     const createUserChatMapping = async (newChat, id, method) => {
    try {
            await fetch(`http://localhost:8080/o/c/userandchatidmappings/${id}`,  {
              method: method,
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "x-csrf-token": "qbICt4KO",
                "Authorization": "Basic dGVzdEBnbWFpbC5jb206dGVzdDE=",
                "Cookie": "COOKIE_SUPPORT=true; GUEST_LANGUAGE_ID=en_US; JSESSIONID=650FDE5C5D48296107F43573BB51DC3C"
              },
              body: JSON.stringify({
                chatId: newChat.chatId,
                chatTitle: newChat.title,
                createdAt: newChat.createdAt,
                r_userIdChat_userId: userId
              })
            });
          } catch (err) {
            console.error("Error creating user-chat mapping:", err);
          }
      };

  const handleNewChat = () => {
    const chatId = userId+'-'+ Math.random().toString(36).substring(2, 15);
    const newChat = {
      title: chatId,
      chatId: chatId,
      messages: [{ sender: "bot", text: "Hello! How can I help you?" }],
      createdAt: new Date().toISOString(),
    };
    setChats([...chats, newChat]);
    createUserChatMapping(newChat, "", "POST");
    setSelectedChat(newChat);
    localStorage.setItem('chat', JSON.stringify(newChat));
  };

  const handleSelectChat = (chatId) => {
    const chatToShow = chats.find(chat => chat.chatId === chatId);
    setSelectedChat(chatToShow);
    localStorage.setItem('chat', JSON.stringify(chatToShow));
  };
  // Edit chat title
  const handleEditChat = async (chatId, newTitle) => {
  const updatedChats = chats.map(chat =>
    chat.chatId === chatId ? { ...chat, title: newTitle } : chat
  );
  setChats(updatedChats);
  const updatedChat = updatedChats.find(chat => chat.chatId === chatId);
  if (updatedChat) {
    const id = await getUserChatMappingByChatId("chatId" , chatId);
    createUserChatMapping(updatedChat, id , "PUT");
  }
  };

  // Delete chat
  const handleDeleteChat = async (chatId) => {
    const id = await getUserChatMappingByChatId("chatId" , chatId);
    await deleteUserChatMapping(id);
    const updatedChats = chats.filter(chat => chat.chatId !== chatId);
    setChats(updatedChats);
  };

  const handleSend = async (input, resetInput) => {
    if (!input.trim() || selectedChat === null) return;
    const updatedChats = [...chats];
    selectedChat.messages.push({ sender: "user", text: input });
    addMessageIntoObject( "user", input);
    selectedChat.messages.push({sender: "bot",text: "test response from API"});
    addMessageIntoObject( "bot", "test response from API");
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
          selectedChat={selectedChat}
        />
        <ChatWindow
          selectedChat={selectedChat}
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
