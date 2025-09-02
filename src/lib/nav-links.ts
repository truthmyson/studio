
export interface NavLink {
  href: string;
  label: string;
}

export function getNavLinks(pathname: string): NavLink[] {
  const isRep = pathname.startsWith('/rep-');
  const isStudent = pathname.startsWith('/student-');
  
  if (isRep) {
    return [
      { href: '/rep-dashboard', label: 'Dashboard' },
      { href: '/classes', label: 'My Classes' },
      { href: '/all-students', label: 'All Students' },
      { href: '/attendance', label: 'Attendance AI' },
    ];
  }

  // The student-facing app is mobile-only now, so no web nav links.
  if (isStudent) {
    return [];
  }

  // Fallback for any other pages (like settings) or if no specific role context
  // This could also be an empty array if dashboards are the only views with navs
  return [];
}
