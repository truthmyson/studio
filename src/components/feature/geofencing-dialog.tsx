
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
import { startGeofencingAction } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getAllClasses, type Class } from '@/lib/class-management';

interface GeofencingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  repId: string;
}

export function GeofencingDialog({ isOpen, onClose, repId }: GeofencingDialogProps) {
  const [radius, setRadius] = useState('100'); // Default radius in meters
  const [timeLimit, setTimeLimit] = useState('15'); // Default time limit in minutes
  const [topic, setTopic] = useState(''); // Lecture topic
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
        setClasses(getAllClasses());
    }
  }, [isOpen]);

  const handleStartSession = async () => {
    setIsLoading(true);
    if (!topic || !selectedClassId) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please enter a lecture topic and select a class.',
        });
        setIsLoading(false);
        return;
    }

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
        const selectedClass = classes.find(c => c.id === selectedClassId);
        if (!selectedClass) {
            toast({ variant: 'destructive', title: 'Error', description: 'Selected class not found.' });
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('radius', radius);
        formData.append('timeLimit', timeLimit);
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());
        formData.append('topic', topic);
        formData.append('classId', selectedClassId);
        formData.append('studentIds', JSON.stringify(selectedClass.studentIds));
        formData.append('repId', repId);
        
        const result = await startGeofencingAction(formData);

        if (result.success) {
          // No toast for success, the notification on the dashboard is enough
          setTopic('');
          setSelectedClassId('');
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
            Set the lecture topic, radius, and time limit for students to mark their attendance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Lecture Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Introduction to Algorithms"
            />
          </div>
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
