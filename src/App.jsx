import { useState, useEffect } from "react";
import "./index.css";
import { messageAPI } from "./api/messages.js";

export default function App() {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // Load a random message when app starts
  useEffect(() => {
    loadRandomMessage();
  }, []);

  const loadRandomMessage = async () => {
    setLoading(true);
    try {
      const message = await messageAPI.getRandomMessage();
      setCurrentMessage(message);
    } catch (error) {
      console.error('Failed to load message:', error);
      alert('Failed to load messages. Please check your connection.');
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      alert('Please enter a message');
      return;
    }

    if (input.trim().length > 500) {
      alert('Message too long (max 500 characters)');
      return;
    }
    
    setLoading(true);
    try {
      await messageAPI.sendMessage(input.trim());
      setInput("");
      await loadRandomMessage(); // Refresh with new message including the one just sent
      alert('Message sent anonymously! 🎉');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      sendMessage();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>From Who To You</h1>
        <p>Share anonymous messages • Read anonymous messages</p>
      </header>

      <div className="app-container">
        <div className="app-content">
          {/* Write box */}
          <div className="message-box">
            <h2>Write a message</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your anonymous message... (Max 500 characters)"
              rows={6}
              disabled={loading}
              maxLength={500}
            />
            <div className="char-count">
              {input.length}/500 characters
            </div>
            <button 
              onClick={sendMessage} 
              className="send-btn"
              disabled={loading || !input.trim()}
            >
              {loading ? 'Sending...' : 'Send Anonymously'}
            </button>
            <p className="note">Ctrl + Enter to send quickly</p>
          </div>

          {/* View box */}
          <div className="message-box">
            <h2>View messages</h2>
            <div className="message-display">
              {loading ? (
                <div className="loading">Loading message...</div>
              ) : currentMessage ? (
                <div>
                  <p className="message-content">"{currentMessage.content}"</p>
                  <p className="message-time">
                    {new Date(currentMessage.created_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="no-messages">No messages yet. Be the first to send one!</p>
              )}
            </div>
            <button 
              onClick={loadRandomMessage} 
              className="next-btn"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Next Random Message'}
            </button>
          </div>
        </div>
      </div>
      {/* Disclaimer Footer */}
      <footer className="disclaimer">
        <p>
          <em>
            This is a public website, don't doxx someone pls
          </em>
        </p>
      </footer>
    </div>
  );
}