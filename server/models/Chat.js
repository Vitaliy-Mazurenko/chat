import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // We can add a field for the last message and its timestamp to easily display in the chat list
    lastMessage: { type: String },
    lastMessageTimestamp: { type: Date, default: Date.now },
    // Consider adding an avatar field if you plan to implement avatars
    // avatar: { type: String }
}, { timestamps: true }); // timestamps will add createdAt and updatedAt

const Chat = mongoose.model('Chat', chatSchema);

export default Chat; 