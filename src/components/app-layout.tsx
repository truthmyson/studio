import { UniAttendLogo } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
        <div className="hidden md:flex md:flex-row md:items-center md:gap-4">
            <UniAttendLogo className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">UniAttend</h1>
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
                    <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <UniAttendLogo className="h-6 w-6 text-primary" />
                        <span className="">UniAttend</span>
                    </div>
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
