import { useCallback, useEffect, useMemo, useState } from 'react'
import AuthContext from './AuthContext'
import { TOKEN_KEY, UNAUTHORIZED_EVENT } from '../api/axios'
import {
  fetchCurrentUser,
  loginUser,
  registerStudent,
  updateUserProfile,
} from '../services/auth.service'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem(TOKEN_KEY))

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  // Restore session on page load
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    fetchCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  // Token rejected by the API (expired / invalid / suspended)
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const login = useCallback(async (credentials) => {
    const { token, user } = await loginUser(credentials)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (formData) => {
    const { token, user } = await registerStudent(formData)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
    return user
  }, [])

  const updateProfile = useCallback(async (formData) => {
    const updated = await updateUserProfile(formData)
    setUser(updated)
    return updated
  }, [])

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, register, logout, updateProfile }),
    [user, loading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
