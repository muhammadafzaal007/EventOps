import axios from 'axios'

export const TOKEN_KEY = 'eventops_token'
export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Expired/invalid token on a protected request -> drop session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthAttempt = error.config?.url?.startsWith('/auth/login') ||
      error.config?.url?.startsWith('/auth/register')
    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)

export default api
