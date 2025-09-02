import axios from 'axios';

// Set base URL based on environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://api.artisansocialgenerator.com'
  : 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Handle common errors
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.log('Unauthorized access, redirecting to login');
      } else if (error.response.status === 429) {
        console.log('Rate limit exceeded, please try again later');
      }
    } else if (error.request) {
      console.log('Network error, please check your connection');
    }
    return Promise.reject(error);
  }
);