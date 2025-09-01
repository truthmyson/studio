
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
            Fill out the form below to get started. All fields are required unless marked optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="middleName" placeholder="Fitzgerald" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="studentId">School ID</Label>
                <Input id="studentId" placeholder="STU001" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">University Email</Label>
                    <Input id="email" type="email" placeholder="name@university.edu" required />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="contact" type="tel" placeholder="+1234567890" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender <span className="text-muted-foreground">(optional)</span></Label>
                    <Select>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input id="courseName" placeholder="B.Sc. Computer Science" required />
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
