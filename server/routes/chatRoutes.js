import express from 'express';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js'; 

const router = express.Router();

// GET all chats
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ lastMessageTimestamp: -1 }); 
        res.json(chats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new chat
router.post('/', async (req, res) => {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }
    const chat = new Chat({ firstName, lastName });
    try {
        const newChat = await chat.save();
        res.status(201).json(newChat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update an existing chat
router.put('/:id', async (req, res) => {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName },
            { new: true } // returns the updated document
        );
        if (!updatedChat) return res.status(404).json({ message: 'Chat not found' });
        res.json(updatedChat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a chat
router.delete('/:id', async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        
        // Also delete all messages associated with this chat
        await Message.deleteMany({ chatId: req.params.id });
        
        res.json({ message: 'Chat and associated messages deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router; 