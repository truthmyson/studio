
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Users,
  FileText,
  PlusCircle,
  MessageSquare,
  Power,
  PowerOff,
  Download,
  Trash2,
  BarChart,
} from 'lucide-react';
import {
  getAllSessions,
  toggleSessionStatusAction,
  exportAttendanceAction,
  getActiveSession,
  type AttendanceSession,
} from '@/lib/actions';
import { getStudentById } from '@/lib/constants';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { GeofencingDialog } from '@/components/feature/geofencing-dialog';
import { MessagingDialog } from '@/components/feature/messaging-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SessionStatsDialog } from '@/components/feature/session-stats-dialog';

interface StudentDetails {
  id: string;
  name: string;
  signedInAt: number | null;
}

const REP_ID = '24275016'; // Hardcoded for now

export default function RepDashboardPage() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [activeSessionDetails, setActiveSessionDetails] = useState<{
    session: AttendanceSession;
    students: StudentDetails[];
    progress: number;
    timeLeft: string;
  } | null>(null);

  const [isGeofencingDialogOpen, setIsGeofencingDialogOpen] = useState(false);
  const [isMessagingDialogOpen, setIsMessagingDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);

  const { toast } = useToast();

  const fetchDashboardData = async () => {
    // Fetch all sessions for historical view
    const allSessions = await getAllSessions();
    setSessions(allSessions);

    // Fetch details for the single active session
    const activeSession = await getActiveSession();
    if (activeSession) {
      const studentDetails = await Promise.all(
        activeSession.students.map(async (s) => {
          const student = await getStudentById(s.studentId);
          return {
            id: s.studentId,
            name: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
            signedInAt: s.signedInAt,
          };
        })
      );

      const signedInCount = studentDetails.filter((s) => s.signedInAt).length;
      const totalStudents = studentDetails.length;
      const progress = totalStudents > 0 ? (signedInCount / totalStudents) * 100 : 0;
      
      const endTime = activeSession.startTime + activeSession.timeLimit * 60 * 1000;
      const timeLeft = formatDistanceToNow(endTime, { includeSeconds: true, addSuffix: true });


      setActiveSessionDetails({
        session: activeSession,
        students: studentDetails,
        progress,
        timeLeft,
      });
    } else {
      setActiveSessionDetails(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 2000); // Poll for updates every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleToggleSession = async (sessionId: string, currentStatus: boolean) => {
    const result = await toggleSessionStatusAction(sessionId, !currentStatus);
    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      fetchDashboardData(); // Refresh data immediately
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  };
  
  const handleExport = async (classId: string, className: string) => {
    const result = await exportAttendanceAction(classId);
    if (result.success && result.csvData) {
        const blob = new Blob([result.csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_report_${className.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Success", description: "Report downloaded."});
    } else {
        toast({ variant: 'destructive', title: "Error", description: result.message });
    }
  };


  const sortedSessions = useMemo(() => {
    return sessions.sort((a, b) => b.startTime - a.startTime);
  }, [sessions]);

  const openStatsDialog = (session: AttendanceSession) => {
    setSelectedSession(session);
    setIsStatsDialogOpen(true);
  }

  const openMessagingDialog = (session: AttendanceSession) => {
    setSelectedSession(session);
    setIsMessagingDialogOpen(true);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Representative Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsGeofencingDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Start New Session
          </Button>
        </div>
      </div>

      {/* Active Session Card */}
      {activeSessionDetails && (
        <Card className="bg-primary/5 border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-primary">Live Session: {activeSessionDetails.session.topic}</CardTitle>
                <CardDescription>
                  Session ends {activeSessionDetails.timeLeft}.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openMessagingDialog(activeSessionDetails.session)}>
                    <MessageSquare className="h-4 w-4"/>
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <PowerOff className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will immediately end the session for all students. You can reactivate it later from the history.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleToggleSession(activeSessionDetails.session.id, true)}>
                            End Session
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Attendance Progress</h4>
                    <span className="text-sm font-bold text-primary">
                        {activeSessionDetails.students.filter(s => s.signedInAt).length} / {activeSessionDetails.students.length} Students
                    </span>
                </div>
                <Progress value={activeSessionDetails.progress} className="w-full" />
              </div>
              <div>
                 <h4 className="font-semibold mb-2">Signed-in Students</h4>
                 <ScrollArea className="h-40 w-full rounded-md border">
                    <div className="p-4">
                        {activeSessionDetails.students.filter(s => s.signedInAt).length > 0 ? (
                             activeSessionDetails.students
                            .filter((s) => s.signedInAt)
                            .map((student) => (
                                <div key={student.id} className="flex items-center justify-between text-sm mb-2">
                                <span>{student.name}</span>
                                <span className="text-muted-foreground">
                                    {format(new Date(student.signedInAt!), 'HH:mm:ss')}
                                </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center pt-4">No students have signed in yet.</p>
                        )}
                    </div>
                 </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>Review and manage past attendance sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
             {sortedSessions.length > 0 ? sortedSessions.map((session, index) => (
                <div key={session.id}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 space-y-2 md:space-y-0">
                        <div className="space-y-1">
                            <p className="font-semibold">{session.topic}</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(session.startTime), 'PPP p')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                             <Badge variant={session.active ? 'default' : 'secondary'}>
                                {session.active ? 'Live' : 'Ended'}
                            </Badge>
                             <Button variant="ghost" size="icon" onClick={() => handleToggleSession(session.id, session.active)}>
                                {session.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4"/>}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openStatsDialog(session)}>
                                <BarChart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleExport(session.classId, session.topic)}>
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openMessagingDialog(session)}>
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {index < sortedSessions.length - 1 && <Separator />}
                </div>
             )) : (
                <div className="text-center text-muted-foreground py-12">
                    <p>No sessions found.</p>
                    <p className="text-sm">Click "Start New Session" to begin.</p>
                </div>
             )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      <GeofencingDialog
        isOpen={isGeofencingDialogOpen}
        onClose={() => setIsGeofencingDialogOpen(false)}
        repId={REP_ID}
      />
      {selectedSession && (
        <>
            <MessagingDialog
                isOpen={isMessagingDialogOpen}
                onClose={() => {
                    setIsMessagingDialogOpen(false);
                    setSelectedSession(null);
                }}
                session={selectedSession}
                currentUserId={REP_ID}
            />
            <SessionStatsDialog
                isOpen={isStatsDialogOpen}
                onClose={() => {
                    setIsStatsDialogOpen(false);
                    setSelectedSession(null);
                }}
                session={selectedSession}
            />
        </>
      )}
    </div>
  );
}
