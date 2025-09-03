
'use client';

import { useState } from 'react';
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
import { updateSessionTimeAction, type AttendanceSession } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

interface EditTimeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: AttendanceSession;
  onTimeUpdated: () => void;
}

export function EditTimeDialog({ isOpen, onClose, session, onTimeUpdated }: EditTimeDialogProps) {
  const [newTime, setNewTime] = useState(session.timeLimit === Infinity ? '' : session.timeLimit.toString());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const currentElapsedTime = formatDistanceToNowStrict(new Date(session.startTime), { unit: 'minute' }).replace(' minutes', '').replace(' minute', '');

  const handleUpdateTime = async () => {
    const newTimeMinutes = parseInt(newTime, 10);
    if (isNaN(newTimeMinutes) || newTimeMinutes <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a valid positive number for minutes.',
      });
      return;
    }
    
    // Ensure new time is not less than elapsed time
    if (newTimeMinutes < parseInt(currentElapsedTime, 10)) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `The new duration cannot be less than the time already elapsed (~${currentElapsedTime} minutes).`,
        });
        return;
    }

    setIsLoading(true);
    const result = await updateSessionTimeAction(session.id, newTimeMinutes);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      onTimeUpdated();
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
        // Reset time to current session time limit on open
        setNewTime(session.timeLimit === Infinity ? '' : session.timeLimit.toString());
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Session Duration</DialogTitle>
          <DialogDescription>
            Adjust the total time limit for the session "{session.topic}". The time is calculated from the session start.
            <br />
            <span className="text-xs text-muted-foreground">
                Currently, about {currentElapsedTime} minutes have passed.
            </span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="space-y-4 py-4 pr-6">
            <div className="space-y-2">
              <Label htmlFor="timeLimit">New Total Duration (in minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g., 25"
                disabled={isLoading}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-start pt-4">
          <Button onClick={handleUpdateTime} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Time
          </Button>
           <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
