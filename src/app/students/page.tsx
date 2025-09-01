
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { StudentsTable } from "@/components/feature/students-table";
import { studentData } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentsPage() {
  return (
    <div className="flex-1 space-y-4">
       <PageHeader>
        <div>
            <PageHeaderHeading>Manage Students</PageHeaderHeading>
            <PageHeaderDescription>
                View student data.
            </PageHeaderDescription>
        </div>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <StudentsTable data={studentData} />
        </CardContent>
      </Card>
    </div>
  );
}
