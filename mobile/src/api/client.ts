import axios from 'axios';
import { auth } from '../config/firebase';

// Use environment variable or fallback to localhost
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Firebase Bearer Token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      } else {
        // Dev fallback token when auth is bypassed or offline
        config.headers.Authorization = `Bearer dev-synthetic-token`;
      }
    } catch (err) {
      console.warn('Failed to attach Firebase token to request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract envelope data or standard errors
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const errorMsg =
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(errorMsg));
  }
);
