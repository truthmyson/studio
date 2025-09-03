
'use client';

import { Button } from '@/components/ui/button';
import { VITOBULogo } from '@/components/icons';
import { Apple, ArrowRight, Bot, ChevronDown, Feather, FileCheck, Mail, Users } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRef } from 'react';
import { PlayStoreIcon } from '@/components/icons';

const features = [
    {
        icon: <Users className="w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" />,
        title: "Geo-Fenced Attendance",
        description: "Detect student presence within a specified radius of the lecture hall to automatically register attendance.",
    },
    {
        icon: <Feather className="w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" />,
        title: "Live Notifications",
        description: "Send real-time notifications to registered students regarding lecture updates and attendance status.",
    },
    {
        icon: <FileCheck className="w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" />,
        title: "Attendance Summary",
        description: "Get detailed attendance summaries for each student, downloadable in CSV format for easy record-keeping.",
    },
    {
        icon: <Bot className="w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" />,
        title: "AI-Powered Reports",
        description: "Leverage AI to generate insightful attendance reports and identify patterns effortlessly.",
    }
]

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div className="flex-1 w-full" id="top">
        {/* Header content is now handled by AppLayout */}

        {/* Hero Section */}
        <section className="container grid items-center gap-6 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="mx-auto flex w-full flex-col items-center gap-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                    Smart, Seamless Attendance <br /> for the Modern University
                </h1>
                <p className="max-w-3xl text-lg text-muted-foreground md:text-xl">
                    VITOBU leverages geo-fencing for accurate check-ins, provides real-time data for representatives, and offers a simple, intuitive interface for students.
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="transition-transform duration-300 hover:scale-105">
                            <Apple className="mr-2 h-6 w-6" />
                            Download for iOS
                        </Button>
                        <Button size="lg" variant="outline" className="transition-transform duration-300 hover:scale-105">
                            <PlayStoreIcon className="mr-2 h-5 w-5"/>
                            Download for Android
                        </Button>
                    </div>
                    <a href="#newsletter" className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        Subscribe to our newsletter <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted py-16 md:py-24">
            <div className="container space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold md:text-4xl">Why VITOBU?</h2>
                    <p className="text-muted-foreground md:text-lg">Everything you need to streamline attendance management.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => (
                        <Card key={i} className="group transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <CardHeader>
                                <div className="p-3 bg-primary/10 rounded-lg w-fit transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                                    {feature.icon}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
             <div className="container grid gap-12 lg:grid-cols-2 items-center">
                <div className="space-y-4">
                    <Badge variant="secondary" className="px-4 py-2 text-base">How It Works</Badge>
                     <h2 className="text-3xl font-bold md:text-4xl">Simple Steps for Reps & Students</h2>
                     <p className="text-muted-foreground md:text-lg">
                        A straightforward process ensures everyone can get started in minutes.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">1</div>
                            <div className="flex-1">
                                <h4 className="font-bold">Rep Creates a Session</h4>
                                <p className="text-muted-foreground">The class representative starts a geo-fenced attendance session from their dashboard, setting a location and time limit.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">2</div>
                            <div className="flex-1">
                                <h4 className="font-bold">Students Get Notified</h4>
                                <p className="text-muted-foreground">All students enrolled in the class receive an instant notification that the session has started.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">3</div>
                            <div className="flex-1">
                                <h4 className="font-bold">Students Sign In</h4>
                                <p className="text-muted-foreground">Students within the designated area can sign in with a single tap on their phone. Presence is verified instantly.</p>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="relative h-[500px] w-full group overflow-hidden rounded-xl">
                     <Image src="https://picsum.photos/800/1000" layout="fill" objectFit="cover" alt="App interface showing the student dashboard" className="rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105" data-ai-hint="app interface" />
                 </div>
             </div>
        </section>

        {/* Demo Video Section */}
        <section id="demo" className="bg-muted py-16 md:py-24 text-center">
            <div className="container">
                <h2 className="text-3xl font-bold md:text-4xl">Explore the App in Action</h2>
                <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto mb-8">
                    Watch this short demo to see how VITOBU simplifies attendance. Hover over the video to play.
                </p>
                <div className="flex justify-center mb-8">
                    <div className="w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden border">
                        <video
                            ref={videoRef}
                            className="w-full h-full"
                            loop
                            muted
                            playsInline
                            onMouseEnter={() => videoRef.current?.play()}
                            onMouseLeave={() => videoRef.current?.pause()}
                            poster="https://picsum.photos/1280/720"
                        >
                            {/* You can replace this with your actual video source */}
                            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Representative Dashboard</h3>
                        <div className="relative h-[400px] w-full group overflow-hidden rounded-xl">
                            <Image src="https://picsum.photos/800/600" layout="fill" objectFit="cover" alt="Representative Dashboard Screenshot" className="rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105" data-ai-hint="dashboard analytics" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Student Mobile App</h3>
                        <div className="relative h-[400px] w-full group overflow-hidden rounded-xl">
                            <Image src="https://picsum.photos/800/600?grayscale" layout="fill" objectFit="cover" alt="Student App Screenshot" className="rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105" data-ai-hint="mobile app" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section id="download" className="bg-primary text-primary-foreground">
            <div className="container py-16 text-center md:py-24">
                 <h2 className="text-3xl font-bold md:text-4xl">Get Started with VITOBU Today</h2>
                 <p className="max-w-2xl mx-auto mt-4 text-lg text-primary-foreground/80">
                    Download the app and revolutionize how your institution handles attendance.
                    It's free to get started.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                     <Button size="lg" variant="secondary" className="transition-transform duration-300 hover:scale-105">
                        <Apple className="mr-2 h-6 w-6" />
                        Download for iOS
                    </Button>
                    <Button size="lg" variant="secondary" className="transition-transform duration-300 hover:scale-105">
                        <PlayStoreIcon className="mr-2 h-5 w-5"/>
                        Download for Android
                    </Button>
                </div>
            </div>
        </section>

         {/* FAQ Section */}
        <section id="faq" className="container py-16 md:py-24">
            <div className="text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto mt-8">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg">Is VITOBU free to use?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                    Yes, VITOBU is free for individual class representatives and students. We offer premium plans for university-wide deployments with advanced analytics and support.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg">What devices are supported?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                    VITOBU is available on both iOS (iPhone) and Android devices. The representative dashboard can also be accessed via any modern web browser.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg">How accurate is the geo-fencing?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                    Our system uses a combination of GPS, Wi-Fi, and cellular signals to ensure high accuracy. The class representative can set the radius (e.g., 50-100 meters) to match the lecture hall size, preventing sign-ins from outside the designated area.
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg">Can I export the attendance data?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                    Absolutely. Representatives can export attendance records for their classes as CSV or Excel files at any time, making it easy to integrate with other university systems.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>

    </div>
  );
}
