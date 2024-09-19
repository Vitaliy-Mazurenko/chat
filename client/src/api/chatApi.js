import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const fetchChats = async () => {
  const { data } = await axios.get("chats");
  return data.chats.data;
};

export const getOneChat = async chatId => {
  const { data } = await axios.get(`chats/${chatId}`);
  return data.chat;
};

export const sendMessage = async ({ chatId, message, isMine }) => {
  const { data } = await axios.post(`chats/${chatId}/messages`, {
    text: message,
    author: chatId,
    isMine: isMine,
  });
  return data;
};

