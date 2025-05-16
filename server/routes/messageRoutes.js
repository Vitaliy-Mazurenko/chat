import express from 'express';
import axios from 'axios';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

const router = express.Router();
const QUOTABLE_API_URL = 'https://johndturn-quotableapiproxy.web.val.run?tags=Inspirational';

// GET all messages 
router.get('/:chatId', async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new message 
router.post('/:chatId', async (req, res) => {
    const { text, sender } = req.body;
    const chatId = req.params.chatId;

    if (!text || !sender) {
        return res.status(400).json({ message: 'Text and sender are required' });
    }
    if (sender !== 'user') {
        return res.status(400).json({ message: 'Sender must be "user" for this endpoint' });
    }

    const userMessage = new Message({
        chatId,
        text,
        sender: 'user',
    });

    try {
        const savedUserMessage = await userMessage.save();

        // Update last message in chat
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: savedUserMessage.text,
            lastMessageTimestamp: savedUserMessage.timestamp
        });
        
        res.status(201).json(savedUserMessage);

        // After 3 seconds, fetch a quote and send it as a bot message
        setTimeout(async () => {
            try {
                const response = await axios.get(QUOTABLE_API_URL);
                const quote = response.data[0];

                const botMessage = new Message({
                    chatId,
                    text: `${quote.content}`,
                    sender: 'bot',
                });
                const savedBotMessage = await botMessage.save();
                
                 await Chat.findByIdAndUpdate(chatId, {
                    lastMessage: savedBotMessage.text,
                    lastMessageTimestamp: savedBotMessage.timestamp
                });


               // console.log('Bot message saved:', savedBotMessage);

                const io = req.app.get('socketio');
                if (io) {
                    io.emit('new_message', savedBotMessage);
                    console.log('Bot message emitted via WebSocket:', savedBotMessage);
                } else {
                    console.error('Socket.IO instance not found on app object.');
                }

            } catch (error) {
                console.error('Error fetching quote or saving bot message:', error);

                const errorMessage = new Message({
                    chatId,
                    text: "I'm sorry, I couldn't fetch a quote right now.",
                    sender: 'bot',
                });
                const savedErrorMessage = await errorMessage.save(); 
                 await Chat.findByIdAndUpdate(chatId, {
                    lastMessage: savedErrorMessage.text,
                    lastMessageTimestamp: savedErrorMessage.timestamp
                });

                const io = req.app.get('socketio');
                if (io) {
                    io.emit('new_message', savedErrorMessage); 
                    console.log('Bot error message emitted via WebSocket:', savedErrorMessage);
                } else {
                    console.error('Socket.IO instance not found on app object for error message.');
                }
            }
        }, 2900);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router; 
