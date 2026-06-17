import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './store/auth.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { API_BASE } from './config.js'
import './styles/theme.css'

// All bare axios calls use relative "/api/..." paths; this prepends the backend
// origin in production while letting the Vite proxy handle development.
axios.defaults.baseURL = API_BASE
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster position="top-center" />
    </ErrorBoundary>
  </StrictMode>
  </AuthProvider>
)
