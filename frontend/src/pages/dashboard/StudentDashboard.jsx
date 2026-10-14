import EmptyState from '../../components/dashboard/EmptyState'
import SectionCard from '../../components/dashboard/SectionCard'
import { studentNav } from '../../config/dashboardNav'
import useAuth from '../../hooks/useAuth'

function StudentDashboard() {
  const { user } = useAuth()
  const panels = studentNav.filter((i) => i.title)

  return (
    <>
      <section className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white shadow-sm">
        <p className="text-sm text-indigo-100">Welcome back</p>
        <h1 className="mt-1 text-2xl font-semibold">{user.name}</h1>
        <p className="mt-2 text-sm text-indigo-100">
          Browse events, track your registrations and keep up with notifications.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {panels.map((p) => (
          <SectionCard key={p.path} title={p.title} linkTo={p.path}>
            <EmptyState icon={p.icon} title={p.emptyTitle} message={p.emptyMessage} />
          </SectionCard>
        ))}
        <SectionCard title="Profile" linkTo="/profile" linkLabel="Edit">
          <dl className="space-y-3 px-5 py-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{user.email}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Student ID</dt><dd className="font-medium text-slate-900">{user.studentId || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Department</dt><dd className="font-medium text-slate-900">{user.department || '—'}</dd></div>
          </dl>
        </SectionCard>
      </div>
    </>
  )
}

export default StudentDashboard
