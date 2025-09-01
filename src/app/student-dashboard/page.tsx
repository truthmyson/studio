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
  import { ClipboardList, UserCheck } from 'lucide-react';
  import { recentAttendance } from '@/lib/constants';
  import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/page-header';
  
  export default function StudentDashboardPage() {
    const studentId = 'STU001'; // Mock student ID
  
    const myAttendance = recentAttendance.map(record => ({
      ...record,
      myStatus: record.status[studentId] || 'N/A',
    }));
  
    return (
      <div className="flex-1 space-y-4">
        <PageHeader>
            <div>
                <PageHeaderHeading>Student Dashboard</PageHeaderHeading>
                <PageHeaderDescription>Welcome, John Doe!</PageHeaderDescription>
            </div>
        </PageHeader>
        <div className="grid gap-4 md:grid-cols-2">
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
                    <Button>Sign In for Today's Lecture</Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Available 15 mins before lecture
                    </p>
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
  