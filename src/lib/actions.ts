
'use server';

import { generateAttendanceTable } from '@/ai/flows/attendance-table-generator';
import { z } from 'zod';
import { activeSession, startSession } from '@/lib/attendance-session';

const studentDetailsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    major: z.string(),
  })
);

const attendanceRecordsSchema = z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.array(z.string()));

export type FormState = {
  status: 'error' | 'success' | 'idle';
  message: string;
  csvData?: string;
};

export async function generateAttendanceAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const studentDetailsRaw = formData.get('studentDetails') as string;
  const attendanceRecordsRaw = formData.get('attendanceRecords') as string;

  if (!studentDetailsRaw || !attendanceRecordsRaw) {
    return { status: 'error', message: 'Both fields are required.' };
  }

  let studentDetails;
  let attendanceRecords;

  try {
    const parsedStudentDetails = JSON.parse(studentDetailsRaw);
    const validationResultStudents = studentDetailsSchema.safeParse(parsedStudentDetails);
    if (!validationResultStudents.success) {
      return {
        status: 'error',
        message: `Invalid student details format: ${JSON.stringify(validationResultStudents.error.flatten().fieldErrors)}`,
      };
    }
    studentDetails = validationResultStudents.data;
  } catch (e) {
    return { status: 'error', message: 'Invalid JSON in Student Details.' };
  }

  try {
    const parsedAttendanceRecords = JSON.parse(attendanceRecordsRaw);
    const validationResultAttendance = attendanceRecordsSchema.safeParse(parsedAttendanceRecords);
    if(!validationResultAttendance.success) {
        return {
            status: 'error',
            message: `Invalid attendance records format: ${JSON.stringify(validationResultAttendance.error.flatten().fieldErrors)}`,
          };
    }
    attendanceRecords = validationResultAttendance.data;
  } catch (e) {
    return { status: 'error', message: 'Invalid JSON in Attendance Records.' };
  }

  try {
    const result = await generateAttendanceTable({
      studentDetails,
      attendanceRecords,
    });

    if (result.csvData) {
      return {
        status: 'success',
        message: 'CSV file generated successfully.',
        csvData: result.csvData,
      };
    } else {
      return { status: 'error', message: 'Failed to generate CSV data.' };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'An unexpected error occurred.' };
  }
}


export async function getActiveSession() {
  return activeSession;
}

export async function startGeofencingAction(formData: FormData) {
  const radius = parseFloat(formData.get('radius') as string);
  const timeLimit = parseInt(formData.get('timeLimit') as string, 10);
  const latitude = parseFloat(formData.get('latitude') as string);
  const longitude = parseFloat(formData.get('longitude') as string);

  if (isNaN(radius) || isNaN(timeLimit) || isNaN(latitude) || isNaN(longitude)) {
    return { success: false, message: 'Invalid data provided.' };
  }
  
  startSession({ latitude, longitude }, radius, timeLimit);
  return { success: true, message: 'Geo-fencing session started!' };
}
