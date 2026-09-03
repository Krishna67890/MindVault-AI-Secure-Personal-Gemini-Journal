import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add User's Gemini API Key if available
  const userApiKey = localStorage.getItem('user_gemini_api_key');
  if (userApiKey) {
    config.headers['X-Gemini-API-Key'] = userApiKey;
  }

  // Add User's Claude API Key if available
  const userClaudeApiKey = localStorage.getItem('user_claude_api_key');
  if (userClaudeApiKey) {
    config.headers['X-Claude-API-Key'] = userClaudeApiKey;
  }

  // Add User's Preferred AI Provider if available
  const preferredAiProvider = localStorage.getItem('user_preferred_ai_provider');
  if (preferredAiProvider) {
    config.headers['X-AI-Provider'] = preferredAiProvider;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
