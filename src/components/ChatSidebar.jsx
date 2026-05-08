import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/useAuth.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

const ChatSidebar = ({ sessions, onNewChat, onSelectSession, activeSession, onLogout, isOpen, onClose }) => {
  const sidebarClass = `chat-sidebar${isOpen ? ' open' : ''}`;
  const { user } = useAuth();

  const userInitial = useMemo(() => {
    const name = user?.userName || '';
    const first = name.trim().charAt(0);
    return first ? first.toUpperCase() : '?';
  }, [user?.userName]);

  const [confirmOpen, setConfirmOpen] = useState(false);

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

      <button className="logout-btn" onClick={() => setConfirmOpen(true)}>
        Logout
      </button>
    </div>
  );

  const sidebarBody = (
    <>
      <div className="sidebar-header">
        <button className="sidebar-close" onClick={onClose}>
          Close
        </button>
      </div>
      <button onClick={onNewChat} className="new-chat-btn">
        + New Chat
      </button>

      {sessions.length === 0 ? (
        <div className="empty-state">Start a new conversation</div>
      ) : (
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
      )}

      <UserFooter />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Logout"
        message="Do you want to logout?"
        cancelText="Cancel"
        confirmText="Logout"
        confirmTone="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          toast.info('Logging out...', { autoClose: 1500 });
          setConfirmOpen(false);
          onLogout();
        }}
      />
    </>
  );

  return <div className={sidebarClass}>{sidebarBody}</div>;
};

export default ChatSidebar;

