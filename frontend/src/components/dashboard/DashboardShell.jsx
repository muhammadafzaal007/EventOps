import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Icon from './Icon'

function DashboardShell({ roleLabel, navItems }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  const sidebar = (
    <nav className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <Link to="/" className="text-lg font-bold text-slate-900">EventOps</Link>
        <p className="text-xs text-slate-500">{roleLabel}</p>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink to={item.path} end={item.end} className={linkClass} onClick={() => setOpen(false)}>
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-slate-200 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-slate-200 shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
          <span className="hidden text-sm text-slate-500 lg:block">University Event Management</span>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-indigo-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{user.name}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardShell
