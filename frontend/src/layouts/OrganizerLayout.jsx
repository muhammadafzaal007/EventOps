import DashboardShell from '../components/dashboard/DashboardShell'
import { organizerNav, roleLabels } from '../config/dashboardNav'

const OrganizerLayout = () => <DashboardShell roleLabel={roleLabels.organizer} navItems={organizerNav} />
export default OrganizerLayout
