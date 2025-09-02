
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { getNavLinks } from '@/lib/nav-links';


export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = getNavLinks(pathname);

  if (!isClient) {
    // Render nothing on the server to avoid mismatch
    return null;
  }

  return (
    <nav
      className={cn('flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6', className)}
      {...props}
    >
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'transition-colors hover:text-foreground',
            pathname === href ? 'text-foreground font-semibold' : 'text-muted-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
