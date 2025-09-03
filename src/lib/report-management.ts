
'use server';

export interface SavedReport {
    id: string;
    name: string;
    classId: string;
    className: string;
    createdAt: number;
    data: (string | number)[][]; // Array of arrays format for the table data
    xlsxData: string; // Base64 encoded XLSX data
}

// In-memory store for saved reports
let savedReports: SavedReport[] = [];


export async function createReport(name: string, classId: string, className: string, data: (string | number)[][], xlsxData: string): Promise<SavedReport> {
    const newReport: SavedReport = {
        id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name,
        classId,
        className,
        createdAt: Date.now(),
        data,
        xlsxData,
    };
    savedReports.unshift(newReport); // Add to the beginning of the list
    return newReport;
}

export async function getReports(): Promise<SavedReport[]> {
    return [...savedReports]; // Return a copy
}

export async function getReportById(id: string): Promise<SavedReport | undefined> {
    return savedReports.find(r => r.id === id);
}

export async function updateReport(reportId: string, newData: (string | number)[][], newXlsxData: string): Promise<SavedReport> {
    const report = await getReportById(reportId);
    if (!report) {
        throw new Error("Report to update not found");
    }
    report.data = newData;
    report.xlsxData = newXlsxData;
    report.createdAt = Date.now(); // Update timestamp to reflect the update
    return report;
}


export async function deleteReportById(id: string): Promise<void> {
    const index = savedReports.findIndex(r => r.id === id);
    if (index > -1) {
        savedReports.splice(index, 1);
    } else {
        throw new Error("Report not found");
    }
}
