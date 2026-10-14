import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicEvents } from '../../../api/events'
import { EVENT_TYPES, STATUS_COLORS } from '../../../config/eventConstants'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default function EventListing() {
  const [events, setEvents] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const LIMIT = 12

  const load = (p = page, s = search, t = type) => {
    setLoading(true)
    const params = { page: p, limit: LIMIT }
    if (s) params.search = s
    if (t) params.type = t
    getPublicEvents(params)
      .then((d) => { setEvents(d.events); setTotal(d.total) })
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1, search, type) }, [search, type]) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleType = (t) => { setType(t); setPage(1) }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Upcoming Events</h1>
        <p className="text-sm text-slate-500">Discover and explore events open to you</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex min-w-0 flex-1 gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search events…"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">
            Search
          </button>
        </form>
        <select
          value={type}
          onChange={(e) => handleType(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Types</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading events…</div>
      ) : error ? (
        <div className="py-16 text-center text-rose-600">{error}</div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          No events found. Check back later!
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((ev) => (
              <Link
                key={ev._id}
                to={`/student/events/${ev._id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                {ev.poster ? (
                  <img src={`${API_URL}${ev.poster}`} alt={ev.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100">
                    <svg className="h-14 w-14 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 leading-tight">{ev.title}</h3>
                    <StatusBadge status={ev.status} />
                  </div>
                  <p className="text-xs text-slate-500">{ev.eventType} · {new Date(ev.date).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-600 line-clamp-2 flex-1">{ev.description}</p>
                  <div className="pt-1 text-xs font-medium text-indigo-600 group-hover:text-indigo-500">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => { const p = page - 1; setPage(p); load(p) }}
                disabled={page === 1}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center px-3 text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => { const p = page + 1; setPage(p); load(p) }}
                disabled={page === totalPages}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
