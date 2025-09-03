
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { generateAttendanceAction, type FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, AlertCircle } from 'lucide-react';
import {
  attendanceRecordsJsonExample,
  studentDetailsJsonExample,
} from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Report
    </Button>
  );
}

export function AttendanceGeneratorForm() {
  const initialState: FormState = {
    status: 'idle',
    message: '',
  };
  const [state, formAction] = useFormState(generateAttendanceAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();

  // Local state for text areas to allow programmatic updates
  const [studentDetails, setStudentDetails] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState('');

  useEffect(() => {
    const studentDetailsParam = searchParams.get('studentDetails');
    const attendanceRecordsParam = searchParams.get('attendanceRecords');

    if (studentDetailsParam) {
      try {
        const parsed = JSON.parse(studentDetailsParam);
        setStudentDetails(JSON.stringify(parsed, null, 2));
      } catch {
        setStudentDetails(studentDetailsParam);
      }
    }

    if (attendanceRecordsParam) {
      try {
        const parsed = JSON.parse(attendanceRecordsParam);
        setAttendanceRecords(JSON.stringify(parsed, null, 2));
      } catch {
        setAttendanceRecords(attendanceRecordsParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
      // Do not reset the form if it was successful, user might want to download
    } else if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);
  
  const handleDownload = () => {
    if (!state.csvData) return;

    const blob = new Blob([state.csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'attendance_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <ScrollArea className="h-[75vh]">
        <form ref={formRef} action={formAction} className="space-y-6 pr-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
            <Label htmlFor="studentDetails">Student Details (JSON)</Label>
            <Textarea
                id="studentDetails"
                name="studentDetails"
                rows={10}
                placeholder={studentDetailsJsonExample}
                required
                className="font-mono text-sm"
                value={studentDetails}
                onChange={(e) => setStudentDetails(e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="attendanceRecords">Attendance Records (JSON)</Label>
            <Textarea
                id="attendanceRecords"
                name="attendanceRecords"
                rows={10}
                placeholder={attendanceRecordsJsonExample}
                required
                className="font-mono text-sm"
                value={attendanceRecords}
                onChange={(e) => setAttendanceRecords(e.target.value)}
            />
            </div>
        </div>
        
        {state.status === 'error' && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>
                {state.message} Please check your JSON format and try again.
            </AlertDescription>
            </Alert>
        )}

        {state.csvData && state.status === 'success' && (
            <div className="space-y-4">
                <Label htmlFor="csvOutput">Generated CSV Output</Label>
                <Textarea
                    id="csvOutput"
                    readOnly
                    value={state.csvData}
                    rows={10}
                    className="font-mono text-sm bg-secondary"
                />
                <Button type="button" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
            </div>
        )}

        <div className="flex justify-end pt-4 pb-6">
            <SubmitButton />
        </div>
        </form>
    </ScrollArea>
  );
}
