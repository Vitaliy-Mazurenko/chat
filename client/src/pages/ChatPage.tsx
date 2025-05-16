import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import './ChatPage.css';
import ChatList from '../components/ChatList/ChatList';
import ChatView from '../components/ChatView/ChatView';
import NewChatModal from '../components/NewChatModal/NewChatModal';
import EditChatModal from '../components/EditChatModal/EditChatModal';
import { Chat, Message, ChatFormData } from '../types'; 
import * as _ from 'lodash'; 
import { getChats as apiGetChats, createChat as apiCreateChat, deleteChat as apiDeleteChat, updateChat as apiUpdateChat } from '../services/chatService';
import { getMessages as apiGetMessages, sendMessage as apiSendMessage } from '../services/messageService'; 
import { useToast } from '../context/ToastProvider'; 

const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

type SocketInstance = ReturnType<typeof io>;

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]); 
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const selectedChatRef = useRef<Chat | null>(null); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [errorChats, setErrorChats] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null); 
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false); 
  const [isEditChatModalOpen, setIsEditChatModalOpen] = useState(false); 
  const [chatToEdit, setChatToEdit] = useState<Chat | null>(null); 
  const { addToast } = useToast(); 
  const socketRef = useRef<SocketInstance | null>(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const handleNewMessage = useCallback((newMessage: Message) => {

    apiGetChats().then(updatedChats => {
      setChats(updatedChats);
      const chatDetailsForToast = updatedChats.find(c => c._id === newMessage.chatId);

      if (selectedChatRef.current && newMessage.chatId === selectedChatRef.current._id) {
        setMessages(prevMessages => {
          if (prevMessages.find(msg => msg._id === newMessage._id)) return prevMessages;
          return [...prevMessages, newMessage];
        });
        const toastSenderName = newMessage.sender === 'bot' ? 'bot' : (chatDetailsForToast?.firstName || 'Interlocutor');
        addToast(`New message from ${toastSenderName}: "${_.truncate(newMessage.text, { length: 50 })}"`, 'info');
        if (chatDetailsForToast) {
          setSelectedChat(chatDetailsForToast);
        }
      } else if (newMessage.sender === 'bot' && chatDetailsForToast) {
        console.log('New message is a bot message for a non-selected chat');
        addToast(`New message in chat ${chatDetailsForToast.firstName} ${chatDetailsForToast.lastName}`, 'info', 5000);
      } else {
        console.log('New message is not for the selected chat OR not a bot message for other chats.');
      }
    }).catch((err: Error) => console.error("Error refetching chats after new message:", err));

  }, [addToast]); 

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    const currentSocket = socketRef.current;

    currentSocket.on('connect', () => {
      console.log('Socket connected:', currentSocket.id);
    });

    currentSocket.on('new_message', handleNewMessage);

    currentSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    currentSocket.on('connect_error', (err: Error) => {
        console.error('Socket connection error:', err);
        addToast('Chat server connection error (WebSocket)', 'error');
    });

    return () => {
      currentSocket.off('new_message', handleNewMessage);
      currentSocket.disconnect();
      socketRef.current = null;
    };
  }, [addToast, handleNewMessage]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoadingChats(true);
        setErrorChats(null);
        const fetchedChats = await apiGetChats();
        setChats(fetchedChats);
        if (fetchedChats.length > 0 && !selectedChatRef.current) {
            setSelectedChat(fetchedChats[0]);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setErrorChats("Failed to load chats. Please try again later.");
      } finally {
        setIsLoadingChats(false);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const fetchInitialMessages = async () => {
        try {
          setIsLoadingMessages(true);
          setErrorMessages(null);
          const fetchedMessages = await apiGetMessages(selectedChat._id);
          setMessages(fetchedMessages);
        } catch (err) {
          console.error(`Failed to fetch messages for chat ${selectedChat._id}:`, err);
          setErrorMessages("Failed to load messages.");
          setMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchInitialMessages();
    } else {
      setMessages([]);
    }
  }, [selectedChat]); 

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleOpenNewChatModal = () => {
    setIsNewChatModalOpen(true);
  };

  const handleCloseNewChatModal = () => {
    setIsNewChatModalOpen(false);
  };

  const handleCreateNewChat = async (chatDetails: ChatFormData) => {
    try {
      setErrorChats(null);
      const newChat = await apiCreateChat(chatDetails);
      setChats(prevChats => [newChat, ...prevChats]);
      setSelectedChat(newChat); 
      addToast(`Chat ${newChat.firstName} ${newChat.lastName} created!`, 'success');
      handleCloseNewChatModal();
      setChatToEdit(null); 
      handleCloseEditChatModal();

    } catch (err) {
      console.error("Failed to create new chat:", err);
      setErrorChats("Failed to create chat. Please try again.");
      addToast("Failed to create chat.", 'error');
    }
  };

  const handleStartEditChat = (chat: Chat) => {
    setChatToEdit(chat);
    setIsEditChatModalOpen(true);
  };

  const handleCloseEditChatModal = () => {
    setIsEditChatModalOpen(false);
    setChatToEdit(null);
  };

  const handleUpdateChat = async (chatDetails: ChatFormData) => {
    if (!chatToEdit) return;
    try {
      const updatedChat = await apiUpdateChat(chatToEdit._id, chatDetails); 
      setChats(prevChats => prevChats.map(c => c._id === updatedChat._id ? updatedChat : c));
      if (selectedChatRef.current?._id === updatedChat._id) {
        setSelectedChat(updatedChat);
      }
      addToast(`Chat ${updatedChat.firstName} ${updatedChat.lastName} updated.`, 'success');
      handleCloseEditChatModal();
    } catch (err) {
      console.error("Failed to update chat:", err);
       alert('Failed to update chat. Please check console for details.'); 
       addToast("Error updated chat.", 'error');
    }
  };

  const handleConfirmDeleteChat = async (chatId: string) => {
    if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      try {
        setErrorChats(null);
        const chatToDelete = chats.find(c => c._id === chatId);
        await apiDeleteChat(chatId);
        setChats(prevChats => prevChats.filter(c => c._id !== chatId));
        if (selectedChatRef.current?._id === chatId) { 
          const remainingChats = chats.filter(c => c._id !== chatId);
          setSelectedChat(remainingChats.length > 0 ? remainingChats[0] : null);
        }
        if (chatToDelete) {
            addToast(`Chat ${chatToDelete.firstName} ${chatToDelete.lastName} deleted.`, 'success');
        }
      } catch (err) {
        console.error("Failed to delete chat:", err);
        setErrorChats("Failed to delete chat. Please try again.");
        addToast("Error delete chat.", 'error');
      }
    }
  };

  const handleSendMessageAPI = async (chatId: string, text: string) => {
    if (!selectedChatRef.current) return;
    const currentChatId = selectedChatRef.current._id;

    const tempUserMessage: Message = {
      _id: `temp_${Date.now()}`,
      chatId: currentChatId, 
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);
    try {
      const savedUserMessage = await apiSendMessage(currentChatId, { text, sender: 'user' });
      setMessages(prev => prev.map(msg => msg._id === tempUserMessage._id ? savedUserMessage : msg));
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrorMessages("Failed to send message. Please try again.");
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempUserMessage._id));
      addToast("Error send message.", 'error');
    }
  };

  const filteredChats = chats.filter(chat =>
    `${chat.firstName} ${chat.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingChats) {
    return <div className="chat-page-status">Loading chats...</div>; 
  }

  if (errorChats) {
    return <div className="chat-page-status error">{errorChats}</div>; 
  }

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="chat-sidebar__header">
            <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="chat-sidebar__search"
            />
        </div>
        <div className="chat-sidebar__Chats">
          <span className="chat-sidebar__Chats-title">Chats</span>
              <button onClick={handleOpenNewChatModal} className="new-chat-button">
              New Chat
            </button>
        </div>
        <ChatList
          chats={filteredChats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onEditChat={handleStartEditChat}
          onDeleteChat={handleConfirmDeleteChat}
        />
      </div>
      <div className="chat-main">
        {selectedChat ? (
          <ChatView
            chat={selectedChat}
            messages={messages}
            isLoadingMessages={isLoadingMessages} 
            errorMessages={errorMessages}
            onSendMessage={handleSendMessageAPI}
          />
        ) : (
          <div className="chat-main__no-chat-selected">
            {chats.length > 0 ? 'Select a chat to start messaging' : 'No chats available. Create one!'}
          </div>
        )}
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={handleCloseNewChatModal}
        onSubmitChat={handleCreateNewChat}
      />
      {chatToEdit && (
        <EditChatModal
          isOpen={isEditChatModalOpen}
          onClose={handleCloseEditChatModal}
          onSubmitChat={handleUpdateChat} 
          chat={chatToEdit}
        />
      )}
    </div>
  );
};

export default ChatPage; 