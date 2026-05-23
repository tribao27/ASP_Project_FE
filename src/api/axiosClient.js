import axios from 'axios';

// Create an Axios instance with a base URL
// Update baseURL to point to your Java Spring Boot backend when ready.
// Example: baseURL: 'http://localhost:8080/api'
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Mock Base URL for Java Backend
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Add Authorization token if needed
axiosClient.interceptors.request.use(
  (config) => {
    // Example: Add token from localStorage
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle specific HTTP errors (401, 403, 500, etc.)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
