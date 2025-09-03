
'use client';

import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { StudentsTable } from "@/components/feature/students-table";
import { getAllStudentsAction } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/lib/types";
import { DirectMessageDialog } from "@/components/feature/direct-message-dialog";

const REP_ID = '24275016'; // Hardcoded for now

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const fetchStudents = async () => {
    const data = await getAllStudentsAction();
    setStudents(data);
    if (isLoading) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 3000); // Poll for new students every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleOpenMessageDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsMessageDialogOpen(true);
  };

  const handleCloseMessageDialog = () => {
    setSelectedStudent(null);
    setIsMessageDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <PageHeader>
        <div>
            <PageHeaderHeading>Manage Students</PageHeaderHeading>
            <PageHeaderDescription>
                View, manage, and message student data.
            </PageHeaderDescription>
        </div>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p>Loading students...</p>
          ) : (
            <StudentsTable data={students} onMessageStudent={handleOpenMessageDialog} />
          )}
        </CardContent>
      </Card>
      
      {selectedStudent && (
        <DirectMessageDialog
          isOpen={isMessageDialogOpen}
          onClose={handleCloseMessageDialog}
          student={selectedStudent}
          repId={REP_ID}
        />
      )}
    </div>
  );
}

    
