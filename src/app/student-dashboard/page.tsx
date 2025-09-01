
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { ClipboardList, Loader2, UserCheck, Bell, Check } from 'lucide-react';
  import { recentAttendance } from '@/lib/constants';
  import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
  import { useEffect, useState, useCallback } from 'react';
  import { useToast } from '@/hooks/use-toast';
  import { getActiveSession, markStudentAttendance, getNotifications, markNotificationRead } from '@/lib/actions';
  import type { Notification } from '@/lib/notifications';
  import { formatDistanceToNow } from 'date-fns';
  
  // Haversine formula to calculate distance between two lat/lon points
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return R * c; // in metres
  }
  
  export default function StudentDashboardPage() {
    const studentId = 'STU001'; // Mock student ID
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = useCallback(async () => {
        const notifs = await getNotifications(studentId);
        setNotifications(notifs);
    }, [studentId]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // Poll for new notifications
        return () => clearInterval(interval);
    }, [fetchNotifications]);
  
    const myAttendance = recentAttendance.map(record => ({
      ...record,
      myStatus: record.status[studentId] || 'N/A',
    }));

    const handleMarkAsRead = async (notificationId: string) => {
        await markNotificationRead(notificationId);
        fetchNotifications();
    };

    const handleSignIn = () => {
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
            const session = await getActiveSession();
            
            if (!session || !session.active) {
              toast({ variant: 'destructive', title: 'Not Available', description: 'No active attendance session found.' });
              setIsLoading(false);
              return;
            }

            const timeSinceStart = (Date.now() - session.startTime) / (1000 * 60); // in minutes
            if (timeSinceStart > session.timeLimit) {
                toast({ variant: 'destructive', title: 'Too Late', description: 'The attendance window has closed.' });
                setIsLoading(false);
                return;
            }

            const distance = getDistance(latitude, longitude, session.location.latitude, session.location.longitude);
            if (distance <= session.radius) {
                const result = await markStudentAttendance(session.id, studentId);
                if (result.success) {
                  toast({ title: 'Success!', description: 'Attendance marked successfully!' });
                } else {
                  toast({ variant: 'destructive', title: 'Error', description: result.message });
                }
            } else {
                toast({ variant: 'destructive', title: 'Out of Range', description: `You are ${distance.toFixed(0)} meters away. You must be within ${session.radius} meters.` });
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
      <div className="flex-1 space-y-4">
        <PageHeader>
            <div>
                <PageHeaderHeading>Student Dashboard</PageHeaderHeading>
                <PageHeaderDescription>Welcome, John Doe!</PageHeaderDescription>
            </div>
        </PageHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Upcoming Lecture
                    </CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Today 2:00PM</div>
                    <p className="text-xs text-muted-foreground">
                    Data Structures - Hall 4B
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sign Attendance</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSignIn} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <UserCheck className="mr-2 h-4 w-4" />
                        )}
                        Sign In for Today's Lecture
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Available when session is active
                    </p>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                        <div key={notif.id} className="flex items-start gap-4">
                            <div className="flex-1">
                                <p className={`text-sm ${notif.read ? 'text-muted-foreground' : 'font-semibold'}`}>
                                    {notif.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
                                </p>
                            </div>
                            {!notif.read && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMarkAsRead(notif.id)}>
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Mark as read</span>
                            </Button>
                            )}
                        </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No new notifications.</p>
                    )}
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>My Attendance History</CardTitle>
            <CardDescription>
              Your attendance for the last 5 lectures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lecture</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myAttendance.map((record) => (
                  <TableRow key={record.date}>
                    <TableCell className="font-medium">{record.topic}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <Badge variant={record.myStatus === 'Present' ? 'default' : 'destructive'}>
                        {record.myStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
