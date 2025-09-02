
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { studentData } from '@/lib/constants';
import { useEffect, useState } from 'react';
import type { Student } from '@/lib/types';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';


export function UserNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string, email: string, fallback: string } | null>(null);

  useEffect(() => {
    // In a real app, this would come from an auth context.
    // We simulate it based on the URL path.
    const isRepView = pathname.includes('rep');
    const studentId = '24275016'; // Mock current user ID
    
    const currentUser = studentData.find(s => s.id === studentId);

    if (currentUser) {
        if (isRepView && currentUser.isRep) {
             setUser({
                name: `${currentUser.firstName} ${currentUser.lastName} (Rep)`,
                email: currentUser.email,
                fallback: `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`,
             });
        } else {
             setUser({
                name: `${currentUser.firstName} ${currentUser.lastName}`,
                email: currentUser.email,
                fallback: `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`,
             });
        }
    } else if (pathname === '/') {
        // No user needed on the home page
        setUser(null);
    } else {
        // Default guest user for other pages like login/register
        setUser({
            name: 'Guest User',
            email: 'guest@university.edu',
            fallback: 'GU'
        });
    }

  }, [pathname]);

  if (pathname === '/' || !user) {
    return (
        <div className="flex w-full items-center justify-end gap-4">
          <ModeToggle />
        </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
    <ModeToggle />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://picsum.photos/seed/${user.email}/32/32`} alt="User avatar" data-ai-hint="profile picture" />
            <AvatarFallback>{user.fallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
