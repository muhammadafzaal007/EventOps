import { Link } from 'react-router-dom'

function PageHeader({ title, subtitle, actionLabel, actionTo }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default PageHeader
