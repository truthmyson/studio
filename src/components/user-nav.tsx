
'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function UserNav() {
  const pathname = usePathname();

  // In a real app, you'd get the user's name and email from session/context
  const userName = 'Chris Mensah';
  const userEmail = 'chris.mensah@university.edu';
  const userInitials = 'CM';

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
     if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, '', `#${id}`);
        }
     }
  };

  return null;
}
