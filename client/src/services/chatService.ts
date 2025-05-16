import axios from 'axios';
import { Chat, ChatFormData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/chats'; // Убедитесь, что REACT_APP_API_URL задан в .env

export const getChats = async (): Promise<Chat[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createChat = async (chatData: ChatFormData): Promise<Chat> => {
    const response = await axios.post(API_URL, chatData);
    return response.data;
};

export const updateChat = async (id: string, chatData: ChatFormData): Promise<Chat> => {
    const response = await axios.put(`${API_URL}/${id}`, chatData);
    return response.data;
};

export const deleteChat = async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}; 