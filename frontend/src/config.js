// Central place for backend endpoints. In development, leave VITE_API_URL empty
// so requests go to "/api/..." and Vite's dev proxy forwards them to the backend.
// In production, set VITE_API_URL (and VITE_SOCKET_URL) to your deployed backend.
export const API_BASE = import.meta.env.VITE_API_URL || "";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";
