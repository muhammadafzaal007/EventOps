import { API_URL } from '../api/axios'

// Turns an axios error into { message, fieldErrors }
export const parseApiError = (error) => ({
  message:
    error.response?.data?.message ||
    (error.request ? 'Cannot reach the server. Is the backend running?' : error.message),
  fieldErrors: error.response?.data?.errors || {},
})

// "/uploads/x.png" -> "http://localhost:5000/uploads/x.png"
export const fileUrl = (path) => (path ? API_URL.replace(/\/api\/?$/, '') + path : null)
