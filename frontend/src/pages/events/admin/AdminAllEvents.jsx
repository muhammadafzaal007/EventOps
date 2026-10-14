import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents, cancelEvent } from '../../../api/events'
import { STATUS_COLORS, EVENT_STATUSES, EVENT_TYPES } from '../../../config/eventConstants'

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function AdminAllEvents() {
  const [events, setEvents] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ status: '', type: '', page: 1 })
  const [cancelling, setCancelling] = useState(null)

  const load = (f = filters) => {
    setLoading(true)
    const params = { page: f.page, limit: 20 }
    if (f.status) params.status = f.status
    if (f.type) params.type = f.type
    getAllEvents(params)
      .then((d) => { setEvents(d.events); setTotal(d.total) })
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilter = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 }
    setFilters(next)
    load(next)
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this event?')) return
    setCancelling(id)
    try {
      await cancelEvent(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel event')
    } finally {
      setCancelling(null)
    }
  }

  const cancellable = ['Approved', 'Registration Open', 'Registration Closed', 'Ongoing']

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">All Events</h1>
        <p className="text-sm text-slate-500">{total} events on the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.status}
          onChange={(e) => applyFilter('status', e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {EVENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.type}
          onChange={(e) => applyFilter('type', e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Types</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <Link
          to="/admin/approvals"
          className="ml-auto rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-400"
        >
          Pending Approvals
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading…</div>
      ) : error ? (
        <div className="py-16 text-center text-rose-600">{error}</div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">No events found.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Title', 'Type', 'Organizer', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-slate-50">
                  <td className="max-w-xs px-4 py-3 font-medium text-slate-900 truncate">{ev.title}</td>
                  <td className="px-4 py-3 text-slate-500">{ev.eventType}</td>
                  <td className="px-4 py-3 text-slate-500">{ev.organizer?.name}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                  <td className="px-4 py-3">
                    {cancellable.includes(ev.status) && (
                      <button
                        onClick={() => handleCancel(ev._id)}
                        disabled={cancelling === ev._id}
                        className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
