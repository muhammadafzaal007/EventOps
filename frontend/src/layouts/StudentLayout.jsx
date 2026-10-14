import DashboardShell from '../components/dashboard/DashboardShell'
import { roleLabels, studentNav } from '../config/dashboardNav'

const StudentLayout = () => <DashboardShell roleLabel={roleLabels.student} navItems={studentNav} />
export default StudentLayout
