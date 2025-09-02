
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FontProvider } from '@/components/font-provider';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'VITOBU - Smart University Attendance',
  description: 'The seamless, modern, and intelligent solution for managing university attendance with geo-fencing, real-time notifications, and automated reporting.',
  keywords: ['attendance app', 'university', 'college', 'student attendance', 'geo-fencing', 'VITOBU'],
  openGraph: {
    title: 'VITOBU - Smart University Attendance',
    description: 'Modernizing student attendance for universities and colleges.',
    type: 'website',
    url: 'https://vitobu.app', // Replace with your actual URL
    images: [
      {
        url: '/og-image.png', // Replace with a URL to your open graph image
        width: 1200,
        height: 630,
        alt: 'VITOBU App Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VITOBU - Smart University Attendance',
    description: 'The seamless, modern, and intelligent solution for managing university attendance.',
    images: ['/twitter-image.png'], // Replace with a URL to your twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FontProvider>
            {children}
            <SiteFooter />
            <Toaster />
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
