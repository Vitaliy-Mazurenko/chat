import React, { useState, useEffect } from 'react';
import { ChatFormData } from '../../types';
import './ChatForm.css';

interface ChatFormProps {
  onSubmit: (formData: ChatFormData) => void;
  onCancel: () => void;
  initialData?: ChatFormData;
  submitButtonText?: string;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit, onCancel, initialData, submitButtonText = "Create" }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
    } else {
      setFirstName('');
      setLastName('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Both first name and last name are required.');
      return;
    }
    setError(null);
    onSubmit({ firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      {error && <p className="chat-form__error">{error}</p>}
      <div className="chat-form__group">
        <label htmlFor="firstName" className="chat-form__label">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="chat-form__input"
          required
        />
      </div>
      <div className="chat-form__group">
        <label htmlFor="lastName" className="chat-form__label">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="chat-form__input"
          required
        />
      </div>
      <div className="chat-form__actions">
        <button type="submit" className="chat-form__button submit">{submitButtonText}</button>
        <button type="button" onClick={onCancel} className="chat-form__button cancel">Cancel</button>
      </div>
    </form>
  );
};

export default ChatForm; 