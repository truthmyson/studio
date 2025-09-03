
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { MainNav } from './main-nav';
import { ModeToggle } from './mode-toggle';
import { getNavLinks } from '@/lib/nav-links';
import Link from 'next/link';
import { VITOBULogo } from './icons';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Menu, Settings, LogIn } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';

const NO_NAV_ROUTES = ['/rep-login', '/rep-register', '/student-login'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // For the homepage, we'll define specific links. For others, it's dynamic.
  const homeLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#demo', label: 'Demo' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  const otherLinks = getNavLinks(pathname);
  const links = pathname === '/' ? homeLinks : otherLinks;

  const showNav = !NO_NAV_ROUTES.includes(pathname);

  return (
    <div className="flex-col md:flex">
      <div className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 container max-w-screen-2xl">
          <Link href="/#top" className="flex items-center gap-2 mr-6">
            <VITOBULogo className="h-6 w-6 text-primary" />
            <span className={cn("font-bold", "hidden md:inline-block")}>
              VITOBU
            </span>
          </Link>

          {showNav && (
            <>
              <div className="hidden md:flex flex-1">
                <MainNav links={links} />
              </div>

              <div className="ml-auto flex items-center space-x-2">
                
                <div className="hidden md:flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => router.push('/rep-login')}>
                                <LogIn className="mr-2 h-4 w-4" />
                                <span>Rep Login</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <ModeToggle />
                                <span className="ml-2">Toggle Theme</span>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6"/>
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <Link href="/" className="flex items-center gap-2 mb-6">
                               <VITOBULogo className="h-6 w-6 text-primary" />
                               <span className="font-bold">VITOBU</span>
                            </Link>
                            <nav className="flex flex-col gap-4">
                                {links.map(link => (
                                    <Link key={link.href} href={link.href} className="text-lg font-medium text-muted-foreground hover:text-foreground">
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                             <div className="mt-6 pt-6 border-t flex flex-col gap-4">
                                <Button variant="outline" onClick={() => router.push('/rep-login')}>
                                    <LogIn className="mr-2"/>
                                    Rep Login
                                </Button>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Toggle Theme</span>
                                    <ModeToggle />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
