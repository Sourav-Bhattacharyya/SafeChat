import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../styles/Chat.css';

const socket = io(process.env.REACT_APP_API_BASE_URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username'); // Fetch username from localStorage

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Fetch existing messages
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/messages`).then((response) => {
      setMessages(response.data);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msg = { user: username, message }; // Use username instead of userId
      socket.emit('sendMessage', msg);
      setMessages((prevMessages) => [...prevMessages, msg]); // Optimistic update
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1 className="chat-app-name">SafeChat</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="signout-button">
          Sign Out
        </button>
      </header>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.user === username ? 'own-message' : 'other-message'}`}>
            <div className="message-user">{msg.user}</div> {/* Show actual username */}
            <div className="message-text">{msg.message}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
