
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusCircle, Users, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Mock data for classes - in a real app, this would come from a database
const initialClasses = [
    { id: 'CLS001', name: 'Software Engineering Q', studentCount: 45, joinCode: 'SWE-Q-2024' },
    { id: 'CLS002', name: 'Intro to AI', studentCount: 62, joinCode: 'AI-INTRO-2024' },
];

export default function ClassesPage() {
    const [classes, setClasses] = useState(initialClasses);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

        const newClass = {
            id: `CLS${(classes.length + 1).toString().padStart(3, '0')}`,
            name: newClassName,
            studentCount: 0,
            joinCode: `${newClassName.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`
        };

        setClasses([...classes, newClass]);
        setNewClassName('');
        setIsCreateDialogOpen(false);
        toast({
            title: 'Success!',
            description: `Class "${newClassName}" created.`,
        });
    };

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
                        Manage your classes and view student enrollment.
                    </PageHeaderDescription>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Class
                </Button>
            </PageHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                    <Card key={cls.id}>
                        <CardHeader>
                            <CardTitle>{cls.name}</CardTitle>
                            <CardDescription>Join Code: 
                                <span className="font-mono bg-muted p-1 rounded-md ml-2">{cls.joinCode}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => copyToClipboard(cls.joinCode)}>
                                    <Copy className="h-4 w-4"/>
                                </Button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{cls.studentCount} students enrolled</span>
                            </div>
                            <Button variant="outline" className="w-full mt-4">View Roster</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

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
        </div>
    );
}
