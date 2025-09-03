
'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VITOBULogo } from '@/components/icons';
import { registerRepAction, type StudentFormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  );
}

export default function RepRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const initialState: StudentFormState = {
    status: 'idle',
    message: '',
  };

  const [state, formAction] = useActionState(registerRepAction, initialState);

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: state.message,
      });
    } else if (state.status === 'success') {
      const successUrl = `/auth-success?redirectTo=/rep-dashboard&message=Registration Successful!&description=Your account has been created. Redirecting...`;
      router.push(successUrl);
    }
  }, [state, toast, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <VITOBULogo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Representative Account</CardTitle>
          <CardDescription>
            Fill out the form below to get started.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" placeholder="John" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" required />
            </div>
             <div className="grid gap-2 col-span-1 md:col-span-2">
              <Label htmlFor="middleName">Middle Name (Optional)</Label>
              <Input id="middleName" name="middleName" placeholder="Kofi" />
            </div>
            <div className="grid gap-2 col-span-1 md:col-span-2">
              <Label htmlFor="studentId">School ID</Label>
              <Input id="studentId" name="studentId" placeholder="10-digit ID" required />
            </div>
            <div className="grid gap-2 col-span-1 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
             <div className="grid gap-2 col-span-1 md:col-span-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" name="contact" placeholder="0551234567" required />
            </div>
             <div className="grid gap-2 col-span-1 md:col-span-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender">
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="grid gap-2 col-span-1 md:col-span-2">
                <Label htmlFor="courseName">Course/Department</Label>
                <Input id="courseName" name="courseName" placeholder="e.g., Computer Science" required />
             </div>
            <div className="grid gap-2 col-span-1 md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/rep-login" className="underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    