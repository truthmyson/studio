
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavLink } from '@/lib/nav-links';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
}

export function MainNav({ className, links, ...props }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === link.href
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
