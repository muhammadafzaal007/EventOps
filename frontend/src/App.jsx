import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import SectionPage from './components/dashboard/SectionPage'
import { adminNav, organizerNav, studentNav } from './config/dashboardNav'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'
import OrganizerLayout from './layouts/OrganizerLayout'
import ProfileLayout from './layouts/ProfileLayout'
import StudentLayout from './layouts/StudentLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import OrganizerDashboard from './pages/dashboard/OrganizerDashboard'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import useAuth from './hooks/useAuth'
import { homeForRole } from './utils/roles'

// ── Event pages (lazy-loaded) ─────────────────────────────────────────────────
const MyEvents        = lazy(() => import('./pages/events/organizer/MyEvents'))
const CreateEvent     = lazy(() => import('./pages/events/organizer/CreateEvent'))
const EditEvent       = lazy(() => import('./pages/events/organizer/EditEvent'))
const AdminAllEvents  = lazy(() => import('./pages/events/admin/AdminAllEvents'))
const AdminApprovals  = lazy(() => import('./pages/events/admin/AdminApprovals'))
const EventListing    = lazy(() => import('./pages/events/student/EventListing'))
const EventDetail     = lazy(() => import('./pages/events/student/EventDetail'))

const Loader = () => (
  <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading…</div>
)

// Placeholder section routes generated from the nav config (items with a title)
// Exclude paths now handled by real components
const REAL_PATHS = new Set([
  '/organizer/events', '/organizer/events/new',
  '/admin/events', '/admin/approvals',
  '/student/events',
])
const sectionRoutes = (nav) =>
  nav
    .filter((item) => item.title && !REAL_PATHS.has(item.path))
    .map((item) => <Route key={item.path} path={item.path} element={<SectionPage item={item} />} />)

function DashboardRedirect() {
  const { user } = useAuth()
  return <Navigate to={homeForRole(user.role)} replace />
}

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<div className="mx-auto max-w-2xl"><Profile /></div>} />
          </Route>
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/events" element={<EventListing />} />
            <Route path="/student/events/:id" element={<EventDetail />} />
            {sectionRoutes(studentNav)}
          </Route>
        </Route>

        {/* Organizer */}
        <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
          <Route element={<OrganizerLayout />}>
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/events" element={<MyEvents />} />
            <Route path="/organizer/events/new" element={<CreateEvent />} />
            <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
            {sectionRoutes(organizerNav)}
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminAllEvents />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            {sectionRoutes(adminNav)}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
