require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Message = require('./models/Message');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Environment Variable Validation
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  throw new Error('Missing required environment variables');
}

// Connect to MongoDB with Retry
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => console.log(err));

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Retrying...');
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Use Routes
app.use('/user', authRoutes);
app.use('/', chatRoutes);

// WebSocket Communication
io.on('connection', socket => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    const newMessage = new Message(message);
    newMessage.save().then(() => {
      io.emit('receiveMessage', message);
    }).catch(err => console.error(err));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
