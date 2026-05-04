import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { useAuth } from './contexts/useAuth.jsx';
import { getCookie } from './utils/cookieUtils.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Chat from './pages/Chat.jsx';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = getCookie('token');
  const userId = getCookie('userId');
  console.log('ProtectedRoute check:', { user: !!user, token: !!token, userId, loading });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user || (token && userId)) {
    console.log('✅ ProtectedRoute allowing access');
    return children;
  } else {
    console.log('❌ ProtectedRoute redirecting to login');
    return <Navigate to="/login" replace />;
  }
};


const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/chat/*" 
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

