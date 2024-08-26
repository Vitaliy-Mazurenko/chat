import ctrlWrapper from "../decorators/ctrlWrapper.js";
import * as chatServices from "../services/chatServices.js";
import HttpError from "../utils/HttpError.js";

const getAllChats = async (req, res) => {
  const chats = await chatServices.findAllChats();

  res.status(200).json({
    message: "Chats got successfully",
    chats,
  });
};

const getOneUserChat = async (req, res) => {
  const { chatId: id } = req.params;
  const chat = await chatServices.findOneUserChat({ _id: id });
  if (!chat) {
    throw HttpError(404, `Chat by id ${id} not found`);
  }
  res.status(200).json({
    message: "Chats got successfully",
    chat,
  });
};

const createChat = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    throw HttpError(400, "First and last names are required");
  }
  const chat = await chatServices.createChat({
    firstName,
    lastName,
    messages: [],
  });
  res.status(201).json({
    status: 201,
    message: "Chat created successfully",
    chat,
  });
};

const updateChat = async (req, res) => {
  const { chatId: id } = req.params;

  const { firstName, lastName } = req.body;
  const updatedChat = await chatServices.updateChat({
    _id: id,
    data: {
      firstName,
      lastName,
    },
  });
  if (!updatedChat) {
    throw HttpError(404, `Chat with id ${id} not found`);
  }
  res.status(200).json({
    status: 200,
    message: "Chat updated successfully",
    updatedChat,
  });
};

const deleteChat = async (req, res) => {
  const { id } = req.params;
  const removedChat = await chatServices.removeChat(id);
  if (!removedChat) {
    throw HttpError(404, `Chat with id ${id} not found`);
  }
  res.status(200).json({
    ststus: 200,
    message: "Chat removed successfully",
  });
};

const sendMessage = async (req, res) => {
  const { text, author } = req.body;
  const { chatId: id } = req.params;

  if (!text) {
    throw HttpError(400, "Text is required");
  }
  const chat = await chatServices.findOneUserChat({ _id: id });

  if (!chat) {
    throw HttpError(404, "Chat not found");
  }
  const message = { text, author };

  chat.messages.push(message);

  await chatServices.saveChat(chat);
  res.status(201).json(message);

  setTimeout(async () => {
    try {
      const { id, quote } = await chatServices.getQuote();
      const autoResponse = { text: quote, author: id };
      chat.messages.push(autoResponse);
      await chatServices.saveChat(chat);
    } catch (err) {
      console.error("Failed to fetch quote from Quotable:", err);
    }
  }, 3000);
};

const searchChats = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw HttpError(400, "Search parameter is required");
  }

  const chats = await chatServices.searchChats(query);

  res.status(200).json({
    message: "Chats searched successfully",
    chats,
  });
};
export default {
  getAllChats: ctrlWrapper(getAllChats),
  getOneUserChat: ctrlWrapper(getOneUserChat),
  createChat: ctrlWrapper(createChat),
  updateChat: ctrlWrapper(updateChat),
  deleteChat: ctrlWrapper(deleteChat),
  sendMessage: ctrlWrapper(sendMessage),
  searchChats: ctrlWrapper(searchChats),
};
