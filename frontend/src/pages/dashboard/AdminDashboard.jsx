import EmptyState from '../../components/dashboard/EmptyState'
import PageHeader from '../../components/dashboard/PageHeader'
import SectionCard from '../../components/dashboard/SectionCard'
import StatCard from '../../components/dashboard/StatCard'
import { adminNav } from '../../config/dashboardNav'
import useAuth from '../../hooks/useAuth'

const STATS = [
  { label: 'Total Users', icon: 'users', to: '/admin/users' },
  { label: 'Total Events', icon: 'calendar', to: '/admin/events' },
  { label: 'Pending Approvals', icon: 'clock', to: '/admin/approvals' },
  { label: 'Total Registrations', icon: 'ticket', to: '/admin/registrations' },
  { label: 'Venues', icon: 'building', to: '/admin/venues' },
  { label: 'Attendance', icon: 'check', to: '/admin/attendance' },
]

function AdminDashboard() {
  const { user } = useAuth()
  const reports = adminNav.find((i) => i.path === '/admin/reports')

  return (
    <>
      <PageHeader title={`Welcome, ${user.name}`} subtitle="Platform overview and administration." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <div className="mt-6">
        <SectionCard title="Reports" linkTo={reports.path}>
          <EmptyState icon={reports.icon} title={reports.emptyTitle} message={reports.emptyMessage} />
        </SectionCard>
      </div>
    </>
  )
}

export default AdminDashboard
