import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { Chat, ChatFormData } from '../../types';

interface EditChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitChat: (chatDetails: ChatFormData) => void;
  chat: Chat | null; 
}

const EditChatModal: React.FC<EditChatModalProps> = ({ isOpen, onClose, onSubmitChat, chat }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (chat) {
      setFirstName(chat.firstName || '');
      setLastName(chat.lastName || '');
      setError('');
    } else {
      setFirstName('');
      setLastName('');
      setError('');
    }
  }, [chat, isOpen]); 

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Name and surname are required to fill out.');
      return;
    }
    setError('');
    onSubmitChat({ firstName, lastName });
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !chat) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit chat: ${chat.firstName} ${chat.lastName}`}>
      <form onSubmit={handleSubmit} className="edit-chat-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="edit-firstName">Name:</label>
          <input
            type="text"
            id="edit-firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-lastName">Surname:</label>
          <input
            type="text"
            id="edit-lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleClose} className="button-secondary">
            Cancel
          </button>
          <button type="submit" className="button-primary">
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditChatModal; 