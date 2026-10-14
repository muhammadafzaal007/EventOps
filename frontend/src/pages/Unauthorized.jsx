import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { homeForRole } from '../utils/roles'

function Unauthorized() {
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow">
      <h1 className="text-2xl font-bold text-slate-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-500">
        You do not have permission to view this page.
      </p>
      <Link to={user ? homeForRole(user.role) : '/login'} className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
        {user ? 'Back to my dashboard' : 'Go to login'}
      </Link>
    </div>
  )
}

export default Unauthorized
