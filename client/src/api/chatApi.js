import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const fetchChats = async () => {
  const { data } = await axios.get("chats");
  return data.chats.data;
};
