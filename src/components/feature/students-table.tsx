
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  import type { Student } from '@/lib/types';
  import { Button } from '../ui/button';
  import { Trash2 } from 'lucide-react';
  
  interface Action {
    label: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    onClick?: (studentId: string) => void;
    Component?: React.FC<{ student: Student }>;
}

  interface StudentsTableProps {
    data: Student[];
    actions?: Action[];
  }
  
  export function StudentsTable({ data, actions = [] }: StudentsTableProps) {
    // Helper to construct full name
    const getFullName = (student: Student) => {
        return [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Course</TableHead>
              {actions.length > 0 && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Badge variant="secondary">{student.id}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{getFullName(student)}</TableCell>
                  <TableCell>{student.courseName}</TableCell>
                  {actions.length > 0 && (
                    <TableCell className="text-right">
                        {actions.map((action) => 
                            action.Component ? (
                                <action.Component key={action.label} student={student} />
                            ) : (
                                <Button 
                                    key={action.label} 
                                    variant={action.variant || 'default'} 
                                    size="sm" 
                                    onClick={() => action.onClick?.(student.id)}
                                    className="ml-2"
                                >
                                    {action.label}
                                </Button>
                            )
                        )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={actions.length > 0 ? 4 : 3} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
