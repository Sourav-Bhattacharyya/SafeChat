const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Fetch Chat Messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear Chat Messages
router.delete('/messages', async (req, res) => {
  try {
    await Message.deleteMany({});
    res.status(200).json({ message: 'Chat cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
