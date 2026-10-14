import DashboardShell from '../components/dashboard/DashboardShell'
import { adminNav, roleLabels } from '../config/dashboardNav'

const AdminLayout = () => <DashboardShell roleLabel={roleLabels.admin} navItems={adminNav} />
export default AdminLayout
