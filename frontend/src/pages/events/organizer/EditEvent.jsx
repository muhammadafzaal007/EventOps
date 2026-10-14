import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMyEvents, updateEvent } from '../../../api/events'
import EventForm from '../../../components/events/EventForm'

function toDateInput(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().substring(0, 10)
}

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState(null)

  useEffect(() => {
    getMyEvents()
      .then((d) => {
        const ev = d.events.find((e) => e._id === id)
        if (!ev) { setFetchError('Event not found'); return }
        if (!['Draft', 'Rejected'].includes(ev.status)) {
          setFetchError(`This event cannot be edited (status: ${ev.status})`)
          return
        }
        setInitial({
          title: ev.title || '',
          description: ev.description || '',
          category: ev.category || '',
          eventType: ev.eventType || '',
          venue: ev.venue || '',
          date: toDateInput(ev.date),
          startTime: ev.startTime || '',
          endTime: ev.endTime || '',
          registrationDeadline: toDateInput(ev.registrationDeadline),
          expectedParticipants: ev.expectedParticipants ?? '',
          maximumParticipants: ev.maximumParticipants ?? '',
          registrationType: ev.registrationType || 'Free',
          rules: ev.rules || '',
          poster: ev.poster || '',
        })
      })
      .catch(() => setFetchError('Failed to load event'))
  }, [id])

  const handleSubmit = async (formData) => {
    setLoading(true)
    setErrors({})
    setGlobalError(null)
    try {
      await updateEvent(id, formData)
      navigate('/organizer/events', { state: { toast: 'Event updated successfully!' } })
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setGlobalError(data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetchError) return (
    <div className="py-16 text-center">
      <p className="text-rose-600">{fetchError}</p>
      <button onClick={() => navigate('/organizer/events')} className="mt-4 text-sm text-indigo-600 hover:underline">
        Back to My Events
      </button>
    </div>
  )
  if (!initial) return <div className="py-16 text-center text-slate-500">Loading event…</div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Edit Event</h1>
        <p className="text-sm text-slate-500">Update your event details. Changes are saved immediately.</p>
      </div>
      <EventForm initial={initial} onSubmit={handleSubmit} loading={loading} errors={errors} globalError={globalError} />
    </div>
  )
}
