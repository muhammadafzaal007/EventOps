export const EVENT_TYPES = [
  'Competition',
  'Seminar',
  'Workshop',
  'Webinar',
  'Conference',
  'Society Event',
  'Sports',
  'Cultural Event',
]

export const REGISTRATION_TYPES = ['Free', 'Paid', 'Invite Only']

export const EVENT_STATUSES = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Registration Open',
  'Registration Closed',
  'Ongoing',
  'Completed',
  'Cancelled',
  'Rejected',
]

export const PUBLIC_STATUSES = [
  'Approved',
  'Registration Open',
  'Registration Closed',
  'Ongoing',
  'Completed',
]

export const STATUS_COLORS = {
  Draft: 'bg-slate-100 text-slate-600',
  'Pending Approval': 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  'Registration Open': 'bg-blue-100 text-blue-700',
  'Registration Closed': 'bg-indigo-100 text-indigo-700',
  Ongoing: 'bg-violet-100 text-violet-700',
  Completed: 'bg-teal-100 text-teal-700',
  Cancelled: 'bg-red-100 text-red-600',
  Rejected: 'bg-rose-100 text-rose-700',
}
