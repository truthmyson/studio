
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const message = searchParams.get('message') || 'Success!';
  const description = searchParams.get('description') || 'Redirecting you now...';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, 2500); // 2.5 second delay before redirecting

    return () => clearTimeout(timer);
  }, [router, redirectTo]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center items-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-green-500 animate-in fade-in zoom-in-50 duration-500" />
          </div>
          <CardTitle className="text-2xl">{message}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
