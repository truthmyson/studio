
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
import { startGeofencingAction } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

interface GeofencingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GeofencingDialog({ isOpen, onClose }: GeofencingDialogProps) {
  const [radius, setRadius] = useState('100'); // Default radius in meters
  const [timeLimit, setTimeLimit] = useState('15'); // Default time limit in minutes
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartSession = async () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const formData = new FormData();
        formData.append('radius', radius);
        formData.append('timeLimit', timeLimit);
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());
        
        const result = await startGeofencingAction(formData);

        if (result.success) {
          toast({
            title: 'Success!',
            description: result.message,
          });
          onClose();
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.message,
          });
        }
        setIsLoading(false);
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not get location: ${error.message}`,
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Geo-fencing Session</DialogTitle>
          <DialogDescription>
            Set the radius and time limit for students to mark their attendance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="radius">Radius (in meters)</Label>
            <Input
              id="radius"
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="e.g., 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (in minutes)</Label>
            <Input
              id="timeLimit"
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="e.g., 15"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleStartSession} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
