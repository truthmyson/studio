import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import Link from "next/link";

export default function RepRegisterPage() {
  return (
    <div className="flex-1 space-y-4">
        <PageHeader>
            <div>
                <PageHeaderHeading>Register as a Class Representative</PageHeaderHeading>
                <PageHeaderDescription>
                    Gain access to attendance management tools for your class.
                </PageHeaderDescription>
            </div>
        </PageHeader>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Representative Registration</CardTitle>
          <CardDescription>
            Fill out the form below to request representative permissions. Your request will be reviewed by an administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input id="studentId" placeholder="STU001" required />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <Input id="email" type="email" placeholder="name@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course/Program</Label>
              <Input id="course" placeholder="B.Sc. Computer Science" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for application</Label>
              <textarea
                id="reason"
                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Briefly explain why you want to be a class representative."
              />
            </div>
            <Button type="submit" className="w-full">Submit Application</Button>
             <p className="text-center text-sm text-muted-foreground">
                Already have a rep account?{' '}
                <Link href="/rep-login" className="underline hover:text-primary">
                    Login
                </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
