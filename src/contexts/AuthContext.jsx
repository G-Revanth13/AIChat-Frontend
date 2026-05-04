import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextValue.js';
import { authService } from '../services/authService.js';
import { getCookie, setCookie, deleteCookie } from '../utils/cookieUtils.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getCookie('token');
      const storedUserId = getCookie('userId');
      console.log('Auth init - cookies:', {token: !!storedToken, userId: storedUserId});

      if (storedToken && storedUserId) {
        setToken(storedToken);
        setUser({ id: storedUserId });
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);


  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const data = await authService.login(email, password);
      console.log('Backend login response:', data);
      if (data.token && data.userId) {
        setCookie('token', data.token, 7);
        setCookie('userId', data.userId, 7);
        setToken(data.token);
        setUser({ id: data.userId });
        console.log('✅ State/cookies updated, user:', { id: data.userId });
        return { success: true, user: { id: data.userId }, token: data.token };
      }
      console.log('❌ Invalid login data:', data);
      return { success: false, error: data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };


  const register = async (username, email, password) => {
    try {
      await authService.register(username, email, password);
      return { success: true, message: 'Registered successfully' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    deleteCookie('token');
    deleteCookie('userId');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

