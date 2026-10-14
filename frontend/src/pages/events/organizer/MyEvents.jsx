import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyEvents, submitForApproval } from '../../../api/events'
import { STATUS_COLORS } from '../../../config/eventConstants'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function MyEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(null)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    getMyEvents()
      .then((d) => setEvents(d.events))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (id) => {
    if (!confirm('Submit this event for admin approval?')) return
    setSubmitting(id)
    try {
      await submitForApproval(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) return <div className="py-16 text-center text-slate-500">Loading events…</div>
  if (error) return <div className="py-16 text-center text-rose-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Events</h1>
          <p className="text-sm text-slate-500">Events you have created</p>
        </div>
        <Link
          to="/organizer/events/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-500">No events yet. Create your first event!</p>
          <Link to="/organizer/events/new" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((ev) => (
            <div key={ev._id} className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {ev.poster ? (
                <img src={`${API_URL}${ev.poster}`} alt={ev.title} className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                  <svg className="h-12 w-12 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4 gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 leading-tight">{ev.title}</h3>
                  <StatusBadge status={ev.status} />
                </div>
                <p className="text-xs text-slate-500">{ev.eventType} · {new Date(ev.date).toLocaleDateString()}</p>
                <p className="text-sm text-slate-600 line-clamp-2 flex-1">{ev.description}</p>

                {ev.status === 'Rejected' && ev.rejectionReason && (
                  <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    <strong>Rejected:</strong> {ev.rejectionReason}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {['Draft', 'Rejected'].includes(ev.status) && (
                    <>
                      <button
                        onClick={() => navigate(`/organizer/events/${ev._id}/edit`)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSubmit(ev._id)}
                        disabled={submitting === ev._id}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                      >
                        {submitting === ev._id ? 'Submitting…' : 'Submit for Approval'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
