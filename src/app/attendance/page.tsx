import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { AttendanceGeneratorForm } from "@/components/feature/attendance-generator-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AttendancePage() {
  return (
    <div className="flex-1 space-y-4">
      <PageHeader>
        <div>
          <PageHeaderHeading>Attendance Table Generator</PageHeaderHeading>
          <PageHeaderDescription>
            Use AI to generate a downloadable CSV from student and attendance data.
          </PageHeaderDescription>
        </div>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Create Attendance Report</CardTitle>
            <CardDescription>
                Provide student details and attendance records in JSON format. The AI will generate a structured CSV file for you.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AttendanceGeneratorForm />
        </CardContent>
      </Card>
    </div>
  );
}
