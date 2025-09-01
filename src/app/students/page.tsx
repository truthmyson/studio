import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { StudentsTable } from "@/components/feature/students-table";
import { studentData } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentsPage() {
  return (
    <div className="flex-1 space-y-4">
       <PageHeader>
        <div>
            <PageHeaderHeading>Manage Students</PageHeaderHeading>
            <PageHeaderDescription>
                View, add, or upload student data.
            </PageHeaderDescription>
        </div>
        <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <StudentsTable data={studentData} />
        </CardContent>
      </Card>
    </div>
  );
}
