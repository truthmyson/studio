
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
  import { ClipboardList, Loader2, UserCheck, Bell, Check, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';
  import { recentAttendance, studentData } from '@/lib/constants';
  import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
  import { useEffect, useState, useCallback } from 'react';
  import { useToast } from '@/hooks/use-toast';
  import { getActiveSession, markStudentAttendance, getNotifications, markNotificationRead, joinClassAction, getStudentClassesAction, studentLeaveClassAction } from '@/lib/actions';
  import type { Notification } from '@/lib/notifications';
  import { formatDistanceToNow } from 'date-fns';
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Class } from '@/lib/class-management';
import type { Student } from '@/lib/types';
  
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
    const studentId = '24275016'; // Mock student ID
    const [currentUser, setCurrentUser] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isJoinClassOpen, setIsJoinClassOpen] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [joinedClasses, setJoinedClasses] = useState<Class[]>([]);

    useEffect(() => {
        // In a real app, you'd fetch the current user. Here, we find them from mock data.
        const user = studentData.find(s => s.id === studentId);
        if(user) {
            setCurrentUser(user);
        }
    }, [studentId]);

    const fetchStudentData = useCallback(async () => {
        const [notifs, classes] = await Promise.all([
            getNotifications(studentId),
            getStudentClassesAction(studentId)
        ]);
        setNotifications(notifs);
        if (classes.success) {
            setJoinedClasses(classes.data);
        }
    }, [studentId]);

    useEffect(() => {
        fetchStudentData();
        const interval = setInterval(fetchStudentData, 5000); // Poll for new data
        return () => clearInterval(interval);
    }, [fetchStudentData]);
  
    const myAttendance = recentAttendance.map(record => ({
      ...record,
      myStatus: record.status[studentId] || 'N/A',
    }));

    const handleMarkAsRead = async (notificationId: string) => {
        await markNotificationRead(notificationId);
        fetchStudentData();
    };

    const handleJoinClass = async () => {
        if (!joinCode.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Join code cannot be empty.' });
            return;
        }
        setIsJoining(true);
        const result = await joinClassAction(studentId, joinCode);
        if (result.success) {
            // Success is handled by notification
            fetchStudentData(); // Re-fetch classes
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setJoinCode('');
        setIsJoinClassOpen(false);
        setIsJoining(false);
    }

    const handleLeaveClass = async (classId: string) => {
        const result = await studentLeaveClassAction(classId, studentId);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            fetchStudentData(); // Re-fetch classes
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
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

            // Check if student is in the class for the session
            const studentIsInClass = session.students.some(s => s.studentId === studentId);
            if (!studentIsInClass) {
                toast({ variant: 'destructive', title: 'Not Enrolled', description: `You are not enrolled in the class for the "${session.topic}" session.` });
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
                  // Success is now handled via notification
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
                <PageHeaderDescription>Welcome, {currentUser?.firstName || 'Student'}!</PageHeaderDescription>
            </div>
            <div className='flex gap-2'>
                <Button onClick={() => setIsJoinClassOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Join a Class
                </Button>
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
                    <div className="space-y-4 max-h-48 overflow-y-auto">
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
        <div className="grid gap-4 md:grid-cols-2">
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
            <Card>
                <CardHeader>
                    <CardTitle>My Joined Classes</CardTitle>
                    <CardDescription>
                    Manage your class enrollments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Join Code</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {joinedClasses.length > 0 ? (
                            joinedClasses.map((cls) => (
                                <TableRow key={cls.id}>
                                <TableCell className="font-medium">{cls.name}</TableCell>
                                <TableCell><Badge variant="secondary">{cls.joinCode}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm" onClick={() => handleLeaveClass(cls.id)}>
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        Leave
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">You haven't joined any classes yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <Dialog open={isJoinClassOpen} onOpenChange={setIsJoinClassOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join a New Class</DialogTitle>
                    <DialogDescription>
                        Enter the unique join code provided by your class representative.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="joinCode">Join Code</Label>
                        <Input
                            id="joinCode"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            placeholder="e.g., SWEQ1234"
                            autoCapitalize="characters"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsJoinClassOpen(false)} disabled={isJoining}>Cancel</Button>
                    <Button onClick={handleJoinClass} disabled={isJoining}>
                        {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Join Class
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    );
  }
