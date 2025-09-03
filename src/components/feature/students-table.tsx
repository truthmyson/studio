
'use client';

import * as React from 'react';
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
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
  
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
    const [searchTerm, setSearchTerm] = React.useState('');

    const getFullName = (student: Student) => {
        return [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');
    }

    const filteredData = React.useMemo(() => {
        if (!searchTerm) return data;
        const lowercasedFilter = searchTerm.toLowerCase();
        return data.filter((student) => {
            const fullName = getFullName(student).toLowerCase();
            const studentId = student.id.toLowerCase();
            return fullName.includes(lowercasedFilter) || studentId.includes(lowercasedFilter);
        });
    }, [searchTerm, data]);


    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
                {filteredData.length > 0 ? (
                filteredData.map((student) => (
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
      </div>
    );
  }
