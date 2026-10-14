import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import useAuth from '../hooks/useAuth'
import { parseApiError } from '../utils/api-helpers'
import { homeForRole } from '../utils/roles'

const initialForm = {
  name: '',
  email: '',
  studentId: '',
  department: '',
  password: '',
  confirmPassword: '',
}

function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [studentCard, setStudentCard] = useState(null)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      return setFieldErrors({ password: 'Password must be at least 8 characters' })
    }
    if (form.password !== form.confirmPassword) {
      return setFieldErrors({ confirmPassword: 'Passwords do not match' })
    }
    setFieldErrors({})

    const data = new FormData()
    const { confirmPassword: _confirm, ...fields } = form
    Object.entries(fields).forEach(([key, value]) => data.append(key, value))
    if (studentCard) data.append('studentCard', studentCard)

    setSubmitting(true)
    try {
      await register(data)
      navigate(homeForRole('student'), { replace: true })
    } catch (err) {
      const parsed = parseApiError(err)
      setError(parsed.message)
      setFieldErrors(parsed.fieldErrors)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="text-2xl font-bold text-slate-900">Student Registration</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <FormField label="Full name" name="name" value={form.name} onChange={handleChange} error={fieldErrors.name} />
        <FormField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={fieldErrors.email} autoComplete="email" />
        <FormField label="Student ID" name="studentId" value={form.studentId} onChange={handleChange} error={fieldErrors.studentId} />
        <FormField label="Department" name="department" value={form.department} onChange={handleChange} error={fieldErrors.department} />
        <FormField label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={fieldErrors.password} autoComplete="new-password" />
        <FormField label="Confirm password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} error={fieldErrors.confirmPassword} autoComplete="new-password" />
        <FormField
          label="Student card (optional, JPG/PNG/WEBP, max 2MB)"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setStudentCard(e.target.files[0] || null)}
          error={fieldErrors.studentCard}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Register
