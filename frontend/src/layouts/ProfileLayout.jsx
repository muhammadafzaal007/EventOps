import DashboardShell from '../components/dashboard/DashboardShell'
import { navByRole, roleLabels } from '../config/dashboardNav'
import useAuth from '../hooks/useAuth'

function ProfileLayout() {
  const { user } = useAuth()
  return <DashboardShell roleLabel={roleLabels[user.role]} navItems={navByRole[user.role] || []} />
}
export default ProfileLayout
