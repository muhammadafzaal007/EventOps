// Navigation + placeholder copy per role. Paths are the single source for routes.

export const studentNav = [
  { label: 'Overview', path: '/student', icon: 'home', end: true },
  {
    label: 'Upcoming Events', path: '/student/events', icon: 'calendar',
    title: 'Upcoming Events', description: 'Events open for registration.',
    emptyTitle: 'No upcoming events', emptyMessage: 'Events will appear here once they are published.',
  },
  {
    label: 'My Registrations', path: '/student/registrations', icon: 'ticket',
    title: 'My Registrations', description: 'Events you have registered for.',
    emptyTitle: 'No registrations yet', emptyMessage: 'Your event registrations will be listed here.',
  },
  {
    label: 'Notifications', path: '/student/notifications', icon: 'bell',
    title: 'Notifications', description: 'Updates about your events and registrations.',
    emptyTitle: 'No notifications', emptyMessage: "You're all caught up.",
  },
  {
    label: 'Attendance', path: '/student/attendance', icon: 'check',
    title: 'Attendance', description: 'Your attendance record across events.',
    emptyTitle: 'No attendance records', emptyMessage: 'Attendance will be recorded after you attend events.',
  },
  { label: 'Profile', path: '/profile', icon: 'user' },
]

export const organizerNav = [
  { label: 'Overview', path: '/organizer', icon: 'home', end: true },
  {
    label: 'My Events', path: '/organizer/events', icon: 'calendar',
    title: 'My Events', description: 'Events you have created.',
    emptyTitle: 'No events yet', emptyMessage: 'Events you create will appear here.',
    actionLabel: 'Create event', actionTo: '/organizer/events/new',
  },
  {
    label: 'Create Event', path: '/organizer/events/new', icon: 'plus',
    title: 'Create Event', description: 'Set up a new event for approval.',
    emptyTitle: 'Event creation coming soon', emptyMessage: 'The event form will be available in an upcoming update.',
  },
  {
    label: 'Pending Approvals', path: '/organizer/approvals', icon: 'clock',
    title: 'Pending Approvals', description: 'Events awaiting admin approval.',
    emptyTitle: 'Nothing pending', emptyMessage: 'Submitted events awaiting approval will show here.',
  },
  {
    label: 'Registrations', path: '/organizer/registrations', icon: 'ticket',
    title: 'Registrations', description: 'Participants registered for your events.',
    emptyTitle: 'No registrations', emptyMessage: 'Registrations will appear once students sign up.',
  },
  {
    label: 'Attendance', path: '/organizer/attendance', icon: 'check',
    title: 'Attendance', description: 'Mark and review event attendance.',
    emptyTitle: 'No attendance data', emptyMessage: 'Attendance tools will be available for your events.',
  },
  {
    label: 'Results', path: '/organizer/results', icon: 'trophy',
    title: 'Results', description: 'Publish and manage event results.',
    emptyTitle: 'No results published', emptyMessage: 'Results for completed events will appear here.',
  },
  {
    label: 'Gallery', path: '/organizer/gallery', icon: 'image',
    title: 'Gallery', description: 'Photos from your events.',
    emptyTitle: 'No photos uploaded', emptyMessage: 'Event galleries will appear here.',
  },
  { label: 'Profile', path: '/profile', icon: 'user' },
]

export const adminNav = [
  { label: 'Overview', path: '/admin', icon: 'home', end: true },
  {
    label: 'Users', path: '/admin/users', icon: 'users',
    title: 'Users', description: 'All registered users.',
    emptyTitle: 'No user data yet', emptyMessage: 'User management will be available in an upcoming update.',
  },
  {
    label: 'Events', path: '/admin/events', icon: 'calendar',
    title: 'Events', description: 'All events on the platform.',
    emptyTitle: 'No events yet', emptyMessage: 'Events will be listed here once created.',
  },
  {
    label: 'Pending Approvals', path: '/admin/approvals', icon: 'clock',
    title: 'Pending Event Approvals', description: 'Events awaiting your review.',
    emptyTitle: 'No pending approvals', emptyMessage: 'Submitted events will appear here for review.',
  },
  {
    label: 'Registrations', path: '/admin/registrations', icon: 'ticket',
    title: 'Registrations', description: 'Registrations across all events.',
    emptyTitle: 'No registrations yet', emptyMessage: 'Registration data will appear here.',
  },
  {
    label: 'Venues', path: '/admin/venues', icon: 'building',
    title: 'Venues', description: 'Manage event venues.',
    emptyTitle: 'No venues added', emptyMessage: 'Venues will be managed here.',
  },
  {
    label: 'Attendance', path: '/admin/attendance', icon: 'check',
    title: 'Attendance', description: 'Attendance overview across events.',
    emptyTitle: 'No attendance data', emptyMessage: 'Attendance records will appear here.',
  },
  {
    label: 'Reports', path: '/admin/reports', icon: 'chart',
    title: 'Reports', description: 'Platform reports and summaries.',
    emptyTitle: 'No reports available', emptyMessage: 'Reports will be available once there is activity.',
  },
  { label: 'Profile', path: '/profile', icon: 'user' },
]

export const navByRole = { student: studentNav, organizer: organizerNav, admin: adminNav }
export const roleLabels = { student: 'Student Portal', organizer: 'Organizer Portal', admin: 'Admin Portal' }
