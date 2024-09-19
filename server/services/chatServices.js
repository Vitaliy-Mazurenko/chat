import { Chat } from "../db/models/Chat.js";

export const findAllChats = async () => {
  const data = await Chat.find();
  return {
    data,
  };
};
export const findOneUserChat = filter => {
  return Chat.findOne(filter);
};
export const createChat = async data => {
  const chat = new Chat(data);
  return chat.save();
};
export const updateChat = async ({ _id, data }) => {
  return Chat.findOneAndUpdate({ _id }, data, { new: true });
};
export const removeChat = async id => {
  return Chat.findOneAndDelete(id);
};
export const getQuote = async () => {
  try {
    const response = await fetch("https://johndturn-quotableapiproxy.web.val.run?tags=Inspirational");
    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }
    const quoteData = await response.json();
    const data = { id: quoteData._id, quote: quoteData.content, isMine: true };
    return data;
  } catch (err) {
    console.error("Error fetching quote:", err);
    throw err;
  }
};
export const saveChat = async chat => {
  try {
    await chat.save();
  } catch (err) {
    console.error("Error saving chat:", err);
    throw new Error("Failed to save chat");
  }
};
export const searchChats = async query => {
  const searchParams = {
    $or: [
      { firstName: new RegExp(query, "i") },
      { lastName: new RegExp(query, "i") },
      { "messages.text": new RegExp(query, "i") },
    ],
  };

  const result = await Chat.find(searchParams);

  return result;
};
