
'use server';

import { generateAttendanceTable } from '@/ai/flows/attendance-table-generator';
import { z } from 'zod';
import { activeSession, startSession, getSessions, signInStudent, getSessionById, getSessionsByClass, toggleSessionStatus } from '@/lib/attendance-session';
import { getStudentById, studentData, addStudent } from './constants';
import { createSessionNotifications, getStudentNotifications, markNotificationAsRead, createRepNotification } from './notifications';
import { format } from 'date-fns';
import { getClassById, enrollStudentInClass, getClassesByStudent, studentLeaveClass, removeStudentFromClass, getStudentsByClassId, getAllClasses, Class } from './class-management';
import { Student } from './types';
import { sendMessage, getMessagesForSession, Message } from './messaging';

const studentDetailsSchema = z.array(
  z.object({
    id: z.string(),
    'First Name': z.string(),
    'Middle Name': z.string().optional(),
    'Last Name': z.string(),
    'Course Name': z.string(),
  })
);

const attendanceRecordsSchema = z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.array(z.string()));

export type FormState = {
  status: 'error' | 'success' | 'idle';
  message: string;
  csvData?: string;
};

export type StudentFormState = {
  status: 'error' | 'success' | 'idle';
  message: string;
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
  return getSessions();
}

export async function getAllStudentsAction(): Promise<Student[]> {
    return studentData;
}

export async function getAllClassesAction(): Promise<Class[]> {
    return getAllClasses();
}

export async function startGeofencingAction(formData: FormData) {
  const radius = parseFloat(formData.get('radius') as string);
  const timeLimit = parseInt(formData.get('timeLimit') as string, 10);
  const latitude = parseFloat(formData.get('latitude') as string);
  const longitude = parseFloat(formData.get('longitude') as string);
  const topic = formData.get('topic') as string;
  const classId = formData.get('classId') as string;
  const studentIdsRaw = formData.get('studentIds') as string;
  const repId = formData.get('repId') as string;
  const includeRep = formData.get('includeRep') === 'true';


  if (isNaN(radius) || isNaN(timeLimit) || isNaN(latitude) || isNaN(longitude) || !topic || !classId || !studentIdsRaw || !repId) {
    return { success: false, message: 'Invalid data provided.' };
  }
  
  let studentIds: string[];
  try {
    studentIds = JSON.parse(studentIdsRaw);
  } catch (error) {
    return { success: false, message: 'Invalid student ID format.' };
  }

  const session = startSession({ latitude, longitude }, radius, timeLimit, topic, studentIds, classId, repId, includeRep);

  // Create notifications for all students in the selected class
  createSessionNotifications(session.id, session.topic, studentIds);

  // Create a notification for the rep who started the session
  createRepNotification(repId, `Successfully started session for "${session.topic}".`);

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
    // Create a success notification for the student
    createRepNotification(studentId, `Attendance marked for "${session.topic}".`);
    return { success: true, message: 'Attendance marked successfully.' };
  }
  
  return { success: false, message: 'Failed to mark attendance.' };
}

export async function getNotifications(userId: string) {
    return getStudentNotifications(userId);
}

export async function markNotificationRead(notificationId: string) {
    markNotificationAsRead(notificationId);
    return { success: true };
}


export async function exportAttendanceAction(classId: string): Promise<{ success: boolean, message: string, csvData?: string }> {
    const selectedClass = await getClassById(classId);
    if (!selectedClass) {
        return { success: false, message: "Class not found." };
    }

    const classStudents = await getStudentsByClassId(classId);
    const classSessions = getSessionsByClass(classId);
    
    // Map student details for the AI flow
    const studentDetailsForFlow = classStudents.map(s => ({
        id: s.id,
        'First Name': s.firstName,
        'Middle Name': s.middleName || '',
        'Last Name': s.lastName,
        'Course Name': s.courseName,
    }));
    
    // If there are no sessions, we can still export the student roster.
    if (classSessions.length === 0) {
        try {
            const result = await generateAttendanceTable({
                studentDetails: studentDetailsForFlow,
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
            studentDetails: studentDetailsForFlow,
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

export async function joinClassAction(studentId: string, joinCode: string): Promise<{ success: boolean, message: string }> {
    const result = await enrollStudentInClass(studentId, joinCode);
    if (result.success && result.className) {
        createRepNotification(studentId, `You have successfully joined the class: ${result.className}`);
    }
    return { success: result.success, message: result.message };
}

export async function getStudentClassesAction(studentId: string): Promise<{ success: boolean, data: Class[] }> {
    const classes = await getClassesByStudent(studentId);
    return { success: true, data: classes };
}

export async function studentLeaveClassAction(classId: string, studentId: string) {
    return studentLeaveClass(classId, studentId);
}

export async function removeStudentFromClassAction(classId: string, studentId: string) {
    return removeStudentFromClass(classId, studentId);
}

export async function sendMessageAction(senderId: string, receiverId: string, sessionId: string, content: string): Promise<{ success: boolean, message?: string }> {
    if (!senderId || !receiverId || !sessionId || !content.trim()) {
        return { success: false, message: "Missing required fields." };
    }
    await sendMessage(senderId, receiverId, sessionId, content);
    return { success: true };
}

export async function getMessagesForSessionAction(sessionId: string): Promise<Message[]> {
    return getMessagesForSession(sessionId);
}

export async function toggleSessionStatusAction(sessionId: string, newStatus: boolean): Promise<{ success: boolean, message: string }> {
    const result = toggleSessionStatus(sessionId, newStatus);
    if (result.success && result.session && newStatus === true) {
        // If a session is reactivated, notify students
        createSessionNotifications(result.session.id, result.session.topic, result.session.students.map(s => s.studentId));
    }
    return { success: result.success, message: result.message };
}

const userSchema = z.object({
  studentId: z.string().min(1, "School ID is required."),
  firstName: z.string().min(1, "First Name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required."),
  email: z.string().email("Invalid email address."),
  contact: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  courseName: z.string().min(1, "Course/Department is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

async function handleUserRegistration(formData: FormData, isRep: boolean): Promise<StudentFormState> {
    const result = userSchema.safeParse({
        studentId: formData.get('studentId'),
        firstName: formData.get('firstName'),
        middleName: formData.get('middleName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        contact: formData.get('contact'),
        gender: formData.get('gender') || undefined,
        courseName: formData.get('courseName'),
        password: formData.get('password'),
      });
    
      if (!result.success) {
        // Return the first error message
        const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
        return { status: 'error', message: firstError || "Validation failed." };
      }
    
      const { studentId, firstName, middleName, lastName, email, courseName, contact, gender } = result.data;
      
      // Check if student ID or email already exists
      const existingStudentById = await getStudentById(studentId);
      const existingStudentByEmail = studentData.find(s => s.email.toLowerCase() === email.toLowerCase());
    
      if (existingStudentById) {
          return { status: 'error', message: 'A user with this School ID already exists.' };
      }
      if (existingStudentByEmail) {
          return { status: 'error', message: 'A user with this email address already exists.' };
      }
      
      const newUser: Student = {
        id: studentId,
        firstName,
        middleName,
        lastName,
        major: courseName,
        email,
        courseName,
        contact,
        gender: gender === 'male' ? 'Male' : 'Female',
        isRep,
      };
    
      addStudent(newUser);
    
      const userType = isRep ? 'Representative' : 'Student';
      return { status: 'success', message: `${userType} account created successfully!` };
}

export async function registerStudentAction(
  prevState: StudentFormState,
  formData: FormData
): Promise<StudentFormState> {
  return handleUserRegistration(formData, false);
}

export async function registerRepAction(
    prevState: StudentFormState,
    formData: FormData
  ): Promise<StudentFormState> {
    return handleUserRegistration(formData, true);
}
