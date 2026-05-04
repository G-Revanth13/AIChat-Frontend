import { useState } from 'react';

const ChatInput = ({ sessionId, onSend, loading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    onSend(userMessage, sessionId);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={loading}
        className="message-input"
      />
      <button type="submit" disabled={loading || !message.trim()}>
        {loading ? '...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput;

