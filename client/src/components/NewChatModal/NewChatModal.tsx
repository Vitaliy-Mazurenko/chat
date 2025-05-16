import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './NewChatModal.css';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitChat: (chatDetails: { firstName: string; lastName: string }) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onSubmitChat }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Name and surname are required to fill out.');
      return;
    }
    setError('');
    onSubmitChat({ firstName, lastName });
    setFirstName('');
    setLastName('');
    // onClose();
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a new chat">
      <form onSubmit={handleSubmit} className="new-chat-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="firstName">Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Surname:</label>
          <input
            type="text"
            id="lastName"
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
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewChatModal; 