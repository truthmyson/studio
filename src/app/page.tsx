
'use client';

import { Button } from '@/components/ui/button';
import { VITOBULogo } from '@/components/icons';
import { Apple, ArrowRight, Bot, ChevronDown, Feather, FileCheck, Users } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';


function PlayStoreIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" {...props}>
            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0L11 27.3l104.6 104.6 157.6-157.6C263.2 29.3 245.3 0 211.3 0H47zm232.5 157.6l-157.6 157.6-104.6-104.6L47 211.3v261.4C47 502 61.3 512 75.3 512H211.3c34 0 51.8-29.3 62-48.4l157.6-157.6-157.6-157.6zM362.2 256l60.1-60.1-280.8-161.2L47 153.6v.1l104.6 104.6 157.6 157.6 60.1-60.1z"/>
        </svg>
    )
}

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
  return (
    <div className="flex-1 w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
                 <div className="flex items-center gap-2">
                    <VITOBULogo className="h-8 w-8 text-primary" />
                    <span className="font-bold text-lg">VITOBU</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost">How it Works</Button>
                    <Button variant="ghost">Features</Button>
                    <Button variant="ghost">FAQ</Button>
                    <Button asChild>
                        <Link href="/rep-login">
                            Representative Portal
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>

        {/* Hero Section */}
        <section className="container grid items-center gap-6 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="mx-auto flex w-full flex-col items-center gap-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                    Smart, Seamless Attendance <br /> for the Modern University
                </h1>
                <p className="max-w-3xl text-lg text-muted-foreground md:text-xl">
                    VITOBU leverages geo-fencing for accurate check-ins, provides real-time data for representatives, and offers a simple, intuitive interface for students.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" variant="outline" className="transition-transform duration-300 hover:scale-105">
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

        {/* Features Section */}
        <section id="features" className="container py-12 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Why VITOBU?</h2>
                <p className="text-muted-foreground md:text-lg">Everything you need to streamline attendance management.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="bg-muted py-16 md:py-24">
             <div className="container grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-4">
                    <Badge variant="secondary">How It Works</Badge>
                     <h2 className="text-3xl font-bold md:text-4xl">Simple Steps for Reps & Students</h2>
                     <p className="text-muted-foreground md:text-lg">
                        A straightforward process ensures everyone can get started in minutes.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                            <div className="flex-1">
                                <h4 className="font-bold">Rep Creates a Session</h4>
                                <p className="text-muted-foreground">The class representative starts a geo-fenced attendance session from their dashboard, setting a location and time limit.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                            <div className="flex-1">
                                <h4 className="font-bold">Students Get Notified</h4>
                                <p className="text-muted-foreground">All students enrolled in the class receive an instant notification that the session has started.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
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

         {/* Screenshots Carousel */}
        <section id="screenshots" className="container py-16 md:py-24 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Explore the App</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Clean, intuitive, and powerful dashboards for both students and representatives.
            </p>
             <Carousel className="w-full max-w-4xl mx-auto mt-8"
                opts={{
                    align: "start",
                    loop: true,
                }}
             >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                        <Card className="overflow-hidden group">
                            <CardContent className="flex aspect-[9/16] items-center justify-center p-0">
                               <Image src={`https://picsum.photos/seed/${index+1}/450/800`} width={450} height={800} alt={`App Screenshot ${index + 1}`} data-ai-hint="app screenshot" className="transition-transform duration-500 group-hover:scale-105" />
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="transition-transform hover:scale-110" />
                <CarouselNext className="transition-transform hover:scale-110" />
            </Carousel>
        </section>

        {/* CTA Section */}
        <section id="download" className="bg-primary text-primary-foreground">
            <div className="container py-16 text-center md:py-24">
                 <h2 className="text-3xl font-bold md:text-4xl">Get Started with VITOBU Today</h2>
                 <p className="max-w-2xl mx-auto mt-4 text-lg text-primary-foreground/80">
                    Download the app and revolutionize how your institution handles attendance.
                    It's free to get started.
                </p>
                <div className="flex justify-center gap-4 mt-8">
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
