
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
import {
  Activity,
  ArrowUpRight,
  UserCheck,
  Users,
  Bell,
  Check,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
import { GeofencingDialog } from '@/components/feature/geofencing-dialog';
import { useEffect, useState, useCallback } from 'react';
import { getAllSessions, getNotifications, markNotificationRead, getAllStudentsAction } from '@/lib/actions';
import type { AttendanceSession } from '@/lib/attendance-session';
import { format, formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/lib/notifications';
import type { Student } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessagingDialog } from '@/components/feature/messaging-dialog';

export default function RepDashboardPage() {
  const repId = '24275016'; // Mock rep ID, now aligned with student data
  const [isGeofencingDialogOpen, setIsGeofencingDialogOpen] = useState(false);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isMessagingDialogOpen, setIsMessagingDialogOpen] = useState(false);
  const [selectedSessionForMessages, setSelectedSessionForMessages] = useState<AttendanceSession | null>(null);

  const fetchDashboardData = useCallback(async () => {
    const [allSessions, repNotifications, allStudents] = await Promise.all([
        getAllSessions(),
        getNotifications(repId),
        getAllStudentsAction()
    ]);
    setSessions(allSessions);
    setNotifications(repNotifications);
    setStudents(allStudents);
  }, [repId]);


  useEffect(() => {
    fetchDashboardData();
    
    // Periodically refresh data
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, isGeofencingDialogOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationRead(notificationId);
    fetchDashboardData(); // Refresh notifications
  };

  const handleOpenMessages = (session: AttendanceSession) => {
    setSelectedSessionForMessages(session);
    setIsMessagingDialogOpen(true);
  };

  const totalStudents = students.length;
  const overallAttendanceRate = sessions.length > 0 ? sessions.reduce((acc, session) => {
    const presentCount = session.students.filter(s => s.signedInAt).length;
    return acc + (presentCount / (session.students.length || 1));
  }, 0) / sessions.length : 0;

  return (
    <div className="flex-1 space-y-4">
      <PageHeader>
        <PageHeaderHeading>Rep Dashboard</PageHeaderHeading>
        <PageHeaderDescription>Manage classes, attendance, and students.</PageHeaderDescription>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled in your courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(overallAttendanceRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all lectures
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{sessions.length}</div>
             <p className="text-xs text-muted-foreground">
              Created to date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => setIsGeofencingDialogOpen(true)}>
              <UserCheck className="mr-2 h-4 w-4" /> Start Session
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Start a new geo-fenced session
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                Summary of all created attendance sessions.
                </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/classes">
                Manage Classes
                <ArrowUpRight className="h-4 w-4" />
                </Link>
            </Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Lecture</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sessions.map((session) => {
                    const presentCount = session.students.filter(
                    (s) => s.signedInAt
                    ).length;
                    const absentCount = session.students.length - presentCount;
                    const isSessionActive = session.active && (Date.now() - session.startTime) < session.timeLimit * 60 * 1000;

                    return (
                    <TableRow key={session.id}>
                        <TableCell>
                        <div className="font-medium">{session.topic}</div>
                        <div className="text-sm text-muted-foreground">
                            {format(new Date(session.startTime), "PPP p")}
                        </div>
                        </TableCell>
                        <TableCell className="text-green-600">
                        {presentCount}
                        </TableCell>
                        <TableCell className="text-red-600">
                        {absentCount}
                        </TableCell>
                        <TableCell>
                        <Badge variant={isSessionActive ? 'default' : 'outline'}>{isSessionActive ? "Active" : "Completed"}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleOpenMessages(session)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Messages
                          </Button>
                        </TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notifications
                </CardTitle>
                <CardDescription>Recent system events and alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
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
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
      <GeofencingDialog
        isOpen={isGeofencingDialogOpen}
        onClose={() => setIsGeofencingDialogOpen(false)}
        repId={repId}
      />
      {selectedSessionForMessages && (
        <MessagingDialog
            isOpen={isMessagingDialogOpen}
            onClose={() => setIsMessagingDialogOpen(false)}
            session={selectedSessionForMessages}
            currentUserId={repId}
         />
      )}
    </div>
  );
}
