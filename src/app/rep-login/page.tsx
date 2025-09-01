import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import Link from "next/link";

export default function RepLoginPage() {
  return (
    <div className="flex-1 space-y-4">
        <PageHeader>
            <div>
                <PageHeaderHeading>Representative Login</PageHeaderHeading>
                <PageHeaderDescription>
                    Access your class management dashboard.
                </PageHeaderDescription>
            </div>
        </PageHeader>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Rep Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <Input id="email" type="email" placeholder="rep@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Login</Button>
             <p className="text-center text-sm text-muted-foreground">
                Don't have a rep account?{' '}
                <Link href="/rep-register" className="underline hover:text-primary">
                    Register
                </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
