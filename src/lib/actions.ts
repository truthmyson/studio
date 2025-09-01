
'use server';

import { generateAttendanceTable } from '@/ai/flows/attendance-table-generator';
import { z } from 'zod';
import { activeSession, startSession, allSessions, signInStudent, getSessionById } from '@/lib/attendance-session';
import { studentData } from './constants';

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
  // The active session is always the first one if it's currently active.
  if (activeSession && activeSession.active) {
    const timeSinceStart = (Date.now() - activeSession.startTime) / (1000 * 60); // in minutes
    if (timeSinceStart <= activeSession.timeLimit) {
      return activeSession;
    }
  }
  return null;
}

export async function getAllSessions() {
  return allSessions;
}


export async function startGeofencingAction(formData: FormData) {
  const radius = parseFloat(formData.get('radius') as string);
  const timeLimit = parseInt(formData.get('timeLimit') as string, 10);
  const latitude = parseFloat(formData.get('latitude') as string);
  const longitude = parseFloat(formData.get('longitude') as string);
  const topic = formData.get('topic') as string;

  if (isNaN(radius) || isNaN(timeLimit) || isNaN(latitude) || isNaN(longitude) || !topic) {
    return { success: false, message: 'Invalid data provided.' };
  }
  
  const studentIds = studentData.map(s => s.id);
  startSession({ latitude, longitude }, radius, timeLimit, topic, studentIds);
  return { success: true, message: 'Geo-fencing session started!' };
}


export async function markStudentAttendance(sessionId: string, studentId: string) {
  const session = getSessionById(sessionId);
  if (!session) {
    return { success: false, message: 'Session not found.' };
  }
  
  const success = signInStudent(sessionId, studentId);
  if (success) {
    return { success: true, message: 'Attendance marked successfully.' };
  }
  
  return { success: false, message: 'Failed to mark attendance.' };
}
