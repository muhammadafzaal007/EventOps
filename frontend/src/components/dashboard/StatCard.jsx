import { Link } from 'react-router-dom'
import Icon from './Icon'

// Value is intentionally "—" until real data is wired in.
function StatCard({ label, icon, to, value = '—', hint = 'No data yet' }) {
  const body = (
    <div className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      </div>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon name={icon} className="h-5 w-5" />
      </span>
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}

export default StatCard
