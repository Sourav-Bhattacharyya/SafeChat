import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import '../styles/Chat.css';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'light' ? false : true; // Default to dark mode
  });
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem('username'); // Fetch username from localStorage
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '✨', '🎉', '💯'];

  // Toggle theme
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // If user is not signed in redirect to login
    if (!username) {
      navigate('/');
      return;
    }

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

    // Initialize socket after we've confirmed user is signed in
    socketRef.current = io(process.env.REACT_APP_API_BASE_URL, {
      transports: ['websocket'], // Ensure WebSocket transport is used
      reconnection: true,        // Enable automatic reconnection
    });

    // Listen for new messages via WebSocket
    socketRef.current.on('receiveMessage', (msg) => {
      console.log('📨 Received message via WebSocket:', msg);
      console.log('Threat flags:', { is_phising: msg.is_phising, is_spam: msg.is_spam });
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup WebSocket listeners on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('receiveMessage');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [username, navigate]);

  const sendMessage = async () => {
    if (message.trim()) {
      const msg = { user: username, message }; // Use username instead of userId

      try {
        // Emit the message to the server via WebSocket (if connected)
        if (socketRef.current) socketRef.current.emit('sendMessage', msg);
        setMessage(''); // Clear input after sending
        setShowEmojiPicker(false);
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

  const addEmoji = (emoji) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (date) => {
    const msgDate = new Date(date);
    return msgDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chat-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="chat-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <header className="chat-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.72 3.63 17.19L2.05 21.95L6.93 20.4C8.36 21.37 10.1 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="url(#logo-gradient)"/>
                <defs>
                  <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="chat-app-name">SafeChat</h1>
          </div>
          <span className="ai-badge">AI-Protected Messaging</span>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">{username?.charAt(0).toUpperCase()}</div>
            <span className="username-display">{username}</span>
          </div>
          <button onClick={toggleTheme} className="icon-button theme-toggle-button" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <button onClick={clearChat} className="icon-button clear-button" title="Clear Chat">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={handleSignOut} className="icon-button signout-button" title="Sign Out">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 16L21 12M21 12L17 8M21 12H9M12 16V17C12 18.6569 10.6569 20 9 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H9C10.6569 4 12 5.34315 12 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>No messages yet</h3>
              <p>Start the conversation by sending a message</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isPhishing = msg.is_phising === true;
              const isSpam = msg.is_spam === true;
              const isThreat = isPhishing || isSpam;
              
              // Debug logging
              if (isThreat) {
                console.log('🚨 Threat detected:', { 
                  message: msg.message, 
                  isPhishing, 
                  isSpam, 
                  fullMsg: msg 
                });
              }
              
              return (
                <div 
                  key={index} 
                  className={`chat-message ${msg.user === username ? 'own-message' : 'other-message'} ${isThreat ? 'threat-message' : ''} fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`message-bubble ${isThreat ? 'threat-bubble' : ''}`}>
                    {isThreat && (
                      <div className="threat-indicator">
                        <div className="threat-pulse"></div>
                        <div className="threat-icon">
                          {isPhishing ? (
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="threat-badge">
                          {isPhishing ? '🎣 PHISHING' : ''}
                          {isSpam ? '🚫 SPAM' : ''}
                        </span>
                      </div>
                    )}
                    <div className="message-header">
                      <span className="message-user">{msg.user}</span>
                      <span className="message-time">{formatTime(msg.timestamp || Date.now())}</span>
                    </div>
                    <div className="message-text">{msg.message}</div>
                    {isThreat && (
                      <div className="threat-warning">
                        <div className="warning-icon">⚠️</div>
                        <div className="warning-text">
                          {isPhishing 
                            ? 'This message may be a phishing attempt. Do not click any links or share personal information.'
                            : 'This message has been flagged as spam.'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-wrapper">
        {showEmojiPicker && (
          <div className="emoji-picker">
            {emojis.map((emoji, index) => (
              <button 
                key={index} 
                className="emoji-button" 
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <div className="chat-input-container">
          <button 
            className="emoji-toggle-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Add Emoji"
          >
            😊
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button 
            onClick={sendMessage} 
            className="chat-send-button"
            disabled={!message.trim()}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
