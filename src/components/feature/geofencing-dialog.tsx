
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
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface GeofencingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  repId: string;
}

export function GeofencingDialog({ isOpen, onClose, repId }: GeofencingDialogProps) {
  const [sessionType, setSessionType] = useState<'physical' | 'online'>('physical');
  const [radius, setRadius] = useState('100'); // Default radius in meters
  const [timeLimit, setTimeLimit] = useState('15'); // Default time limit in minutes
  const [topic, setTopic] = useState(''); // Lecture topic
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [includeSelf, setIncludeSelf] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchClasses() {
        if (isOpen) {
            const allClasses = await getAllClasses();
            setClasses(allClasses);
        }
    }
    fetchClasses();
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

    const formData = new FormData();
    formData.append('sessionType', sessionType);
    formData.append('timeLimit', timeLimit);
    formData.append('topic', topic);
    formData.append('classId', selectedClassId);
    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (!selectedClass) {
        toast({ variant: 'destructive', title: 'Error', description: 'Selected class not found.' });
        setIsLoading(false);
        return;
    }
    formData.append('studentIds', JSON.stringify(selectedClass.students.map(s => s.studentId)));
    formData.append('repId', repId);
    formData.append('includeRep', includeSelf.toString());
    
    if (sessionType === 'physical') {
      formData.append('radius', radius);
      if (!navigator.geolocation) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Geolocation is not supported by your browser for face-to-face sessions.',
        });
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          formData.append('latitude', latitude.toString());
          formData.append('longitude', longitude.toString());
          
          await submitAction(formData);
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
    } else {
        // For online sessions, we don't need location
        await submitAction(formData);
    }
  };
  
  const submitAction = async (formData: FormData) => {
    const result = await startGeofencingAction(formData);

    if (result.success) {
      // No toast for success, the notification on the dashboard is enough
      setTopic('');
      setSelectedClassId('');
      setIncludeSelf(false);
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Session</DialogTitle>
          <DialogDescription>
            Configure and launch a new attendance session for your class.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select onValueChange={setSelectedClassId} value={selectedClassId} disabled={isLoading}>
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
            <Label htmlFor="topic">Lecture Topic / Title</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Introduction to Algorithms"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Session Type</Label>
            <RadioGroup
              value={sessionType}
              onValueChange={(value) => setSessionType(value as 'physical' | 'online')}
              className="flex gap-4"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physical" id="physical" />
                <Label htmlFor="physical">Face-to-Face</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online</Label>
              </div>
            </RadioGroup>
          </div>

          {sessionType === 'physical' && (
            <div className="space-y-2">
              <Label htmlFor="radius">Radius (in meters)</Label>
              <Input
                id="radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="e.g., 100"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (in minutes)</Label>
            <Input
              id="timeLimit"
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="e.g., 15"
              disabled={isLoading}
            />
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="include-self" checked={includeSelf} onCheckedChange={(checked) => setIncludeSelf(checked as boolean)} disabled={isLoading}/>
            <Label htmlFor="include-self" className="text-sm font-normal">
              Sign me in for this session
            </Label>
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
