
'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VITOBULogo, PlayStoreIcon } from "@/components/icons";
import { Apple } from "lucide-react";

export default function StudentLoginPage() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <VITOBULogo className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Student Portal is on Mobile!</CardTitle>
                    <CardDescription>
                        To access your dashboard, mark attendance, and manage your classes, please download the VITOBU mobile app.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                     <Button size="lg" className="transition-transform duration-300 hover:scale-105">
                        <Apple className="mr-2 h-6 w-6" />
                        Download for iOS
                    </Button>
                    <Button size="lg" variant="outline" className="transition-transform duration-300 hover:scale-105">
                        <PlayStoreIcon className="mr-2 h-5 w-5"/>
                        Download for Android
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
