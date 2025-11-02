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

// Helper: call prediction service to get is_phising & is_spam
// Ensure we send only the message text (string) to the prediction service.
// Increase default timeout to 15s because the prediction service can be slow
const fetchPrediction = (msg, timeout = 15000) => {
  const http = require('http');
  return new Promise((resolve) => {
    try {
      const text = (typeof msg === 'string')
        ? msg
        : (msg && (msg.message || msg.text))
          ? (msg.message || msg.text)
          : JSON.stringify(msg);

      const postData = JSON.stringify({ message: text });

  // Debug: show what we're sending to the prediction service
  console.log('Prediction request payload:', postData);

      const req = http.request({
        hostname: '127.0.0.1',
        port: 8080,
        path: '/predict',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout
      }, (res) => {
        let data = '';
        const { statusCode } = res;
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            // Log raw response string for easier debugging
            console.log('Prediction raw response (string):', data);
            const parsed = JSON.parse(data || '{}');
            // Debug: log parsed response from predictor
            console.log('Prediction parsed response:', parsed);
            console.log('Prediction status code:', statusCode);
            if (statusCode !== 200) {
              console.error('Prediction service returned non-200:', statusCode, parsed);
              return resolve({ is_phising: false, is_spam: false });
            }

            // Expect parsed to contain is_phising and is_spam (booleans)
            resolve({
              is_phising: parsed.is_phising === true || parsed.is_phising === 'true',
              is_spam: parsed.is_spam === true || parsed.is_spam === 'true'
            });
          } catch (e) {
            console.error('Prediction parse error:', e);
            console.error('Prediction raw response (string) at parse error:', data);
            resolve({ is_phising: false, is_spam: false });
          }
        });
      });

      req.on('error', (err) => {
        console.error('Prediction request error:', err.message);
        resolve({ is_phising: false, is_spam: false });
      });

      req.on('timeout', () => {
        req.destroy();
        console.error('Prediction request timed out');
        resolve({ is_phising: false, is_spam: false });
      });

      req.write(postData);
      req.end();
    } catch (err) {
      console.error('Prediction call failed:', err);
      resolve({ is_phising: false, is_spam: false });
    }
  });
};

// Debug route: POST { message: <text> } -> returns prediction (does not save)
app.post('/debug/predict', async (req, res) => {
  try {
    const body = req.body;
    const prediction = await fetchPrediction(body).catch(() => ({ is_phising: false, is_spam: false }));
    res.status(200).json(prediction);
  } catch (err) {
    console.error('Debug predict error:', err);
    res.status(500).json({ error: 'Debug predict failed' });
  }
});

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

  // Use the top-level fetchPrediction helper (defined above)

  socket.on('sendMessage', async (message) => {
    try {
      // Call prediction service to classify message using top-level helper
      const prediction = await fetchPrediction(message).catch(() => ({ is_phising: false, is_spam: false }));

      // Attach predicted fields to message object
      const messageWithFlags = Object.assign({}, message, {
        is_phising: !!prediction.is_phising,
        is_spam: !!prediction.is_spam
      });

      // Log the message object we'll persist
      console.log('Saving message with flags:', messageWithFlags);

      // Persist and emit the saved document (to include _id, timestamp, etc.)
      const newMessage = new Message(messageWithFlags);
      const saved = await newMessage.save();
      console.log('Saved message:', saved);
      io.emit('receiveMessage', saved);
    } catch (err) {
      console.error('Failed to save/emit message:', err);
    }
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
