
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusCircle, Users, Copy, Trash2, Eye } from "lucide-react";
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
import { studentData } from "@/lib/constants";
import { StudentsTable } from "@/components/feature/students-table";

// Mock class structure
interface Class {
  id: string;
  name: string;
  studentIds: string[];
  joinCode: string;
}

// Mock data for classes - in a real app, this would come from a database
const initialClasses: Class[] = [
    { id: 'CLS001', name: 'Software Engineering Q', studentIds: ['STU001', 'STU002', 'STU004'], joinCode: 'SWE-Q-2024' },
    { id: 'CLS002', name: 'Intro to AI', studentIds: ['STU001', 'STU003', 'STU005', 'STU006', 'STU007'], joinCode: 'AI-INTRO-2024' },
];

export default function ClassesPage() {
    const [classes, setClasses] = useState(initialClasses);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isRosterDialogOpen, setIsRosterDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [newClassName, setNewClassName] = useState('');
    const { toast } = useToast();

    const handleCreateClass = () => {
        if (!newClassName.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Class name cannot be empty.',
            });
            return;
        }

        const newClass: Class = {
            id: `CLS${(classes.length + 1).toString().padStart(3, '0')}`,
            name: newClassName,
            studentIds: [],
            joinCode: `${newClassName.slice(0, 4).toUpperCase().replace(/\s/g, '')}-${Date.now().toString().slice(-4)}`
        };

        setClasses([...classes, newClass]);
        setNewClassName('');
        setIsCreateDialogOpen(false);
        toast({
            title: 'Success!',
            description: `Class "${newClassName}" created.`,
        });
    };

    const handleDeleteClass = (classId: string) => {
        setClasses(classes.filter(c => c.id !== classId));
        toast({
            title: 'Class Deleted',
            description: 'The class has been removed.',
        });
    };
    
    const viewRoster = (cls: Class) => {
        setSelectedClass(cls);
        setIsRosterDialogOpen(true);
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: 'Join code copied to clipboard.',
        });
    }

    const getRosterData = () => {
        if (!selectedClass) return [];
        return studentData.filter(student => selectedClass.studentIds.includes(student.id));
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
                                <span>{cls.studentIds.length} students enrolled</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                             <Button variant="outline" className="w-full" onClick={() => viewRoster(cls)}>
                                <Eye className="mr-2 h-4 w-4"/>
                                View Roster
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Class Roster: {selectedClass?.name}</DialogTitle>
                        <DialogDescription>
                            Here are the students currently enrolled in this class.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <StudentsTable data={getRosterData()} />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsRosterDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

    