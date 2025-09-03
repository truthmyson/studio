
'use client';

import { AttendanceGeneratorForm } from "@/components/feature/attendance-generator-form";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function TablePage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader>
                <div>
                    <PageHeaderHeading>Attendance Report Generator</PageHeaderHeading>
                    <PageHeaderDescription>
                        Paste your data in JSON format to generate a downloadable CSV attendance report.
                    </PageHeaderDescription>
                </div>
            </PageHeader>
            <Card>
                <CardContent className="pt-6">
                    <AttendanceGeneratorForm />
                </CardContent>
            </Card>
        </div>
    );
}
