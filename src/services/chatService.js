import apiClient from './authService.js';

export const chatService = {
async getHistory() {
    const response = await apiClient.get(`/chat/history`);
    return response.data;
  },

  async sendMessage(sessionId, message) {
    const response = await apiClient.post('/chat/send', { sessionId, message });
    return response.data;
  }
};

