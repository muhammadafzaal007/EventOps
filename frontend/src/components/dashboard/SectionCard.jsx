import { Link } from 'react-router-dom'

function SectionCard({ title, linkTo, linkLabel = 'View all', children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="text-xs font-medium text-indigo-600 hover:underline">
            {linkLabel}
          </Link>
        )}
      </header>
      {children}
    </section>
  )
}

export default SectionCard
