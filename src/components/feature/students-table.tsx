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
      onClick: (studentId: string) => void;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  }

  interface StudentsTableProps {
    data: Student[];
    actions?: Action[];
  }
  
  export function StudentsTable({ data, actions = [] }: StudentsTableProps) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Major</TableHead>
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
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  {actions.length > 0 && (
                    <TableCell className="text-right">
                        {actions.map(action => (
                            <Button 
                                key={action.label} 
                                variant={action.variant} 
                                size="sm" 
                                onClick={() => action.onClick(student.id)}
                                className="ml-2"
                            >
                                <Trash2 className="mr-2 h-4 w-4"/>
                                {action.label}
                            </Button>
                        ))}
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
  
