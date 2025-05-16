import React from 'react';
import './App.css';
import ChatPage from './pages/ChatPage';
import { ToastProvider } from './context/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <div className="App">

        <ChatPage /> 
      </div>
    </ToastProvider>
  );
}

export default App;
