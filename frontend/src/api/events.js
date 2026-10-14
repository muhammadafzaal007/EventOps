import api from './axios'

// ─── PUBLIC ───────────────────────────────────────────────────────────────────
export const getPublicEvents = (params = {}) =>
  api.get('/events', { params }).then((r) => r.data)

export const getEventById = (id) =>
  api.get(`/events/${id}`).then((r) => r.data)

// ─── ORGANIZER ────────────────────────────────────────────────────────────────
export const getMyEvents = () =>
  api.get('/events/organizer/my').then((r) => r.data)

export const createEvent = (formData) =>
  api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)

export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)

export const submitForApproval = (id) =>
  api.post(`/events/${id}/submit`).then((r) => r.data)

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const getAllEvents = (params = {}) =>
  api.get('/events/admin/all', { params }).then((r) => r.data)

export const getPendingEvents = () =>
  api.get('/events/admin/pending').then((r) => r.data)

export const approveEvent = (id) =>
  api.post(`/events/${id}/approve`).then((r) => r.data)

export const rejectEvent = (id, reason) =>
  api.post(`/events/${id}/reject`, { reason }).then((r) => r.data)

export const cancelEvent = (id) =>
  api.post(`/events/${id}/cancel`).then((r) => r.data)
