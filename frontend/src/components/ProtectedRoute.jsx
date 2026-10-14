import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * Wrap routes that need a logged-in user.
 * Pass allowedRoles (e.g. ['admin', 'organizer']) to restrict by role.
 *
 *   <Route element={<ProtectedRoute />}> ... </Route>
 *   <Route element={<ProtectedRoute allowedRoles={['admin']} />}> ... </Route>
 */
function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="p-8 text-center text-slate-500">Loading...</p>
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
