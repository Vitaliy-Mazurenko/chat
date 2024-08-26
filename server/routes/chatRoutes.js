import express from "express";
import chatController from "../controllers/chatController.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
const chatRouter = express.Router();

chatRouter.get("/search", chatController.searchChats);
chatRouter.get("/", chatController.getAllChats);
chatRouter.get("/:chatId", chatController.getOneUserChat);
chatRouter.post("/", isEmptyBody, chatController.createChat);
chatRouter.patch("/:chatId", isEmptyBody, chatController.updateChat);
chatRouter.delete("/:chatId", chatController.deleteChat);
chatRouter.post("/:chatId/messages", isEmptyBody, chatController.sendMessage);

export default chatRouter;
