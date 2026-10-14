import { Link } from 'react-router-dom'
import Icon from './Icon'

function EmptyState({ icon = 'inbox', title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon name={icon} />
      </span>
      <p className="mt-3 text-sm font-medium text-slate-700">{title}</p>
      {message && <p className="mt-1 max-w-xs text-xs text-slate-500">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default EmptyState
