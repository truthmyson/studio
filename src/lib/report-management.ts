
'use server';

import type { AttendanceSession } from "./attendance-session";
import * as xlsx from 'xlsx';

export interface SavedReport {
    id: string;
    name: string;
    classId: string;
    className: string;
    createdAt: number;
    data: (string | number)[][]; // Array of arrays format for the table data
    xlsxData: string; // Base64 encoded XLSX data
}

// Sample report data to simulate persistence
const sampleReportData: (string | number)[][] = [
    ["Student ID", "First Name", "Middle Name", "Last Name", "Course Name", "2024-05-16"],
    ["24275016", "Chris", "", "Mensah", "Computer Science", "Absent"],
    ["STU002", "Jane", "", "Smith", "Computer Science", "Present"],
    ["STU004", "Mary", "", "Johnson", "Computer Science", "Present"]
];

// Function to generate sample XLSX data on the fly
function generateSampleXlsxData(): string {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(sampleReportData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    const xlsxBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return Buffer.from(xlsxBuffer).toString('base64');
}


// In-memory store for saved reports, now initialized with sample data
let savedReports: SavedReport[] = [
    {
        id: 'report-1716039400000-sample',
        name: 'Mid-Semester SWE Report',
        classId: 'CLS001',
        className: 'Software Engineering Q',
        createdAt: new Date('2024-05-18T12:00:00Z').getTime(),
        data: sampleReportData,
        xlsxData: generateSampleXlsxData(),
    }
];


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
    return [...savedReports].sort((a, b) => b.createdAt - a.createdAt); // Return a sorted copy
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

function generateNewXlsxData(dataArray: (string | number)[][]): string {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(dataArray);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    const xlsxBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return Buffer.from(xlsxBuffer).toString('base64');
}

export async function addColumnToReport(reportId: string, session: AttendanceSession, columnName: string): Promise<SavedReport> {
    const report = await getReportById(reportId);
    if (!report) {
        throw new Error("Report not found.");
    }

    const headerRow = report.data[0];
    if (headerRow.includes(columnName)) {
        throw new Error(`Column "${columnName}" already exists in the report.`);
    }

    // Add new column header
    headerRow.push(columnName);

    // Create a map of student attendance for the session for quick lookup
    const sessionAttendance = new Map<string, boolean>();
    session.students.forEach(s => {
        sessionAttendance.set(s.studentId, s.signedInAt !== null);
    });

    // Update each data row
    // Skip the header row by starting at index 1
    for (let i = 1; i < report.data.length; i++) {
        const studentRow = report.data[i];
        const studentId = studentRow[0] as string; // Assuming student ID is always the first column
        
        const wasPresent = sessionAttendance.get(studentId) || false;
        studentRow.push(wasPresent ? 'Present' : 'Absent');
    }
    
    // Regenerate the xlsx data
    report.xlsxData = generateNewXlsxData(report.data);
    report.createdAt = Date.now(); // Update the timestamp

    return report;
}

    