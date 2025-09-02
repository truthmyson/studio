
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/app-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { FontProvider } from '@/components/font-provider';

export const metadata: Metadata = {
  title: 'VITOBU',
  description: 'A modern solution for university attendance.',
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
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
