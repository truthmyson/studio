
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


export function UserNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string, email: string, fallback: string } | null>(null);

  useEffect(() => {
    // In a real app, this would come from an auth context.
    // We simulate it based on the URL.
    if (pathname.includes('student')) {
      const student = studentData.find(s => s.id === '24275016'); // Mock current user
      if (student) {
        setUser({
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          fallback: `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`,
        });
      }
    } else if (pathname.includes('rep')) {
      setUser({
        name: 'Class Rep',
        email: 'rep@university.edu',
        fallback: 'CR',
      });
    } else {
        // Default user for other pages
        setUser({
            name: 'Guest User',
            email: 'guest@university.edu',
            fallback: 'GU'
        })
    }
  }, [pathname]);

  if (!user) {
    return null; // Or a loading skeleton
  }

  return (
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
        <DropdownMenuItem>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
