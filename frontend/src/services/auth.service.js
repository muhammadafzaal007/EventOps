import api from '../api/axios'

export const registerStudent = async (formData) => {
  const { data } = await api.post('/auth/register', formData)
  return data
}

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me')
  return data.user
}

export const updateUserProfile = async (formData) => {
  const { data } = await api.put('/auth/profile', formData)
  return data.user
}
