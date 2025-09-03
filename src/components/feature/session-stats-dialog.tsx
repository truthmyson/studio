
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AttendanceSession } from '@/lib/attendance-session';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMemo, useState, useEffect } from 'react';

interface SessionStatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: AttendanceSession;
}

const LATE_THRESHOLD_MINUTES = 5;

export function SessionStatsDialog({ isOpen, onClose, session }: SessionStatsDialogProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const statsData = useMemo(() => {
    if (!session) return { data: [], total: 0 };
    
    const lateThreshold = LATE_THRESHOLD_MINUTES * 60 * 1000; // in milliseconds
    const sessionStartTime = session.startTime;

    let onTime = 0;
    let late = 0;
    
    session.students.forEach(student => {
      if (student.signedInAt) {
        const timeDifference = student.signedInAt - sessionStartTime;
        if (timeDifference > lateThreshold) {
          late++;
        } else {
          onTime++;
        }
      }
    });

    const totalStudents = session.students.length;
    const absent = totalStudents - onTime - late;

    return {
        data: [
            { name: 'On Time', students: onTime, fill: 'hsl(var(--chart-2))' },
            { name: 'Late', students: late, fill: 'hsl(var(--chart-4))' },
            { name: 'Absent', students: absent, fill: 'hsl(var(--destructive))' },
        ],
        total: totalStudents
    };
  }, [session]);

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attendance Statistics</DialogTitle>
          <DialogDescription>
            Showing attendance breakdown for the session: "{session.topic}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Session Summary ({statsData.total} Students)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    {isClient && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statsData.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
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
