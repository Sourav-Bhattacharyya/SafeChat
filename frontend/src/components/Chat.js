// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(process.env.REACT_APP_API_BASE_URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/messages`).then((response) => {
      setMessages(response.data);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msg = { user: userId, message };
      socket.emit('sendMessage', msg);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user}</strong>: {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
