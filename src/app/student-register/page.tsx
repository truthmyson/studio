
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormState, useFormStatus } from 'react-dom';
import { registerStudentAction, type StudentFormState } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
    </Button>
  );
}

export default function StudentRegisterPage() {
  const initialState: StudentFormState = { status: 'idle', message: '' };
  const [state, formAction] = useFormState(registerStudentAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
        toast({ title: 'Success!', description: state.message });
        formRef.current?.reset();
    } else if (state.status === 'error') {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
    }
  }, [state, toast]);

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
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input name="firstName" id="firstName" placeholder="John" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name <span className="text-muted-foreground">(optional)</span></Label>
                    <Input name="middleName" id="middleName" placeholder="Fitzgerald" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input name="lastName" id="lastName" placeholder="Doe" required />
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="studentId">School ID</Label>
                <Input name="studentId" id="studentId" placeholder="STU001" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">University Email</Label>
                    <Input name="email" id="email" type="email" placeholder="name@university.edu" required />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number <span className="text-muted-foreground">(optional)</span></Label>
                    <Input name="contact" id="contact" type="tel" placeholder="+1234567890" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender <span className="text-muted-foreground">(optional)</span></Label>
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
            </div>
             <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input name="courseName" id="courseName" placeholder="B.Sc. Computer Science" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" required />
            </div>
            
            {state.status === 'error' && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <SubmitButton />

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
