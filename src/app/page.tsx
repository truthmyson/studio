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
  ClipboardList,
  UserCheck,
  Users,
} from 'lucide-react';
import { studentData, recentAttendance } from '@/lib/constants';
import Link from 'next/link';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';

export default function DashboardPage() {
  const totalStudents = studentData.length;
  const attendanceRate =
    recentAttendance.reduce((acc, record) => {
      const present = Object.values(record.status).filter(
        (s) => s === 'Present'
      ).length;
      return acc + present / totalStudents;
    }, 0) / recentAttendance.length;

  return (
    <div className="flex-1 space-y-4">
      <PageHeader>
        <PageHeaderHeading>Dashboard</PageHeaderHeading>
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
              Enrolled in Computer Science 101
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
              {(attendanceRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all lectures
            </p>
          </CardContent>
        </Card>
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
            <CardTitle className="text-sm font-medium">Mark Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button size="sm">
              <UserCheck className="mr-2 h-4 w-4" /> Start Geo-fencing
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              For today's lecture
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>
              Summary of the last 5 lectures.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/students">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lecture Date</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAttendance.map((record) => {
                const presentCount = Object.values(record.status).filter(
                  (s) => s === 'Present'
                ).length;
                const absentCount = totalStudents - presentCount;
                return (
                  <TableRow key={record.date}>
                    <TableCell>
                      <div className="font-medium">{record.topic}</div>
                      <div className="text-sm text-muted-foreground">
                        {record.date}
                      </div>
                    </TableCell>
                    <TableCell className="text-green-600">
                      {presentCount}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {absentCount}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Completed</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
