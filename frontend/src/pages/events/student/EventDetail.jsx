import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEventById } from '../../../api/events'
import { STATUS_COLORS } from '../../../config/eventConstants'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

function Detail({ label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-800">{value}</dd>
    </div>
  )
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEventById(id)
      .then((d) => setEvent(d.event))
      .catch((err) => setError(err.response?.data?.message || 'Event not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="py-16 text-center text-slate-500">Loading event…</div>

  if (error) return (
    <div className="py-16 text-center">
      <p className="text-rose-600">{error}</p>
      <Link to="/student/events" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
        ← Back to Events
      </Link>
    </div>
  )

  const status = event.status
  const badgeClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/student/events" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </Link>

      {/* Hero */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {event.poster ? (
          <img
            src={`${API_URL}${event.poster}`}
            alt={event.title}
            className="h-64 w-full object-cover sm:h-80"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100">
            <svg className="h-16 w-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {event.eventType}
                {event.category && ` · ${event.category}`}
                {event.organizer?.name && ` · Organized by ${event.organizer.name}`}
              </p>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${badgeClass}`}>
              {status}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-700">{event.description}</p>

          {/* Key details grid */}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 rounded-xl bg-slate-50 p-5">
            <Detail label="Date" value={new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
            <Detail label="Start Time" value={event.startTime} />
            <Detail label="End Time" value={event.endTime} />
            {event.venue && <Detail label="Venue" value={event.venue} />}
            {event.registrationDeadline && (
              <Detail label="Registration Deadline" value={new Date(event.registrationDeadline).toLocaleDateString()} />
            )}
            {event.registrationType && <Detail label="Registration" value={event.registrationType} />}
            {event.maximumParticipants && <Detail label="Max Participants" value={event.maximumParticipants.toString()} />}
            {event.expectedParticipants && <Detail label="Expected Participants" value={event.expectedParticipants.toString()} />}
          </dl>

          {/* Rules */}
          {event.rules && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Rules & Guidelines</h2>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 whitespace-pre-line">
                {event.rules}
              </div>
            </div>
          )}

          {/* Results */}
          {event.results && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Results</h2>
              <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800 whitespace-pre-line">
                {event.results}
              </div>
            </div>
          )}

          {/* Gallery */}
          {event.gallery?.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Gallery</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {event.gallery.map((url, i) => (
                  <img
                    key={i}
                    src={`${API_URL}${url}`}
                    alt={`Gallery ${i + 1}`}
                    className="h-40 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
