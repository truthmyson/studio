
export interface NavLink {
  href: string;
  label: string;
}

const REP_AUTHED_ROUTES = ['/rep-dashboard', '/classes', '/students', '/attendance'];

export function getNavLinks(pathname: string): NavLink[] {
  const isRepAuthed = REP_AUTHED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isRepAuthed) {
    return [
      { href: '/rep-dashboard', label: 'Dashboard' },
      { href: '/classes', label: 'My Classes' },
      { href: '/students', label: 'Manage Students' },
      { href: '/attendance', label: 'Attendance AI' },
    ];
  }

  // The student-facing app is mobile-only, so no web nav links.
  if (pathname.startsWith('/student-') || pathname.startsWith('/join/')) {
    return [];
  }

  // Default nav links for the marketing site pages
  return [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '#demo', label: 'Demo' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];
}
