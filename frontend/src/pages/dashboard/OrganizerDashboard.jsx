import EmptyState from '../../components/dashboard/EmptyState'
import PageHeader from '../../components/dashboard/PageHeader'
import SectionCard from '../../components/dashboard/SectionCard'
import { organizerNav } from '../../config/dashboardNav'
import useAuth from '../../hooks/useAuth'

function OrganizerDashboard() {
  const { user } = useAuth()
  // Create Event is the header action, so it is not repeated as a panel
  const panels = organizerNav.filter((i) => i.title && i.path !== '/organizer/events/new')

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name}`}
        subtitle="Manage your events, approvals, registrations and results."
        actionLabel="Create event"
        actionTo="/organizer/events/new"
      />
      <div className="grid gap-5 md:grid-cols-2">
        {panels.map((p) => (
          <SectionCard key={p.path} title={p.title} linkTo={p.path}>
            <EmptyState icon={p.icon} title={p.emptyTitle} message={p.emptyMessage} />
          </SectionCard>
        ))}
      </div>
    </>
  )
}

export default OrganizerDashboard
