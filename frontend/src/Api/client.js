import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE } from "../config.js";

// Single axios instance for the whole app. Uses the env-driven base URL and
// always sends credentials so the cookie-based auth migration is seamless later.
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Attach the bearer token (read from storage so it works outside React too).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface errors consistently and auto-logout on 401.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userID");
      localStorage.removeItem("role");
      // Avoid redirect loops on the auth pages themselves.
      if (!window.location.pathname.includes("login")) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    } else if (status !== 404) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
