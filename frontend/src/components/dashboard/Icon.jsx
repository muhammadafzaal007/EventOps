const PATHS = {
  home: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10',
  calendar: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  ticket: 'M4 8a2 2 0 002-2h12a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 000-4V8z',
  bell: 'M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6zM10 19a2 2 0 004 0',
  check: 'M5 13l4 4L19 7',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0',
  users: 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 19a6 6 0 0112 0M17 11a3 3 0 100-6M21 19a6 6 0 00-4-5.6',
  plus: 'M12 5v14M5 12h14',
  clock: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3',
  image: 'M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM8 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 16l-5-5-9 8',
  building: 'M4 21V5l8-2 8 2v16M9 9h2M13 9h2M9 13h2M13 13h2M10 21v-4h4v4',
  chart: 'M4 20h16M7 16v-5M12 16V6M17 16v-8',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  inbox: 'M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5a3 3 0 006 0h5',
}

function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name] || PATHS.inbox} />
    </svg>
  )
}

export default Icon
