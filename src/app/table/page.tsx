
'use client';

import { useState, useMemo } from "react";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Download, AlertCircle, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getClassesByRepAction, exportAttendanceAction, type ClassWithStudentCount } from "@/lib/actions";
import { downloadFile } from "@/lib/client-utils";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const REP_ID = '24275016'; // Hardcoded for now

export default function TablePage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [classes, setClasses] = useState<ClassWithStudentCount[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [reportName, setReportName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState<{ xlsx: string; className: string; preview: string; } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleOpenDialog = async () => {
        setIsLoading(true);
        setError(null);
        setReportName('');
        setSelectedClassId('');
        const repClasses = await getClassesByRepAction(REP_ID);
        setClasses(repClasses);
        setIsLoading(false);
        setIsCreateDialogOpen(true);
    };

    const handleCreateTable = async () => {
        if (!selectedClassId) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select a class.',
            });
            return;
        }
        if (!reportName.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please enter a name for the report.',
            });
            return;
        }


        setIsLoading(true);
        setError(null);
        setGeneratedData(null);

        const result = await exportAttendanceAction(selectedClassId);

        if (result.success && result.csvData && result.xlsxData) {
            setGeneratedData({
                xlsx: result.xlsxData,
                className: reportName, // Use the custom report name
                preview: result.csvData, // Use CSV for the text preview
            });
            toast({
                title: 'Success!',
                description: result.message,
            });
        } else {
            setError(result.message || 'An unexpected error occurred.');
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.message,
            });
        }
        
        setIsLoading(false);
        setIsCreateDialogOpen(false);
    };

    const handleDownload = () => {
        if (!generatedData) return;

        const { xlsx, className } = generatedData;
        const filename = `attendance_report_${className.replace(/\s+/g, '_')}.xlsx`;

        downloadFile(filename, xlsx, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        toast({ title: "Success", description: `Report download started.`});
    };
    
    const parsedPreview = useMemo(() => {
        if (!generatedData?.preview) return { header: [], rows: [] };
        const lines = generatedData.preview.split('\n');
        const header = lines[0].split(',');
        const rows = lines.slice(1).map(line => line.split(','));
        return { header, rows };
    }, [generatedData]);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader>
                <div>
                    <PageHeaderHeading>Attendance Tables</PageHeaderHeading>
                    <PageHeaderDescription>
                        Create and export full attendance tables for any of your classes.
                    </PageHeaderDescription>
                </div>
                <Button onClick={handleOpenDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Table
                </Button>
            </PageHeader>
            <Card>
                <CardContent className="pt-6">
                    {generatedData ? (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h3 className="text-lg font-semibold">Report Preview: {generatedData.className}</h3>
                                <div className="flex gap-2">
                                     <Button type="button" onClick={handleDownload}>
                                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                                        Download Excel
                                    </Button>
                                </div>
                            </div>
                             <ScrollArea className="h-96 w-full rounded-md border">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background">
                                        <TableRow>
                                            {parsedPreview.header.map((col, index) => (
                                                <TableHead key={index}>{col}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parsedPreview.rows.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell key={cellIndex}>{cell}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <ScrollBar orientation="horizontal" />
                             </ScrollArea>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Generation Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center h-80">
                            <h3 className="text-xl font-semibold tracking-tight">No table generated yet</h3>
                            <p className="text-muted-foreground mt-2">
                                Click "Create New Table" to generate an attendance report for a class.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Attendance Table</DialogTitle>
                        <DialogDescription>
                            Select a class and name your report. A complete attendance table will be generated.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="report-name">Report Name</Label>
                            <Input
                                id="report-name"
                                value={reportName}
                                onChange={(e) => setReportName(e.target.value)}
                                placeholder="e.g., Mid-Semester Attendance"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="class-select">Primary Class Database</Label>
                            <Select onValueChange={setSelectedClassId} value={selectedClassId} disabled={isLoading}>
                                <SelectTrigger id="class-select">
                                    <SelectValue placeholder="Select a class..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.length > 0 ? (
                                        classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name} ({cls.studentCount} students)
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-muted-foreground">No classes found.</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateTable} disabled={isLoading || !selectedClassId || !reportName.trim()}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Table
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
