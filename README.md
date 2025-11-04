# SafeChat 🛡️

> A modern, AI-powered secure messaging platform with real-time threat detection

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism design** with animated gradient backgrounds
- **Light/Dark mode toggle** with smooth transitions
- **Responsive layout** for desktop, tablet, and mobile
- **Smooth animations** and micro-interactions throughout
- **Emoji picker** for expressive messaging
- **Real-time message timestamps**

### 🛡️ AI-Powered Security (NEW!)
- **Real-time phishing detection** 🎣
- **Spam message filtering** 🚫
- **Animated threat indicators** with modern visual warnings
- **Detailed threat explanations** to educate users
- **Continuous monitoring** of all messages
- **Zero user intervention** - automatic protection

### 🚀 Real-Time Messaging
- **WebSocket-based** instant message delivery
- **Message persistence** with MongoDB
- **User authentication** with JWT tokens
- **Auto-scrolling** to latest messages
- **Online status indicators**

## 🎯 Threat Detection System

SafeChat integrates an advanced AI/ML prediction service that analyzes every message for:

### Phishing Attempts 🎣
Messages that try to steal personal information through:
- Suspicious links
- Impersonation attempts
- Urgent action requests
- Financial scams

**Visual Indicators:**
- 🚨 Red glowing border with pulse animation
- ⚠️ Triangle warning icon with shake effect
- 🎣 "PHISHING" badge with gradient background
- 📝 Detailed warning with protective guidance
- ✨ Animated scan line for continuous attention

### Spam Messages 🚫
Unwanted or repetitive messages including:
- Mass promotional content
- Repetitive text patterns
- Excessive capitalization
- Multiple exclamation marks

**Visual Indicators:**
- 🚨 Red glowing border with pulse animation
- ⚠️ Circle alert icon with shake effect
- 🚫 "SPAM" badge with gradient background
- 📝 Brief warning notification
- ✨ Animated scan line for visibility

## 📸 Screenshots

### Safe Messages (Normal)
Clean, modern interface with gradient message bubbles and smooth animations.

### Threat Detected (Phishing/Spam)
Beautiful red-themed warnings with:
- Animated threat indicators
- Pulsing borders and glowing effects
- Icon shake animations on appearance
- Continuous scanning animation
- Bouncing warning emoji
- Detailed protective guidance

## 🏗️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Socket.IO Client 4.8.1** - Real-time communication
- **Axios 1.7.7** - HTTP requests
- **React Router 7.0.1** - Navigation
- **CSS3** - Modern animations and glassmorphism

### Backend
- **Node.js** with Express
- **Socket.IO** - WebSocket server
- **MongoDB** with Mongoose - Database
- **JWT** - Authentication
- **CORS** - Cross-origin support

### AI/ML (Threat Detection)
- **Python** prediction service (port 8080)
- **Flask API** for message analysis
- **Machine Learning models** for classification
- Returns `is_phising` and `is_spam` flags

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running instance)
- Python 3.8+ (for threat detection)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SafeChat.git
   cd SafeChat
   ```

2. **Set up the prediction service**
   ```bash
   cd SPAM_PHISING_DETECTOR
   pip install -r requirements.txt
   cp sample.env .env
   # Edit .env with your API keys
   python app.py
   ```
   The prediction service will run on `http://localhost:8080`

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   # PORT=5000
   node server.js
   ```
   The backend will run on `http://localhost:5000`

4. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   # Create .env file with:
   # REACT_APP_API_BASE_URL=http://localhost:5000
   npm start
   ```
   The app will open at `http://localhost:3000`

## 📚 Documentation

- **[THREAT_DETECTION_FEATURE.md](frontend/THREAT_DETECTION_FEATURE.md)** - Complete guide to the threat detection system
- **[THREAT_VISUAL_GUIDE.md](frontend/THREAT_VISUAL_GUIDE.md)** - Visual comparison and animation details
- **[THEME_FEATURE.md](frontend/THEME_FEATURE.md)** - Light/dark mode documentation
- **[FEATURES.md](frontend/FEATURES.md)** - Full feature list
- **[API_DOCUMENTATION.md](SPAM_PHISING_DETECTOR/API_DOCUMENTATION.md)** - Prediction service API reference

## 🎬 How It Works

### Message Flow with Threat Detection

```
1. User types message
   ↓
2. Frontend sends via WebSocket
   ↓
3. Backend receives message
   ↓
4. Backend calls prediction service (Python API on port 8080)
   ↓
5. ML model analyzes message
   ↓
6. Returns { is_phising: bool, is_spam: bool }
   ↓
7. Backend saves to MongoDB with threat flags
   ↓
8. Backend broadcasts to all clients
   ↓
9. Frontend receives message
   ↓
10. Frontend checks threat flags
   ↓
11. Renders with animations if threat detected
   ↓
12. User sees beautiful warning! ✨
```

## 🎨 Animation Features

All threat indicators include modern animations:

- **Pulse Animation** - Subtle scale breathing effect (2s infinite)
- **Scan Animation** - Gradient sweep across message (2s infinite)
- **Shake Animation** - Icon shake on appearance (0.5s once)
- **Glow Animation** - Pulsing drop-shadow (2s infinite)
- **Pop Animation** - Badge entrance with rotation (0.5s once)
- **Slide Animation** - Warning footer entrance (0.5s once)
- **Bounce Animation** - Warning emoji bounce (1s infinite)

All animations are:
- ✅ GPU-accelerated (smooth 60fps)
- ✅ CSS-only (zero JavaScript overhead)
- ✅ Responsive (mobile-optimized)
- ✅ Theme-aware (light/dark mode)

## 🔒 Security Features

- **End-to-end threat detection** on all messages
- **No user action required** - automatic protection
- **Visual education** - users learn to recognize threats
- **Clear warnings** - specific guidance for each threat type
- **Non-intrusive** - messages remain readable
- **Persistent indicators** - warnings don't disappear

## 🎯 Use Cases

- **Personal messaging** with built-in protection
- **Team collaboration** with spam filtering
- **Customer support** with phishing detection
- **Educational platforms** teaching cybersecurity
- **Community chat** with automatic moderation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- AI/ML models for threat detection
- React and Socket.IO communities
- Modern CSS animation techniques
- Glassmorphism design inspiration

---

**Made with ❤️ and 🛡️ for a safer internet**