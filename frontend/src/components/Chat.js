import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../styles/Chat.css';

const socket = io(process.env.REACT_APP_API_BASE_URL, {
  transports: ['websocket'], // Ensure WebSocket transport is used
  reconnection: true,        // Enable automatic reconnection
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const username = localStorage.getItem('username'); // Fetch username from localStorage

  useEffect(() => {
    // Fetch existing messages on load
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        alert('Could not load chat messages. Please try again.');
      }
    };

    fetchMessages();

    // Listen for new messages via WebSocket
    socket.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup WebSocket listeners on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const msg = { user: username, message }; // Use username instead of userId

      try {
        // Emit the message to the server via WebSocket
        socket.emit('sendMessage', msg);
        setMessage(''); // Clear input after sending
      } catch (error) {
        console.error('Failed to send message:', error);
        alert('Could not send your message. Please try again.');
      }
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/messages`); // Clear messages on the server
      setMessages([]); // Clear messages in UI
    } catch (error) {
      console.error('Failed to clear chat:', error);
      alert('Could not clear the chat. Please try again.');
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1 className="chat-app-name">SafeChat</h1>
        <div>
          <button onClick={clearChat} className="clear-chat-button">Clear Chat</button>
          <button onClick={handleSignOut} className="signout-button">Sign Out</button>
        </div>
      </header>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.user === username ? 'own-message' : 'other-message'}`}>
            <div className="message-user">{msg.user}</div> {/* Display actual username */}
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
