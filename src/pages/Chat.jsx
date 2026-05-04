import { useAuth } from '../contexts/useAuth.jsx';
import { useChat } from '../hooks/useChat.js';
import ChatSidebar from '../components/ChatSidebar.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import ChatInput from '../components/ChatInput.jsx';

const Chat = () => {
  const { logout } = useAuth();
  const { sessions, currentSessionId, messages, loading, sendMessage, newChat, selectSession } = useChat();

  return (
    <div className="chat-page">
      <ChatSidebar
        sessions={sessions}
        onNewChat={newChat}
        onSelectSession={selectSession}
        activeSession={currentSessionId}
      />
      <div className="chat-main">
        <header>
          <h1>AI ChatGPT</h1>
          <button className="chat-header-logout" onClick={logout} title="Logout">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
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

