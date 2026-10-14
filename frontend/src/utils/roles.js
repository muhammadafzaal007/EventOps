export const ROLE_HOME = {
  student: '/student',
  organizer: '/organizer',
  admin: '/admin',
}

export const homeForRole = (role) => ROLE_HOME[role] || '/profile'
