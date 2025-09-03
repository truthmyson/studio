
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { StudentsTable } from "@/components/feature/students-table";
import { studentData } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";

export default function ClassesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <PageHeader>
        <div>
            <PageHeaderHeading>Manage Classes</PageHeaderHeading>
            <PageHeaderDescription>
                View your classes and manage students.
            </PageHeaderDescription>
        </div>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <p>Class management UI coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
