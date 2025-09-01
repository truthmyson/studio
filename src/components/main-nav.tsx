'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  User,
  UserPlus,
  BookOpenCheck,
} from 'lucide-react';

const links = [
  { href: '/student-dashboard', label: 'Student Dashboard', icon: User },
  { href: '/rep-dashboard', label: 'Rep Dashboard', icon: LayoutDashboard },
  { href: '/classes', label: 'My Classes', icon: BookOpenCheck },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/attendance', label: 'Attendance AI', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  // A little helper to manage which links to show based on a "role"
  // In a real app, this would come from an auth context.
  const getLinksForRole = () => {
      if (pathname.includes('student')) {
          return [
            { href: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/settings', label: 'Settings', icon: Settings },
          ]
      }
       if (pathname.includes('rep') || pathname.includes('classes') || pathname.includes('students') || pathname.includes('attendance')) {
           return [
            { href: '/rep-dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/classes', label: 'My Classes', icon: BookOpenCheck },
            { href: '/students', label: 'Students', icon: Users },
            { href: '/attendance', label: 'Attendance AI', icon: FileText },
            { href: '/settings', label: 'Settings', icon: Settings },
           ]
       }
       // Fallback for home page etc.
       return [
            { href: '/student-dashboard', label: 'Student View', icon: User },
            { href: '/rep-dashboard', label: 'Rep View', icon: LayoutDashboard },
       ]
  }

  const navLinks = getLinksForRole();


  return (
    <nav
      className={cn('flex flex-col items-start gap-2', className)}
      {...props}
    >
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Button
          key={href}
          asChild
          variant={pathname === href ? 'secondary' : 'ghost'}
          className="w-full justify-start"
        >
          <Link href={href}>
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
