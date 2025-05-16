import React from 'react';
import { Chat } from '../../types';
import './ChatList.css'; 
import ChatListItem from './ChatListItem/ChatListItem'; 

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onEditChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;

}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChat, onSelectChat, onEditChat, onDeleteChat }) => {
  if (chats.length === 0) {
    return <div className="chat-list-empty">No chats yet. Create one or check back later.</div>;
  }

  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <ChatListItem
            key={chat._id}
            chat={chat}
            isSelected={selectedChat?._id === chat._id}
            onSelectChat={onSelectChat}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
        />
      ))}
    </ul>
  );
};

export default ChatList; 