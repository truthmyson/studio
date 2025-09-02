
'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VITOBULogo } from "@/components/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { studentData } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

export default function RepLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const user = studentData.find(u => u.id === studentId);
        
        // In a real app, you'd also check the password.
        // For this demo, we'll just check if the user exists and is a rep.
        if (user && user.isRep) {
            toast({
                title: "Login Successful",
                description: "Redirecting to your dashboard...",
            });
            router.push('/rep-dashboard');
        } else if (user && !user.isRep) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "This portal is for representatives only.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid School ID or password.",
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <VITOBULogo className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Representative Login</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="studentId">School ID</Label>
                        <Input id="studentId" type="text" placeholder="Your School ID" required value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" onClick={handleLogin}>Sign In</Button>
                    <div className="text-center text-sm">
                        Don't have an account?{" "}
                        <Link href="/rep-register" className="underline">
                            Register here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
