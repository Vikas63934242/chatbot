import Sidebar from './Sidebar';
import Header from './Header';
import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Loader from './Loader';
import { useLoader } from '../hooks/useLoader';

function Chatbot({isFullScreen,setIsFullScreen, setIsOpen, hideSidebar}) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const userId = window.Liferay?.ThemeDisplay?.getUserId() || 'test@gmail.com';

  // Multiple loaders for different operations
  const initialLoader = useLoader();
  const chatSelectLoader = useLoader();
  const newChatLoader = useLoader();
  const editChatLoader = useLoader();
  const deleteChatLoader = useLoader();
  const sendMessageLoader = useLoader();

    useEffect( () => {
     async function fetchData() {
        await initialLoader.withLoader(async () => {
          const items = await getUserChatMappingByChatId("r_userIdChat_userId" , userId);
          const oldChat = items ? items.map(item =>
          ({     title: item.chatTitle,
                  chatId: item.chatId,
                  createdAt: item.createdAt,
                messages: []
          })) : [];
          let storedChats = JSON.parse(sessionStorage.getItem('chat'));
          let baseChats = chats;
          if(oldChat && oldChat.length > 0){
              baseChats=oldChat;
          }
          setChats(baseChats);
          if(storedChats){
              setSelectedChat(storedChats);
              sessionStorage.setItem('chat', JSON.stringify(storedChats));
          }else{
              handleNewChat(baseChats);
          }
        });
      }
      fetchData();
    }, [userId]);

    async function deleteChatMessages(items) {
        try {
            const response = await fetch(`/o/c/chatmessages/batch`, {
              method: 'DELETE',
              headers: {
                'accept': 'application/json',
                "Content-Type": "application/json",
                'x-csrf-token': window.Liferay.authToken
              },
               body: JSON.stringify(items)
            });

            if (response.ok) {
              console.log('Chat Message deleted successfully');
              return true;
            } else {
              const errMessage = await response.text();
              console.error('Failed to delete messages:', errMessage);
              return false;
            }
          } catch (error) {
            console.error('Error deleting chat messages:', error);
            return false;
          }
    }
    async function deleteUserChatMapping(mappingId) {
      try {
        const response = await fetch(`/o/c/userandchatidmappings/${mappingId}`, {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',
            'x-csrf-token': window.Liferay.authToken
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
            `/o/c/userandchatidmappings/?filter=${field} eq '${value}'`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-csrf-token": window.Liferay.authToken
            },
          }
        );
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Error ${response.status}: ${errText}`);
        }

        const data = await response.json();

        // Extract id from the first item if any
        if (data.items && data.items.length > 0 && field === "chatId") {
          const id = data.items[0].id;
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

    async function getChatMessage(value) {
          try {
            const response = await fetch(
                `/o/c/chatmessages/?filter=chatID eq '${value}'`,
              {
                method: "GET",
                headers: {
                  accept: "application/json",
                  "x-csrf-token": window.Liferay.authToken
                },
              }
            );
            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`Error ${response.status}: ${errText}`);
            }

            const data = await response.json();

            // Extract id from the first item if any
            if(data.items.length > 0) {
              return data.items;
            }else {
                console.log("No mapping found for chat id ", value);
              return null;
            }
          } catch (error) {
            console.error("Error fetching chat message:", error);
            return null;
          }
        }

    async function addMessageIntoObject(messageType, input, chatId) {
        try {
              const response = await fetch("/o/c/chatmessages/", {
                        method: "POST",
                        headers: {
                          "accept": "application/json",
                          "Content-Type": "application/json",
                          "x-csrf-token": window.Liferay.authToken
                        },
                        body: JSON.stringify({
                           chatID: chatId,
                           feedback: "",
                           feedbackReaction: "",
                           messageText: input,
                           messageType: {
                             key: messageType,
                             name: messageType
                           },
                           r_chatUserID_userId: userId,
                           createdAt: new Date().toISOString()
                         })
                  });
              const data = await response.json();
              return data.id;
        }catch (error) {
            console.error("Error fetching in chatMessage:", error);
        }
    }


     const createUserChatMapping = async (newChat, id, method) => {
    try {
            await fetch(`/o/c/userandchatidmappings/${id}`,  {
              method: method,
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "x-csrf-token": window.Liferay.authToken
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

  const handleNewChat = async (baseChats) => {
    await newChatLoader.withLoader(async () => {
      const chatId = userId+'-'+ Math.random().toString(36).substring(2, 15);
      let newChat = {
        title: "New Chat",
        chatId: chatId,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      createUserChatMapping(newChat, "", "POST");
      let msgId = await addMessageIntoObject("bot", "Hello! How can I help you?", chatId);
      newChat = {...newChat,
      messages: [{ sender: "bot", text: "Hello! How can I help you?", id: msgId }]
      };
      setSelectedChat(newChat);
      if(baseChats && baseChats.length > 0){
          setChats([...baseChats, newChat]);
      }else{
          setChats([...chats, newChat]);
      }
      sessionStorage.setItem('chat', JSON.stringify(newChat));
    });
  };

  const handleSelectChat =  async (chatId) => {
    await chatSelectLoader.withLoader(async () => {
      const chatToShow = chats.find(chat => chat.chatId === chatId);
      const items = await getChatMessage(chatId);
      let messages = [];
      if (items && items.length > 0) {
        messages = items.map(item => ({
          sender: item.messageType?.name || "Unknown",
          text: item.messageText,
          createdAt: item.createdAt,
          id: item.id
        })).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      const updatedChat = { ...chatToShow, messages };
      setSelectedChat(updatedChat);
      sessionStorage.setItem('chat', JSON.stringify(updatedChat));
    });
  };
  // Edit chat title
  const handleEditChat = async (chatId, newTitle) => {
    await editChatLoader.withLoader(async () => {
      const updatedChats = chats.map(chat =>
        chat.chatId === chatId ? { ...chat, title: newTitle } : chat
      );
      setChats(updatedChats);
      const updatedChat = updatedChats.find(chat => chat.chatId === chatId);
      if (updatedChat) {
        const id = await getUserChatMappingByChatId("chatId" , chatId);
        createUserChatMapping(updatedChat, id , "PUT");
      }
    });
  };

  // Delete chat
  const handleDeleteChat = async (chatId) => {
    await deleteChatLoader.withLoader(async () => {
      const id = await getUserChatMappingByChatId("chatId" , chatId);
      await deleteUserChatMapping(id);
      const items = await getChatMessage(chatId);
      const idArray = (items && items.length > 0)
        ? items.map(item => ({ id: item.id }))
        : [];
      deleteChatMessages(idArray);
      sessionStorage.clear();
      const updatedChats = chats.filter(chat => chat.chatId !== chatId);
      setChats(updatedChats);
      if(selectedChat && selectedChat.chatId === chatId){
          setSelectedChat(null);
      }
    });
  };

 const handleSend = async (input, resetInput) => {
   if (!input.trim() || selectedChat === null) return;
   await sendMessageLoader.withLoader(async () => {
     let userMessageId = await addMessageIntoObject("user", input, selectedChat.chatId);
     let messages = [];
     let newMessages = [
         ...selectedChat.messages,
         { sender: "user", text: input, id: userMessageId }
       ];
     if (newMessages.length > 7) {
       messages = newMessages.slice(-7);
     }else{
         messages = newMessages;
     }
     const formattedMessages = messages.map(msg => ({
       [msg.sender]: msg.text
     }));
     const reqBody = {
      chat_history: formattedMessages,
      user_name: window.themeDisplay.getUserName()
     }
     const apiResponse = await fetch(
       'https://4643b175b9e7.ngrok-free.app/api/chat',
       {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(reqBody),
       }
     );

     const data = await apiResponse.json();
     let botMessageId = await addMessageIntoObject("bot", data.answer, selectedChat.chatId);
     newMessages = [
       ...selectedChat.messages,
       { sender: "user", text: input, id: userMessageId },
       { sender: "bot", text: data.answer, id: botMessageId }
     ];
     const updatedChat = { ...selectedChat, messages: newMessages };
     const updatedChats = chats.map(chat =>
       chat.chatId === selectedChat.chatId ? updatedChat : chat
     );
     setChats(updatedChats);
     setSelectedChat(updatedChat);
     sessionStorage.setItem('chat', JSON.stringify(updatedChat));
     resetInput("");
   });
 };


  return (
    <div style={styles.appContainer}>
      <Header botName="Naffa3"
      avatarUrl = ""
      isFullScreen={isFullScreen}
     setIsOpen={setIsOpen}
     setIsFullScreen={setIsFullScreen}/>
      {initialLoader.loading && <Loader overlay={true} message="Loading chats..." />}
      {newChatLoader.loading && <Loader overlay={true} message="Creating new chat..." />}
      {editChatLoader.loading && <Loader overlay={true} message="Saving changes..." />}
      {deleteChatLoader.loading && <Loader overlay={true} message="Deleting chat..." />}
      <div style={styles.container}>
      {!hideSidebar && (
        <Sidebar
          chats={chats}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
          selectedChat={selectedChat}
          isLoading={chatSelectLoader.loading}
        />
         )}
        <ChatWindow
          selectedChat={selectedChat}
          onSend={handleSend}
          isLoading={sendMessageLoader.loading}
          isChatLoading={chatSelectLoader.loading}
        />
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  container: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
};

export default Chatbot;
