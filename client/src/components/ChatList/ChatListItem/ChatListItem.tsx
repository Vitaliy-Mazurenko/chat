import React from 'react';
import { Chat } from '../../../types';
import './ChatListItem.css';
import deleteIcon from "../../../img/icons/delete_icon.svg";
import editIcon from "../../../img/icons/edit_icon.svg";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelectChat: (chat: Chat) => void;
  onEditChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
}

const formatTimestamp = (isoTimestamp?: string): string => {
  if (!isoTimestamp) return '';
  const date = new Date(isoTimestamp);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours > 0) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (diffMinutes > 0) { 

    return `${diffMinutes}m ago`;
  }

  return 'Just now';
};


const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isSelected, onSelectChat, onEditChat, onDeleteChat }) => {
  return (
    <li
      className={`chat-list-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelectChat(chat)}
    >
      <img src={'./img/default-avatar.png'} alt={`${chat.firstName[0]} ${chat.lastName[0]}`} className="chat-list-item__avatar" />
      <div className="chat-list-item__content">
        <div className="chat-list-item__header">
          <span className="chat-list-item__name">{chat.firstName} {chat.lastName}</span>
          
        </div>
        <p className="chat-list-item__last-message">{chat.lastMessage || 'No messages yet'}</p>
      </div>
      <div className="chat-list-item__actions-wrapper">
      <span className="chat-list-item__timestamp">{formatTimestamp(chat.lastMessageTimestamp)}</span>
      <div className="chat-list-item__actions">
                <img src={editIcon} alt="edit" width={18} height={18} onClick={(e) => { 
            e.stopPropagation(); 
            onEditChat(chat); 
          }}
          className="edit-button"/>
        <img src={deleteIcon} alt="delete" width={19} height={21} onClick={(e) => { 
            e.stopPropagation(); 
            onDeleteChat(chat._id); 
          }}
          className="delete-button"/>
      </div>
      </div>
    </li>
  );
};

export default ChatListItem; 