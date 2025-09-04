
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSavedReportsAction, addSessionToReportAction } from '@/lib/actions';
import type { AttendanceSession } from '@/lib/attendance-session';
import type { SavedReport } from '@/lib/report-management';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface AddSessionToReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: AttendanceSession;
}

export function AddSessionToReportDialog({ isOpen, onClose, session }: AddSessionToReportDialogProps) {
  const [columnName, setColumnName] = useState(`Session - ${format(new Date(session.startTime), 'PPP')}`);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchReports() {
        if (isOpen) {
            setIsLoading(true);
            const allReports = await getSavedReportsAction();
            // Filter reports to only those matching the session's classId
            const relevantReports = allReports.filter(report => report.classId === session.classId);
            setReports(relevantReports);
            setIsLoading(false);
        }
    }
    fetchReports();
  }, [isOpen, session.classId]);

  const handleAddToReport = async () => {
    if (!columnName.trim() || !selectedReportId) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please provide a column name and select a report.'
        });
        return;
    }
    
    setIsLoading(true);
    const result = await addSessionToReportAction(session.id, selectedReportId, columnName);
    
    if (result.success) {
        toast({
            title: 'Success!',
            description: result.message
        });
        onClose();
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.message
        });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
        // Reset state on close
        setColumnName(`Session - ${format(new Date(session.startTime), 'PPP')}`);
        setSelectedReportId('');
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Session to Report</DialogTitle>
          <DialogDescription>
            Add the attendance data from "{session.topic}" as a new column to an existing report.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">New Column Name</Label>
            <Input
              id="column-name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="e.g., Week 5 Attendance"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-select">Target Report</Label>
            <Select onValueChange={setSelectedReportId} value={selectedReportId} disabled={isLoading || reports.length === 0}>
                <SelectTrigger id="report-select">
                    <SelectValue placeholder="Select a report..." />
                </SelectTrigger>
                <SelectContent>
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <SelectItem key={report.id} value={report.id}>
                                {report.name}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-4 text-sm text-muted-foreground">No compatible reports found.</div>
                    )}
                </SelectContent>
            </Select>
             {reports.length === 0 && !isLoading && (
                 <Alert variant="default" className="mt-2">
                     <AlertCircle className="h-4 w-4" />
                     <AlertTitle>No Reports Found</AlertTitle>
                     <AlertDescription>
                         There are no reports for class "{session.classId}". Please create one on the "Table" page first.
                     </AlertDescription>
                 </Alert>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button onClick={handleAddToReport} disabled={isLoading || !selectedReportId || !columnName}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add to Report
          </Button>
           <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    