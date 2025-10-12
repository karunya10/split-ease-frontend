import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SPLITEASE_BACKEND_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
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

export default api;
