import { useMemo } from 'react';
import { useAuth } from '../contexts/useAuth.jsx';

const ChatSidebar = ({ sessions, onNewChat, onSelectSession, activeSession, onLogout, isOpen, onClose }) => {
  const sidebarClass = `chat-sidebar${isOpen ? ' open' : ''}`;
  const { user } = useAuth();

  const userInitial = useMemo(() => {
    const name = user?.userName || '';
    const first = name.trim().charAt(0);
    return first ? first.toUpperCase() : '?';
  }, [user?.userName]);

  const handleLogout = () => {
    const ok = window.confirm('Do you want to logout?');
    if (ok) onLogout();
  };

  const UserFooter = () => (
    <div className="sidebar-footer">
      <div className="sidebar-footer-divider" />
      <div className="sidebar-user">
        <div className="sidebar-user-avatar" aria-hidden="true">
          {userInitial}
        </div>
        <div className="sidebar-user-meta">
          <div className="sidebar-user-name">{user?.userName || 'Unknown'}</div>
          <div className="sidebar-user-status">Online</div>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );

  if (sessions.length === 0) {
    return (
      <div className={sidebarClass}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={onClose}>Close</button>
        </div>
        <button onClick={onNewChat} className="new-chat-btn">
          New Chat
        </button>
        <div className="empty-state">Start a new conversation</div>
        <UserFooter />
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

      <UserFooter />
    </div>
  );
};

export default ChatSidebar;

