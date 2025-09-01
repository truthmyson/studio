'use server';

/**
 * @fileOverview Generates an attendance table in CSV format from student details and attendance records.
 *
 * - generateAttendanceTable - A function that handles the generation of the attendance table.
 * - AttendanceTableInput - The input type for the generateAttendanceTable function.
 * - AttendanceTableOutput - The return type for the generateAttendanceTable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {convertArrayToCsv} from '@/src/services/csv-converter';

const AttendanceTableInputSchema = z.object({
  studentDetails: z.array(
    z.record(z.string(), z.any())
  ).describe('An array of student objects, where each object contains student details (e.g., name, ID, major).'),
  attendanceRecords: z.record(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date in YYYY-MM-DD format'),
    z.array(z.string()).describe('An array of student IDs present on the given date.')
  ).describe('A map of attendance records, where the key is the date (YYYY-MM-DD) and the value is an array of student IDs present on that date.'),
});

export type AttendanceTableInput = z.infer<typeof AttendanceTableInputSchema>;

const AttendanceTableOutputSchema = z.object({
  csvData: z.string().describe('The attendance table in CSV format.'),
});

export type AttendanceTableOutput = z.infer<typeof AttendanceTableOutputSchema>;

export async function generateAttendanceTable(input: AttendanceTableInput): Promise<AttendanceTableOutput> {
  return attendanceTableGeneratorFlow(input);
}

const attendanceTableGeneratorFlow = ai.defineFlow(
  {
    name: 'attendanceTableGeneratorFlow',
    inputSchema: AttendanceTableInputSchema,
    outputSchema: AttendanceTableOutputSchema,
  },
  async input => {
    // Extract student details and attendance records from the input
    const {studentDetails, attendanceRecords} = input;

    // Extract all unique studentIds
    const allStudentIds = studentDetails.map(student => student.id);

    // Create the CSV header row
    const header = ['Student Details', ...Object.keys(attendanceRecords)];

    // Create the CSV data rows
    const dataRows = studentDetails.map(student => {
      const studentId = student.id;
      const attendanceValues = Object.keys(attendanceRecords).map(date => {
        return attendanceRecords[date].includes(studentId) ? 1 : 0;
      });

      // Combine student details and attendance values into a single row
      const studentDetailsString = JSON.stringify(student);

      return [studentDetailsString, ...attendanceValues];
    });

    // Combine header and data rows
    const csvDataArray = [header, ...dataRows];

    // Convert the array to CSV format
    const csvData = convertArrayToCsv(csvDataArray);

    return {csvData};
  }
);
