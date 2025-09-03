
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { AttendanceGeneratorForm } from "@/components/feature/attendance-generator-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function AttendancePage(props: {}) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader>
                <div>
                    <PageHeaderHeading>AI Attendance Report Generator</PageHeaderHeading>
                    <PageHeaderDescription>
                        Paste your student and attendance data in JSON format to generate a downloadable CSV report.
                    </PageHeaderDescription>
                </div>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Generate Report</CardTitle>
                    <CardDescription>
                        Provide student details and attendance records to create your report.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh] w-full">
                        <div className="pr-6">
                            <AttendanceGeneratorForm />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
