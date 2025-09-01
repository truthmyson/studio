import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Welcome to UniAttend</h1>
        <p className="text-lg text-muted-foreground">Your modern solution for university attendance.</p>
      </div>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/student-dashboard">Go to Student Dashboard</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/rep-dashboard">Go to Rep Dashboard</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
            <Link href="/rep-register">Register as Rep</Link>
        </Button>
      </div>
    </div>
  );
}
