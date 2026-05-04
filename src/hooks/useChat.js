import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService.js';

export const useChat = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await chatService.getHistory() || [];
      setSessions(history.map((s) => ({
        ...s,
        preview: s.messages[s.messages.length - 1]?.content ? s.messages[s.messages.length - 1].content.slice(0, 50) + '...' : 'New chat'
      })));
    } catch (error) {
      console.error('Failed to load history:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      await loadHistory();
    };

    fetchHistory();
  }, []);

  const sendMessage = async (text, sessionId) => {
    // For new user first message, pass null sessionId - backend creates
    const apiSessionId = sessionId || currentSessionId || null;
    const tempSessionId = apiSessionId || 'temp_' + Date.now();
    
    // Add user message instantly
    setMessages(prev => [...prev, { text, isUser: true, timestamp: Date.now() }]);
    
    try {
      setLoading(true);
      const response = await chatService.sendMessage(apiSessionId, text);
      console.log('Send response:', response);
      
      // Update sessionId if backend created new
      const newSessionId = response.sessionId || apiSessionId || tempSessionId;
      setCurrentSessionId(newSessionId);
      
      // Append AI response
      setMessages(prev => [...prev, { text: response.reply || response.aiResponse || response.content || 'AI response', isUser: false, timestamp: Date.now() }]);
      
      // Refetch
      await loadHistory();
    } catch (error) {
      console.error('Send error:', error);
      setMessages(prev => [...prev, { text: 'Error sending message. Check backend.', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };


  const newChat = () => {
    setCurrentSessionId(null); // null for backend to create new session
    setMessages([]);
  };


  const selectSession = (sessionId) => {
    const session = sessions.find(s => s.sessionId === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages.map(m => ({ text: m.content, isUser: m.role === 'user' })));
    }
  };

  return {
    sessions,
    currentSessionId,
    messages,
    loading,
    sendMessage,
    newChat,
    loadHistory,
    selectSession,
    setCurrentSessionId
  };
};

