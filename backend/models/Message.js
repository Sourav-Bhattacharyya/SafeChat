const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  is_phising: { type: Boolean },
  is_spam: { type: Boolean }
});

module.exports = mongoose.model('Message', messageSchema);
