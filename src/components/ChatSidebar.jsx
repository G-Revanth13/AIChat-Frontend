const ChatSidebar = ({ sessions, onNewChat, onSelectSession, activeSession, onLogout, isOpen, onClose }) => {
  const sidebarClass = `chat-sidebar${isOpen ? ' open' : ''}`;

  if (sessions.length === 0) {
    return (
      <div className={sidebarClass}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={onClose}>Close</button>
        </div>
        <button onClick={onNewChat} className="new-chat-btn">
          New Chat
        </button>
        <div className="empty-state">
          Start a new conversation
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={sidebarClass}>
      <div className="sidebar-header">
        <button className="sidebar-close" onClick={onClose}>Close</button>
      </div>
      <button onClick={onNewChat} className="new-chat-btn">
        + New Chat
      </button>
      <ul className="sessions-list">
        {sessions.map((session) => {
          const title = session.title || session.preview || 'Conversation';
          return (
            <li 
              key={session.sessionId} 
              className={activeSession === session.sessionId ? 'active' : ''}
              onClick={() => onSelectSession(session.sessionId)}
            >
              <div className="session-title">{title}</div>
              {session.title && <div className="preview">{session.preview}</div>}
            </li>
          );
        })}
      </ul>
      <button
        className="logout-btn"
        onClick={() => {
          // Custom dialog instead of browser confirm/alert
          const ok = window.confirm('Do you want to logout?');
          if (ok) onLogout();
        }}
      >
        Logout
      </button>


    </div>
  );
};

export default ChatSidebar;
