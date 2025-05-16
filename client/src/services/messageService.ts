import axios from 'axios';
import { Message } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL_MESSAGES || 'http://localhost:5000/api/messages'; // Убедитесь, что задан в .env

export const getMessages = async (chatId: string): Promise<Message[]> => {
    const response = await axios.get(`${API_BASE_URL}/${chatId}`);
    return response.data;
};

export interface SendMessagePayload {
    text: string;
    sender: 'user'; // На клиенте мы отправляем только сообщения от пользователя
}

export const sendMessage = async (chatId: string, messageData: SendMessagePayload): Promise<Message> => {
    const response = await axios.post(`${API_BASE_URL}/${chatId}`, messageData);
    return response.data; // Возвращает сохраненное сообщение пользователя
}; 