const ChatSidebar = ({ sessions, onNewChat, onSelectSession, activeSession }) => {
  if (sessions.length === 0) {
    return (
      <div className="chat-sidebar">
<button onClick={onNewChat} className="new-chat-btn">
          <span>✨</span>
          New Chat
        </button>
        <div className="empty-state">
          Start a new conversation
        </div>
      </div>
    );
  }

  return (
    <div className="chat-sidebar">
      <button onClick={onNewChat} className="new-chat-btn">
        + New Chat
      </button>
      <ul className="sessions-list">
        {sessions.map((session) => (
          <li 
            key={session.sessionId} 
            className={activeSession === session.sessionId ? 'active' : ''}
            onClick={() => onSelectSession(session.sessionId)}
          >
            <div>{session.title || `Chat ${session.sessionId.slice(-4)}`}</div>
            <div className="preview">{session.preview}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;

