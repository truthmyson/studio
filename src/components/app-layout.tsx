
'use client';

import { usePathname } from 'next/navigation';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { ModeToggle } from './mode-toggle';
import { getNavLinks } from '@/lib/nav-links';
import Link from 'next/link';
import { VITOBULogo } from './icons';
import { cn } from '@/lib/utils';
import { FontSettings } from './feature/font-settings';

const NO_LAYOUT_ROUTES = ['/rep-login', '/rep-register', '/student-login'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If it's a no-layout route or the homepage, render children directly
  if (NO_LAYOUT_ROUTES.includes(pathname) || pathname === '/') {
    return <>{children}</>;
  }
  
  // Determine if it's a rep or student context
  const isRep = pathname.startsWith('/rep-');
  const links = getNavLinks(pathname);

  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <VITOBULogo className="h-6 w-6 text-primary" />
            <span className={cn("font-bold", "hidden md:inline-block")}>
              VITOBU
            </span>
          </Link>
          <MainNav links={links} className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <FontSettings />
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
