
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getStudentsForClassAction, removeStudentFromClassAction, type ClassWithStudentCount } from '@/lib/actions';
import type { Student } from '@/lib/types';
import { StudentsTable } from './students-table';
import { Trash2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


interface ViewStudentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassWithStudentCount;
  onStudentsUpdated: () => void; // Callback to refresh data on parent page
}

export function ViewStudentsDialog({ isOpen, onClose, classInfo, onStudentsUpdated }: ViewStudentsDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      if (isOpen) {
        setIsLoading(true);
        const fetchedStudents = await getStudentsForClassAction(classInfo.id);
        setStudents(fetchedStudents);
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [isOpen, classInfo.id]);

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    const result = await removeStudentFromClassAction(classInfo.id, studentId);
    if (result.success) {
      toast({
        title: 'Student Removed',
        description: `${studentName} has been removed from ${classInfo.name}.`
      });
      // Refresh the student list and the class card count
      const updatedStudents = await getStudentsForClassAction(classInfo.id);
      setStudents(updatedStudents);
      onStudentsUpdated();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  };

  const actions = [
    {
        label: 'Remove',
        variant: 'destructive' as const,
        Component: ({ student }: { student: Student }) => (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="ml-2">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove {student.firstName} {student.lastName} from the class. They will need to re-join using the class code.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveStudent(student.id, `${student.firstName} ${student.lastName}`)}>
                            Confirm Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        ),
    },
  ];


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Students in {classInfo.name}</DialogTitle>
          <DialogDescription>
            {classInfo.studentCount} student{classInfo.studentCount !== 1 ? 's are' : ' is'} enrolled in this class.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : (
                <StudentsTable data={students} actions={actions} />
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
