import { Button } from '@/components/ui/button';
import { UniAttendLogo } from '@/components/icons';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center gap-4">
            <UniAttendLogo className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight text-primary">UniAttend</h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          The seamless, modern, and intelligent solution for managing university attendance. 
          UniAttend leverages geo-fencing for accurate check-ins, provides real-time data for representatives, and offers a simple interface for students.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 items-center">
         <div className="flex gap-4">
            <Button asChild size="lg">
                <Link href="/student-login">Student Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
                <Link href="/rep-login">Rep Login</Link>
            </Button>
        </div>
         <div className="text-center space-y-2 mt-4">
             <p className="text-sm text-muted-foreground">Don't have an account?</p>
             <div className="flex gap-4">
                <Button asChild variant="secondary">
                    <Link href="/student-register">Register as Student</Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/rep-register">Register as Rep</Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
