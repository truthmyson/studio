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
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/student-dashboard', label: 'Student Dashboard', icon: User },
  { href: '/rep-dashboard', label: 'Rep Dashboard', icon: LayoutDashboard },
  { href: '/classes', label: 'My Classes', icon: BookOpenCheck },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/attendance', label: 'Attendance AI', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex flex-col items-start gap-2', className)}
      {...props}
    >
      {links.map(({ href, label, icon: Icon }) => (
        <Button
          key={href}
          asChild
          variant={pathname.startsWith(href) && href !== '/' || pathname === href ? 'secondary' : 'ghost'}
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
