import React, { useState, useEffect, useRef } from 'react';
import { Chat, Message } from '../../types';
import './ChatView.css';

interface ChatViewProps {
  chat: Chat;
  messages: Message[];
  isLoadingMessages: boolean; 
  errorMessages: string | null; 
  onSendMessage: (chatId: string, text: string) => Promise<void>; 
}

const ChatView: React.FC<ChatViewProps> = ({ chat, messages, isLoadingMessages, errorMessages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); 

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    await onSendMessage(chat._id, newMessage); 
    setNewMessage(''); 
  };

  const formatMessageTimestamp = (isoTimestamp: string): string => {
    const date = new Date(isoTimestamp);
        return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }); 

  };

  return (
    <div className="chat-view">
      <header className="chat-view__header">
        <img src={'/img/default-avatar.png'} alt={chat.firstName} className="chat-view__avatar" />
        <div className="chat-view__header-info">
            <h2 className="chat-view__name">{chat.firstName} {chat.lastName}</h2>
        </div>
      </header>
      <div className="chat-view__messages-area">
        {isLoadingMessages && <div className="chat-view__status-overlay">Loading messages...</div>}
        {errorMessages && <div className="chat-view__status-overlay error">{errorMessages}</div>}
        {!isLoadingMessages && !errorMessages && messages.length === 0 && (
            <div className="chat-view__status-overlay">No messages yet. Send one!</div>
        )}
        {!isLoadingMessages && !errorMessages && messages.map((msg) => (
          <div key={msg._id} className={`message-item ${msg.sender === 'user' ? 'user' : 'bot'}`}>
            <div className="message-item__bubble">
              <p className="message-item__text">{msg.text}</p>
              <span className="message-item__timestamp">{formatMessageTimestamp(msg.timestamp)}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> 
      </div>
      <form className="chat-view__input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-view__input"
        />
        <button type="submit" className="chat-view__send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatView; 