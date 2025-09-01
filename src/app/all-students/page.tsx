
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAllClassesAction } from "@/lib/actions";
import { studentData } from "@/lib/constants";
import type { Student } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EnrolledStudentInfo {
    student: Student;
    className: string;
    joinedAt: string;
}

export default function AllStudentsPage() {
    const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudentInfo[]>([]);
    
    useEffect(() => {
        async function fetchEnrolledStudents() {
            const allClasses = await getAllClassesAction();
            const allEnrolledInfo: EnrolledStudentInfo[] = [];

            allClasses.forEach(cls => {
                cls.students.forEach(classStudent => {
                    const studentDetails = studentData.find(s => s.id === classStudent.studentId);
                    if (studentDetails) {
                        allEnrolledInfo.push({
                            student: studentDetails,
                            className: cls.name,
                            joinedAt: classStudent.joinedAt,
                        });
                    }
                });
            });
            // Sort by join date, most recent first
            allEnrolledInfo.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
            setEnrolledStudents(allEnrolledInfo);
        }

        fetchEnrolledStudents();
    }, []);
    
    const getFullName = (student: Student) => {
        return [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');
    }


  return (
    <div className="flex-1 space-y-4">
       <PageHeader>
        <div>
            <PageHeaderHeading>All Students</PageHeaderHeading>
            <PageHeaderDescription>
                An overview of all students enrolled in your classes.
            </PageHeaderDescription>
        </div>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Date Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrolledStudents.length > 0 ? (
                    enrolledStudents.map(({ student, className, joinedAt }) => (
                        <TableRow key={`${student.id}-${className}`}>
                        <TableCell>
                            <Badge variant="secondary">{student.id}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{getFullName(student)}</TableCell>
                        <TableCell>{className}</TableCell>
                        <TableCell>{format(new Date(joinedAt), "PPP")}</TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        No students have joined any of your classes yet.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
