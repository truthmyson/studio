
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    User,
    BookOpenCheck,
  } from 'lucide-react';

export function getNavLinks(pathname: string) {
    if (pathname.includes('student-dashboard') || pathname.includes('settings')) {
        return [
          { href: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/settings', label: 'Settings', icon: Settings },
        ]
    }
     if (pathname.includes('rep-dashboard') || pathname.includes('classes') || pathname.includes('students') || pathname.includes('attendance') || pathname.includes('all-students')) {
         return [
          { href: '/rep-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/classes', label: 'My Classes', icon: BookOpenCheck },
          { href: '/all-students', label: 'All Students', icon: Users },
          { href: '/attendance', label: 'Attendance AI', icon: FileText },
          { href: '/settings', label: 'Settings', icon: Settings },
         ]
     }
     // Fallback for home page etc.
     return [
          { href: '/student-dashboard', label: 'Student Dashboard', icon: User },
          { href: '/rep-dashboard', label: 'Rep Dashboard', icon: LayoutDashboard },
     ]
}
