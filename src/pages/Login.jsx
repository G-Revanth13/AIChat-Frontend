import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';

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

  useEffect(() => {
    if (loginResult?.success && user && !loading) {
      navigate(from, { replace: true });
    }
  }, [loginResult, user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginResult(null);
    setLoading(true);
    const result = await login(email, password);
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
        {/* <svg className="logo" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
          <path fillOpacity=".3" d="M4 7v10c0 1.96 1.22 3.72 3 4.5v-11l7-3.05v11c1.78-1.78 3-2.54 3-4.5V7L4 7z"/>
        </svg> */}
        <h2>AI CHAT</h2>
        <form onSubmit={handleSubmit}>
          <div className={`input-group${email ? ' filled' : ''}`}>
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className={`input-group${password ? ' filled' : ''}`}>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </span>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;