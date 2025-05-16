import React, { useEffect } from 'react';
import './Toast.css';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`}>
      <div className="toast__message">{toast.message}</div>
      <button className="toast__close-button" onClick={() => onClose(toast.id)}>&times;</button>
    </div>
  );
};

export default Toast; 