import { Schema, model } from "mongoose";
import { mongoSaveError } from "./hooks.js";

const messageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const chatSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
chatSchema.post("save", mongoSaveError);
export const Chat = model("chat", chatSchema);
