import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach access token if present
client.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

// Response interceptor to handle token expiration
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;