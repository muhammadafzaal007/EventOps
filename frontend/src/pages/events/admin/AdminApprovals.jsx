import { useEffect, useState } from 'react'
import { getPendingEvents, approveEvent, rejectEvent } from '../../../api/events'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function AdminApprovals() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionId, setActionId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectingId, setRejectingId] = useState(null)

  const load = () => {
    setLoading(true)
    getPendingEvents()
      .then((d) => setEvents(d.events))
      .catch(() => setError('Failed to load pending events'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleApprove = async (id) => {
    if (!confirm('Approve this event?')) return
    setActionId(id)
    try {
      await approveEvent(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve')
    } finally {
      setActionId(null)
    }
  }

  const handleRejectOpen = (id) => { setRejectingId(id); setRejectReason('') }
  const handleRejectClose = () => setRejectingId(null)
  const handleRejectSubmit = async () => {
    setActionId(rejectingId)
    try {
      await rejectEvent(rejectingId, rejectReason)
      setRejectingId(null)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pending Approvals</h1>
        <p className="text-sm text-slate-500">Events submitted by organizers awaiting your review</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading…</div>
      ) : error ? (
        <div className="py-16 text-center text-rose-600">{error}</div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <svg className="mx-auto mb-3 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500">No pending events — you're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div key={ev._id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {ev.poster && (
                  <img
                    src={`${API_URL}${ev.poster}`}
                    alt={ev.title}
                    className="h-48 w-full object-cover sm:h-auto sm:w-48"
                  />
                )}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{ev.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ev.eventType} · {new Date(ev.date).toLocaleDateString()} · Submitted by {ev.organizer?.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Pending Approval
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3">{ev.description}</p>

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 sm:grid-cols-4">
                    {ev.venue && <><dt className="font-medium text-slate-700">Venue</dt><dd>{ev.venue}</dd></>}
                    <dt className="font-medium text-slate-700">Start</dt><dd>{ev.startTime}</dd>
                    <dt className="font-medium text-slate-700">End</dt><dd>{ev.endTime}</dd>
                    {ev.registrationDeadline && <><dt className="font-medium text-slate-700">Reg. Deadline</dt><dd>{new Date(ev.registrationDeadline).toLocaleDateString()}</dd></>}
                    {ev.maximumParticipants && <><dt className="font-medium text-slate-700">Max Participants</dt><dd>{ev.maximumParticipants}</dd></>}
                  </dl>

                  {ev.rules && (
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      <strong className="text-slate-700">Rules:</strong> {ev.rules}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleApprove(ev._id)}
                      disabled={actionId === ev._id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
                    >
                      {actionId === ev._id ? 'Processing…' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => handleRejectOpen(ev._id)}
                      disabled={actionId === ev._id}
                      className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Reject Event</h2>
            <p className="mb-4 text-sm text-slate-500">Provide a reason that will be shown to the organizer (optional).</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Incomplete information, date conflict…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={handleRejectClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!!actionId}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {actionId ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
