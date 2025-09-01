
'use server';

import { generateAttendanceTable } from '@/ai/flows/attendance-table-generator';
import { z } from 'zod';
import { activeSession, startSession, allSessions, signInStudent, getSessionById, getSessionsByClass } from '@/lib/attendance-session';
import { studentData } from './constants';
import { createSessionNotifications, getStudentNotifications, markNotificationAsRead } from './notifications';
import { format } from 'date-fns';

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
    const timeSinceStart = (Date.now() - activeSession.startTime); // in ms
    if (timeSinceStart <= activeSession.timeLimit * 60 * 1000) {
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
  const classId = formData.get('classId') as string;
  const studentIdsRaw = formData.get('studentIds') as string;


  if (isNaN(radius) || isNaN(timeLimit) || isNaN(latitude) || isNaN(longitude) || !topic || !classId || !studentIdsRaw) {
    return { success: false, message: 'Invalid data provided.' };
  }
  
  let studentIds: string[];
  try {
    studentIds = JSON.parse(studentIdsRaw);
  } catch (error) {
    return { success: false, message: 'Invalid student ID format.' };
  }

  const session = startSession({ latitude, longitude }, radius, timeLimit, topic, studentIds, classId);

  // Create notifications for all students in the selected class
  createSessionNotifications(session.id, session.topic, studentIds);

  return { success: true, message: 'Geo-fencing session started!' };
}


export async function markStudentAttendance(sessionId: string, studentId: string) {
  const session = getSessionById(sessionId);
  if (!session) {
    return { success: false, message: 'Session not found.' };
  }
  if(!session.active){
    return { success: false, message: 'This session is no longer active.' };
  }
  const student = session.students.find(s => s.studentId === studentId);
  if(student?.signedInAt){
    return { success: false, message: 'You have already signed in for this session.' };
  }
  
  const success = signInStudent(sessionId, studentId);
  if (success) {
    return { success: true, message: 'Attendance marked successfully.' };
  }
  
  return { success: false, message: 'Failed to mark attendance.' };
}

export async function getNotifications(studentId: string) {
    return getStudentNotifications(studentId);
}

export async function markNotificationRead(notificationId: string) {
    markNotificationAsRead(notificationId);
    return { success: true };
}

// In a real app, this would probably be a database query
const getClassById = (id: string) => {
    return initialClasses.find(c => c.id === id);
}

// Mock data for classes - in a real app, this would come from a database
const initialClasses = [
    { id: 'CLS001', name: 'Software Engineering Q', studentIds: ['STU001', 'STU002', 'STU004'], joinCode: 'SWE-Q-2024' },
    { id: 'CLS002', name: 'Intro to AI', studentIds: ['STU001', 'STU003', 'STU005', 'STU006', 'STU007'], joinCode: 'AI-INTRO-2024' },
];

export async function exportAttendanceAction(classId: string): Promise<{ success: boolean, message: string, csvData?: string }> {
    const selectedClass = getClassById(classId);
    if (!selectedClass) {
        return { success: false, message: "Class not found." };
    }

    const classStudents = studentData.filter(s => selectedClass.studentIds.includes(s.id));
    const classSessions = getSessionsByClass(classId);
    
    // If there are no sessions, we can still export the student roster.
    if (classSessions.length === 0) {
        try {
            const result = await generateAttendanceTable({
                studentDetails: classStudents.map(s => ({id: s.id, name: s.name, major: ''})), // pass needed fields
                attendanceRecords: {}, // No records yet
            });
             return {
                success: true,
                message: 'No sessions found for this class. Exporting student roster.',
                csvData: result.csvData,
            };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'An unexpected error occurred while generating the roster.' };
        }
    }

    const attendanceRecords: Record<string, string[]> = {};
    for (const session of classSessions) {
        const date = format(new Date(session.startTime), "yyyy-MM-dd");
        attendanceRecords[date] = session.students
            .filter(s => s.signedInAt !== null)
            .map(s => s.studentId);
    }
    
    try {
        const result = await generateAttendanceTable({
            studentDetails: classStudents,
            attendanceRecords: attendanceRecords,
        });

        if (result.csvData) {
            return {
                success: true,
                message: 'CSV file generated successfully.',
                csvData: result.csvData,
            };
        } else {
            return { success: false, message: 'Failed to generate CSV data.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred while generating the report.' };
    }
}
