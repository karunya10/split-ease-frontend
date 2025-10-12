import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SPLITEASE_BACKEND_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set to true if backend uses cookies
});

// Request interceptor to add auth token to requests
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("splitease_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      if (typeof window !== "undefined") {
        localStorage.removeItem("splitease_token");
        localStorage.removeItem("splitease_user");
        // Optionally redirect to login page
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
