
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { ModeToggle } from './mode-toggle';
import { getNavLinks } from '@/lib/nav-links';
import Link from 'next/link';
import { VITOBULogo } from './icons';
import { cn } from '@/lib/utils';
import { FontSettings } from './feature/font-settings';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

const NO_NAV_ROUTES = ['/rep-login', '/rep-register', '/student-login', '/'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = getNavLinks(pathname);
  const showNav = !NO_NAV_ROUTES.includes(pathname);

  return (
    <div className="flex-col md:flex">
      <div className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 container max-w-screen-2xl">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <VITOBULogo className="h-6 w-6 text-primary" />
            <span className={cn("font-bold", "hidden md:inline-block")}>
              VITOBU
            </span>
          </Link>

          {showNav && <MainNav links={links} />}
          
          <div className="ml-auto flex items-center space-x-2">
            {pathname !== '/' && (
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Go Back
              </Button>
            )}
            {showNav && (
                <>
                    <FontSettings />
                    <ModeToggle />
                    <UserNav />
                </>
            )}
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
