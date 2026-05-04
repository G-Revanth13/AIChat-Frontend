import axios from 'axios';
import { getCookie } from '../utils/cookieUtils.js';

//const API_BASE_URL = 'http://localhost:10000/api';
// const API_BASE_URL = 'https://chatbot-backend.onrender.com/api';
 const API_BASE_URL = 'https://aichat-backend-0hmj.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for cookies if backend sets
});

apiClient.interceptors.request.use((config) => {
  const token = getCookie('token');
  console.log('📤 Request to', config.url, 'token:', token ? 'present' : 'MISSING');
  // REMOVED Bearer - backend expects cookie auth (withCredentials true)
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});



// Response interceptor for 401 - REMOVED HARD REDIRECT to prevent Chat 401 loop
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('⚠️ 401 - token invalid, but NOT clearing cookies/logout');
      // No auto-logout: let component handle error
    }
    return Promise.reject(error);
  }
);


export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async register(username, email, password) {
    const response = await apiClient.post('/auth/register', { username, email, password });
    return response.data;
  },

  logout() {
    // Clear cookies
    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
    document.cookie = 'userId=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
  }
};

export default apiClient;

