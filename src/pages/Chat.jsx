import { useState } from 'react';
import { useAuth } from '../contexts/useAuth.jsx';
import { useChat } from '../hooks/useChat.js';
import ChatSidebar from '../components/ChatSidebar.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import ChatInput from '../components/ChatInput.jsx';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { sessions, currentSessionId, messages, loading, sendMessage, newChat, selectSession } = useChat();

  const handleSelectSession = (sessionId) => {
    selectSession(sessionId);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    newChat();
    setSidebarOpen(false);
  };

  return (
    <div className={`chat-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <ChatSidebar
        sessions={sessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        activeSession={currentSessionId}
        onLogout={logout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <div className="chat-main">
        <header>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
            {sidebarOpen ? '×' : '☰'}
          </button>

          <div className="chat-header-left">
            <h1>AI CHAT</h1>
          </div>

        </header>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} isUser={msg.isUser} />
          ))}
          {loading && <div className="message ai"><div className="loader">...</div></div>}
        </div>
        <ChatInput
          sessionId={currentSessionId}
          onSend={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Chat;

