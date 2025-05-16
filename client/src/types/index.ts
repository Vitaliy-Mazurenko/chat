export interface Chat {
  _id: string;
  firstName: string;
  lastName: string;
  lastMessage?: string;
  lastMessageTimestamp?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // avatar?: string; // Если будете добавлять аватары
}

export interface Message {
  _id: string;
  chatId: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // ISO date string
}

// Для формы создания/обновления чата
export interface ChatFormData {
  firstName: string;
  lastName: string;
} 