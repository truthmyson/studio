
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { UniAttendLogo } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Button } from './ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getNavLinks } from '@/lib/nav-links';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = getNavLinks(pathname);
  const homeLink = navLinks[0]?.href || '/';

  if (!isClient) {
    // Prevent hydration mismatch by returning a placeholder or null on the server.
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
                 {/* Simplified header for SSR */}
                <div className="flex w-full items-center justify-end gap-4">
                    <UserNav />
                </div>
            </header>
             <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
        <div className="hidden md:flex md:flex-row md:items-center md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 h-auto">
                <div className="flex items-center gap-2">
                  <UniAttendLogo className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold text-primary">UniAttend</h1>
                  <ChevronDown className="h-4 w-4 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {navLinks.map(({ href, label }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href}>{label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href={homeLink} className="flex items-center gap-2 text-lg font-semibold mb-4">
                <UniAttendLogo className="h-6 w-6 text-primary" />
                <span className="">UniAttend</span>
              </Link>
              <MainNav />
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full items-center justify-end gap-4">
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-card p-4 md:flex">
          <MainNav />
        </aside>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
