import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../../../api/events'
import EventForm from '../../../components/events/EventForm'

export default function CreateEvent() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    setLoading(true)
    setErrors({})
    setGlobalError(null)
    try {
      await createEvent(formData)
      navigate('/organizer/events', {
        state: { toast: 'Event saved successfully!' },
      })
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setGlobalError(data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Create New Event</h1>
        <p className="text-sm text-slate-500">Fill in the details, then save as a draft or submit for admin approval.</p>
      </div>
      <EventForm onSubmit={handleSubmit} loading={loading} errors={errors} globalError={globalError} />
    </div>
  )
}
