
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { PlusCircle, Users, Copy, Trash2, Eye, Download, Loader2, FileCheck, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import { StudentsTable } from "@/components/feature/students-table";
import { exportAttendanceAction, removeStudentFromClassAction } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { getAllClasses, createClass, deleteClass, getStudentsByClassId, type Class } from "@/lib/class-management";
import type { Student } from "@/lib/types";

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isRosterDialogOpen, setIsRosterDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [classStudents, setClassStudents] = useState<Student[]>([]);
    const [newClassName, setNewClassName] = useState('');
    const { toast } = useToast();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState<string[][]>([]);
    const [classForExport, setClassForExport] = useState<Class | null>(null);

    const refreshClasses = async () => {
        const updatedClasses = await getAllClasses();
        setClasses(updatedClasses);
    };

    useEffect(() => {
        refreshClasses();
    }, []);

    const handleCreateClass = async () => {
        if (!newClassName.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Class name cannot be empty.',
            });
            return;
        }

        await createClass(newClassName);
        await refreshClasses();

        setNewClassName('');
        setIsCreateDialogOpen(false);
        toast({
            title: 'Success!',
            description: `Class "${newClassName}" created.`,
        });
    };

    const handleDeleteClass = async (classId: string) => {
        await deleteClass(classId);
        await refreshClasses();
        toast({
            title: 'Class Deleted',
            description: 'The class has been removed.',
        });
    };
    
    const viewRoster = async (cls: Class) => {
        setSelectedClass(cls);
        const students = await getStudentsByClassId(cls.id);
        setClassStudents(students);
        setIsRosterDialogOpen(true);
    }

    const handleRemoveStudent = async (studentId: string) => {
        if (!selectedClass) return;
        const result = await removeStudentFromClassAction(selectedClass.id, studentId);
        if (result.success) {
            toast({ title: "Student Removed", description: result.message });
            // Refresh student list for the roster
            const updatedStudents = await getStudentsByClassId(selectedClass.id);
            setClassStudents(updatedStudents);
             // Also refresh the main classes list to update student count
            await refreshClasses();
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
    };

    const handleExportPreview = async (cls: Class) => {
        setIsExporting(cls.id);
        const result = await exportAttendanceAction(cls.id);
        if (result.success && result.csvData) {
            // Simple CSV string to array of arrays parser
            const parsedData = result.csvData.split('\n').map(row => row.split(','));
            setPreviewData(parsedData);
            setClassForExport(cls);
            setIsPreviewOpen(true);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsExporting(null);
    }

    const downloadFile = (blob: Blob, filename: string) => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const downloadCsv = () => {
        if (!previewData.length || !classForExport) return;
        const csvContent = previewData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadFile(blob, `${classForExport.name.replace(/ /g, '_')}_attendance.csv`);
        toast({ title: 'Success!', description: 'Attendance data exported as CSV.' });
        setIsPreviewOpen(false);
    }

    const downloadXlsx = async () => {
        if (!previewData.length || !classForExport) return;
        const XLSX = await import('xlsx');
        const worksheet = XLSX.utils.aoa_to_sheet(previewData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        downloadFile(blob, `${classForExport.name.replace(/ /g, '_')}_attendance.xlsx`);
        toast({ title: 'Success!', description: 'Attendance data exported as Excel.' });
        setIsPreviewOpen(false);
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: 'Join code copied to clipboard.',
        });
    }

    return (
        <div className="flex-1 space-y-4">
            <PageHeader>
                <div>
                    <PageHeaderHeading>My Classes</PageHeaderHeading>
                    <PageHeaderDescription>
                        Manage your classes, view student rosters, and generate join codes.
                    </PageHeaderDescription>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Class
                </Button>
            </PageHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                    <Card key={cls.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{cls.name}</CardTitle>
                            <CardDescription>
                                Join Code: 
                                <span className="font-mono bg-muted p-1 rounded-md ml-2">{cls.joinCode}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => copyToClipboard(cls.joinCode)}>
                                    <Copy className="h-4 w-4"/>
                                    <span className="sr-only">Copy join code</span>
                                </Button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{cls.students.length} students enrolled</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                             <Button variant="outline" className="w-full" onClick={() => viewRoster(cls)}>
                                <Eye className="mr-2 h-4 w-4"/>
                                View Roster
                            </Button>
                             <Button variant="secondary" className="w-full" onClick={() => handleExportPreview(cls)} disabled={isExporting === cls.id}>
                                {isExporting === cls.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileCheck className="mr-2 h-4 w-4" />}
                                Export
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete Class</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the class and all associated data.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteClass(cls.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Create Class Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Class</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new class to generate a unique join code for your students.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="className">Class Name</Label>
                            <Input
                                id="className"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                placeholder="e.g., Advanced Algorithms"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateClass}>Create Class</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Roster Dialog */}
            <Dialog open={isRosterDialogOpen} onOpenChange={setIsRosterDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Class Roster: {selectedClass?.name}</DialogTitle>
                        <DialogDescription>
                            Here are the students currently enrolled in this class. You can remove students if needed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <StudentsTable 
                            data={classStudents}
                            actions={[{
                                label: "Remove",
                                onClick: handleRemoveStudent,
                                variant: "destructive"
                            }]}
                         />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsRosterDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             {/* Export Preview Dialog */}
             <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Export Preview: {classForExport?.name}</DialogTitle>
                        <DialogDescription>
                           Preview of the attendance data. You can download it as a CSV or Excel file.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            readOnly
                            value={previewData.map(row => row.join('\t')).join('\n')}
                            rows={15}
                            className="font-mono text-sm bg-muted"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Cancel</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Download className="mr-2 h-4 w-4"/>
                                    Download
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={downloadCsv}>
                                    Download as CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={downloadXlsx}>
                                    Download as Excel
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
