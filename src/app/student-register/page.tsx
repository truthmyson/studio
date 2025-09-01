import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import Link from "next/link";

export default function StudentRegisterPage() {
  return (
    <div className="flex-1 space-y-4">
        <PageHeader>
            <div>
                <PageHeaderHeading>Student Registration</PageHeaderHeading>
                <PageHeaderDescription>
                    Create your student account to join classes and mark attendance.
                </PageHeaderDescription>
            </div>
        </PageHeader>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Student Account</CardTitle>
          <CardDescription>
            Fill out the form below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" placeholder="STU001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <Input id="email" type="email" placeholder="name@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/student-login" className="underline hover:text-primary">
                    Login
                </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
