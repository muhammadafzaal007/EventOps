import { useState } from 'react'
import FormField from '../components/FormField'
import useAuth from '../hooks/useAuth'
import { fileUrl, parseApiError } from '../utils/api-helpers'

function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user.name, department: user.department || '' })
  const [profileImage, setProfileImage] = useState(null)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text }
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setFieldErrors({})

    const data = new FormData()
    data.append('name', form.name)
    data.append('department', form.department)
    if (profileImage) data.append('profileImage', profileImage)

    setSaving(true)
    try {
      await updateProfile(data)
      setProfileImage(null)
      setMessage({ type: 'success', text: 'Profile updated' })
    } catch (err) {
      const parsed = parseApiError(err)
      setFieldErrors(parsed.fieldErrors)
      setMessage({ type: 'error', text: parsed.message })
    } finally {
      setSaving(false)
    }
  }

  const details = [
    ['Email', user.email, ''],
    ['Role', user.role, 'capitalize'],
    ['Student ID', user.studentId || '—', ''],
    ['Status', user.status, 'capitalize'],
    ['Verified', user.isVerified ? 'Yes' : 'No', ''],
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-xl bg-white p-8 shadow">
        <div className="flex items-center gap-4">
          {user.profileImage ? (
            <img src={fileUrl(user.profileImage)} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-sm capitalize text-slate-500">{user.role}</p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {details.map(([label, value, style]) => (
            <div key={label}>
              <dt className="text-slate-500">{label}</dt>
              <dd className={`font-medium text-slate-900 ${style}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-xl bg-white p-8 shadow">
        <h2 className="text-lg font-semibold text-slate-900">Edit profile</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <FormField label="Full name" name="name" value={form.name} onChange={handleChange} error={fieldErrors.name} />
          <FormField label="Department" name="department" value={form.department} onChange={handleChange} error={fieldErrors.department} />
          <FormField
            label="Profile image (JPG/PNG/WEBP, max 2MB)"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setProfileImage(e.target.files[0] || null)}
          />
          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Profile
