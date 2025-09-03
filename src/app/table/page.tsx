
'use client';

import { useState, useMemo, useEffect } from "react";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Download, AlertCircle, FileSpreadsheet, Trash2, Eye, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter as DialogFooterComponent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getClassesByRepAction, createTableReportAction, getSavedReportsAction, deleteReportAction, updateTableReportAction, type ClassWithStudentCount } from "@/lib/actions";
import { downloadFile } from "@/lib/client-utils";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { SavedReport } from "@/lib/report-management";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter as AlertDialogFooterComponent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const REP_ID = '24275016'; // Hardcoded for now

function ReportPreview({ report }: { report: SavedReport }) {
    const parsedPreview = useMemo(() => {
        if (!report?.data) return { header: [], rows: [] };
        const header = report.data[0];
        const rows = report.data.slice(1);
        return { header, rows };
    }, [report]);

    const handleDownload = () => {
        if (!report?.xlsxData) return;
        const filename = `attendance_report_${report.name.replace(/\s+/g, '_')}.xlsx`;
        downloadFile(filename, report.xlsxData, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold">Report Preview: {report.name}</h3>
                <Button type="button" onClick={handleDownload}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download Excel
                </Button>
            </div>
            <ScrollArea className="h-96 w-full rounded-md border">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            {parsedPreview.header.map((col, index) => (
                                <TableHead key={index}>{String(col)}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parsedPreview.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex}>{String(cell)}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}


export default function TablePage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [classes, setClasses] = useState<ClassWithStudentCount[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [reportName, setReportName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);

    const fetchSavedReports = async () => {
        const reports = await getSavedReportsAction();
        setSavedReports(reports);
    };

    useEffect(() => {
        fetchSavedReports();
    }, []);

    const handleOpenDialog = async () => {
        setIsLoading(true);
        setError(null);
        setReportName('');
        setSelectedClassId('');
        try {
            const repClasses = await getClassesByRepAction(REP_ID);
            setClasses(repClasses);
        } catch (e) {
            setError("Failed to load classes.");
        } finally {
            setIsLoading(false);
        }
        setIsCreateDialogOpen(true);
    };

    const handleCreateTable = async () => {
        if (!selectedClassId || !reportName.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a class and enter a report name.' });
            return;
        }

        setIsLoading(true);
        setError(null);

        const result = await createTableReportAction(selectedClassId, reportName);

        if (result.success && result.report) {
            toast({ title: 'Success!', description: result.message });
            await fetchSavedReports(); // Refresh the list
            setSelectedReport(result.report); // Show the new report immediately
        } else {
            setError(result.message || 'An unexpected error occurred.');
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        
        setIsLoading(false);
        setIsCreateDialogOpen(false);
    };

    const handleUpdateReport = async (reportId: string) => {
        setIsUpdating(reportId);
        const result = await updateTableReportAction(reportId);
        if (result.success && result.report) {
            toast({ title: 'Report Updated', description: result.message });
            await fetchSavedReports();
            // If the updated report is being viewed, refresh its data
            if (selectedReport?.id === reportId) {
                setSelectedReport(result.report);
            }
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsUpdating(null);
    };

    const handleDeleteReport = async (reportId: string) => {
        const result = await deleteReportAction(reportId);
        if (result.success) {
            toast({ title: 'Report Deleted', description: result.message });
            fetchSavedReports();
            if (selectedReport?.id === reportId) {
                setSelectedReport(null);
            }
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <PageHeader>
                <div>
                    <PageHeaderHeading>Attendance Reports</PageHeaderHeading>
                    <PageHeaderDescription>
                        Create, view, and manage attendance reports for your classes.
                    </PageHeaderDescription>
                </div>
                <Button onClick={handleOpenDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Report
                </Button>
            </PageHeader>
            
            <TooltipProvider>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {savedReports.map(report => (
                        <Card key={report.id}>
                            <CardHeader>
                                <CardTitle>{report.name}</CardTitle>
                                <CardDescription>
                                    Created on {format(new Date(report.createdAt), 'PPP')} for class {report.className}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    This report contains {report.data.length - 1} student records.
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => handleUpdateReport(report.id)} disabled={isUpdating === report.id}>
                                            {isUpdating === report.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Update Report</p>
                                    </TooltipContent>
                                </Tooltip>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the report "{report.name}". This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooterComponent>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteReport(report.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooterComponent>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button variant="outline" onClick={() => setSelectedReport(report)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </TooltipProvider>

            {savedReports.length === 0 && (
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center h-80">
                    <h3 className="text-xl font-semibold tracking-tight">No reports created yet</h3>
                    <p className="text-muted-foreground mt-2">
                        Click "Create New Report" to generate an attendance report.
                    </p>
                </div>
            )}
            
            {selectedReport && (
                <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                    <DialogContent className="max-w-4xl h-[90vh]">
                       <ReportPreview report={selectedReport} />
                    </DialogContent>
                </Dialog>
            )}


            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Attendance Report</DialogTitle>
                        <DialogDescription>
                            Select a class and name your report. A complete attendance table will be generated and saved.
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
                         {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <DialogFooterComponent>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateTable} disabled={isLoading || !selectedClassId || !reportName.trim()}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Report
                        </Button>
                    </DialogFooterComponent>
                </DialogContent>
            </Dialog>
        </div>
    );
}
