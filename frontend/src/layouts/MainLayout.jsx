import { Link, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { homeForRole } from '../utils/roles'

function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3 text-sm">
          <Link to="/" className="text-lg font-bold text-slate-900">
            EventOps
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to={homeForRole(user.role)} className="text-slate-700 hover:text-indigo-600">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-slate-700 hover:text-indigo-600">
                  {user.name}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
