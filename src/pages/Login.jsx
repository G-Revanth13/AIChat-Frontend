import { useState, useEffect } from 'react';

import { useAuth } from '../contexts/useAuth.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginResult, setLoginResult] = useState(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/chat';

  // Safe navigation after auth state updates (runs once on success)
  useEffect(() => {
    if (loginResult?.success && user && !loading) {
      console.log('✅ Login success, user:', user, 'cookies:', document.cookie, 'navigating to:', from);
      navigate(from, { replace: true });
    }
  }, [loginResult, user, navigate, from]); // Removed loading dep


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginResult(null);
    setLoading(true);
    const result = await login(email, password);
    console.log('Login result from authService:', result);
    setLoginResult(result);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed');
      if (result.error === 'User Not Found') {
        navigate('/register', { state: { from: location.state?.from } });
      }
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-form">
        <svg className="logo" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
          <path fillOpacity=".3" d="M4 7v10c0 1.96 1.22 3.72 3 4.5v-11l7-3.05v11c1.78-1.78 3-2.54 3-4.5V7L4 7z"/>
        </svg>
        <h2>AI ChatGPT</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="password-input"
            />
            <label>Password</label>
            <span 
              className="password-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <p>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

