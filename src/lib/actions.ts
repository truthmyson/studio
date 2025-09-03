
'use server';

import { generateAttendanceTable } from '@/ai/flows/attendance-table-generator';
import { z } from 'zod';
import { activeSession, startSession, getSessions, signInStudent, getSessionById, getSessionsByClass, toggleSessionStatus, updateSessionTimeLimit, AttendanceSession } from '@/lib/attendance-session';
import { getStudentById, studentData, addStudent } from './constants';
import { createSessionNotifications, getStudentNotifications, markNotificationAsRead, createRepNotification } from './notifications';
import { format } from 'date-fns';
import { getClassById, enrollStudentInClass, getClassesByStudent, studentLeaveClass, removeStudentFromClass, getStudentsByClassId, getAllClasses, Class, createClass, getClassesByRep, deleteClass } from './class-management';
import { Student } from './types';
import { sendMessage, getMessagesForSession, Message, getDirectMessages } from './messaging';
import * as xlsx from 'xlsx';
import { convertArrayToCsv } from '@/services/csv-converter';
import { SavedReport, createReport, getReports, deleteReportById, updateReport, getReportById } from './report-management';


export type { AttendanceSession };

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
  if (activeSession && activeSession.active) {
    // For sessions with no time limit, timeLimit will be Infinity
    if (activeSession.timeLimit === Infinity) {
        return activeSession;
    }
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
  const sessionType = formData.get('sessionType') as 'physical' | 'online';
  const radius = parseFloat(formData.get('radius') as string);
  const timeLimitRaw = formData.get('timeLimit') as string;
  const timeLimit = timeLimitRaw === 'Infinity' ? Infinity : parseFloat(timeLimitRaw);

  const latitude = parseFloat(formData.get('latitude') as string);
  const longitude = parseFloat(formData.get('longitude') as string);
  const topic = formData.get('topic') as string;
  const venue = formData.get('venue') as string | undefined;
  const classId = formData.get('classId') as string;
  const studentIdsRaw = formData.get('studentIds') as string;
  const repId = formData.get('repId') as string;
  const includeRep = formData.get('includeRep') === 'true';


  if (isNaN(timeLimit) || !topic || !classId || !studentIdsRaw || !repId || !sessionType) {
    return { success: false, message: 'Invalid data provided.' };
  }
  
  if (sessionType === 'physical' && (isNaN(radius) || isNaN(latitude) || isNaN(longitude))) {
    return { success: false, message: 'Invalid location data for face-to-face session.'}
  }

  let studentIds: string[];
  try {
    studentIds = JSON.parse(studentIdsRaw);
  } catch (error) {
    return { success: false, message: 'Invalid student ID format.' };
  }
  
  const location = sessionType === 'physical' ? { latitude, longitude } : null;

  const session = startSession(location, radius, timeLimit, topic, studentIds, classId, repId, venue, includeRep);

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

function generateReportData(classStudents: Student[], classSessions: AttendanceSession[]) {
    // Sort dates chronologically
    const sortedDates = classSessions
        .map(session => format(new Date(session.startTime), 'yyyy-MM-dd'))
        .filter((date, index, self) => self.indexOf(date) === index) // Unique dates
        .sort();

    // Create the CSV header row
    const header = ['Student ID', 'First Name', 'Middle Name', 'Last Name', 'Course Name', ...sortedDates];
    
    // Create map for quick lookup
    const sessionMap: Record<string, AttendanceSession> = {};
    classSessions.forEach(session => {
        sessionMap[format(new Date(session.startTime), 'yyyy-MM-dd')] = session;
    });

    // Create the data rows
    const dataRows = classStudents.map(student => {
        const studentId = student.id;
        const firstName = student.firstName || '';
        const middleName = student.middleName || '';
        const lastName = student.lastName || '';
        const courseName = student.courseName || '';
        
        const attendanceValues = sortedDates.map(date => {
            const session = sessionMap[date];
            if (session) {
                const studentAttendance = session.students.find(s => s.studentId === studentId);
                return studentAttendance && studentAttendance.signedInAt ? 'Present' : 'Absent';
            }
            return 'N/A'; // Should not happen if logic is correct
        });

        return [studentId, firstName, middleName, lastName, courseName, ...attendanceValues];
    });
    
    return [header, ...dataRows];
}


export async function createTableReportAction(classId: string, reportName: string): Promise<{ success: boolean; message: string; report?: SavedReport }> {
    const selectedClass = await getClassById(classId);
    if (!selectedClass) {
        return { success: false, message: "Class not found." };
    }

    const classStudents = await getStudentsByClassId(classId);
    const classSessions = getSessionsByClass(classId);
    
    if (classStudents.length === 0) {
        return { success: false, message: 'No students are enrolled in this class to generate a report for.' };
    }

    const dataArray = generateReportData(classStudents, classSessions);

    try {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet(dataArray);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        const xlsxBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const xlsxData = Buffer.from(xlsxBuffer).toString('base64');
        
        const message = classSessions.length > 0 
            ? 'Attendance report generated and saved successfully.' 
            : 'No session data found. Saved student roster.';

        const report = await createReport(reportName, classId, selectedClass.name, dataArray, xlsxData);

        return {
            success: true,
            message,
            report
        };
    } catch (error) {
        console.error("Error during file generation:", error);
        return { success: false, message: 'An unexpected error occurred while generating the report file.' };
    }
}


export async function updateTableReportAction(reportId: string): Promise<{ success: boolean; message: string; report?: SavedReport }> {
    const existingReport = await getReportById(reportId);
    if (!existingReport) {
        return { success: false, message: "Report not found." };
    }
    
    const { classId } = existingReport;

    const classStudents = await getStudentsByClassId(classId);
    const classSessions = getSessionsByClass(classId);

    if (classStudents.length === 0) {
        return { success: false, message: 'The associated class has no students.' };
    }
    
    const dataArray = generateReportData(classStudents, classSessions);

    try {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet(dataArray);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        const xlsxBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const xlsxData = Buffer.from(xlsxBuffer).toString('base64');
        
        const updatedReport = await updateReport(reportId, dataArray, xlsxData);

        return {
            success: true,
            message: 'Report updated successfully with the latest data.',
            report: updatedReport,
        };
    } catch (error) {
        console.error("Error during report update:", error);
        return { success: false, message: 'An unexpected error occurred while updating the report.' };
    }
}


export async function joinClassAction(studentId: string, joinCode: string): Promise<{ success: boolean, message: string, className?: string }> {
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

export async function sendMessageAction(senderId: string, receiverIdOrTopic: string, sessionId: string | null, content: string): Promise<{ success: boolean, message?: string }> {
    if (!senderId || !receiverIdOrTopic || !content.trim()) {
        return { success: false, message: "Missing required fields." };
    }
    await sendMessage(senderId, receiverIdOrTopic, sessionId, content);
    return { success: true };
}

export async function getMessagesForSessionAction(sessionId: string): Promise<Message[]> {
    return getMessagesForSession(sessionId);
}

export async function getDirectMessagesAction(userId1: string, userId2: string): Promise<Message[]> {
    return getDirectMessages(userId1, userId2);
}

export async function toggleSessionStatusAction(sessionId: string, newStatus: boolean): Promise<{ success: boolean, message: string, session?: AttendanceSession }> {
    const result = toggleSessionStatus(sessionId, newStatus);
    if (result.success && result.session && newStatus === true) {
        // If a session is reactivated, notify students
        createSessionNotifications(result.session.id, result.session.topic, result.session.students.map(s => s.studentId));
    }
    return { success: result.success, message: `Session status updated.`, session: result.session };
}

const userSchema = z.object({
  studentId: z.string().min(1, "School ID is required."),
  firstName: z.string().min(1, "First Name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required."),
  email: z.string().email("Invalid email address."),
  contact: z.string().min(1, "Contact number is required."),
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
      
      // Check for uniqueness
      const existingStudentById = await getStudentById(studentId);
      if (existingStudentById) {
          return { status: 'error', message: 'A user with this School ID already exists.' };
      }
      
      const existingStudentByEmail = studentData.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (existingStudentByEmail) {
          return { status: 'error', message: 'A user with this email address already exists.' };
      }

      const existingStudentByContact = studentData.find(s => s.contact === contact);
      if (existingStudentByContact) {
        return { status: 'error', message: 'A user with this contact number already exists.' };
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


// Action to create a class
const createClassSchema = z.object({
    name: z.string().min(1, "Class name is required."),
    description: z.string().optional(),
    repId: z.string(),
});

export async function createClassAction(formData: FormData): Promise<{ success: boolean; message: string; }> {
    const result = createClassSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        repId: formData.get('repId'),
    });

    if (!result.success) {
        const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
        return { success: false, message: firstError || 'Validation failed.' };
    }

    try {
        const newClass = await createClass(result.data.name, result.data.repId, result.data.description);
        createRepNotification(result.data.repId, `Class "${newClass.name}" created successfully.`);
        return { success: true, message: 'Class created successfully.' };
    } catch (error) {
        return { success: false, message: 'An error occurred while creating the class.' };
    }
}

export type ClassWithStudentCount = Class & { studentCount: number };

export async function getClassesByRepAction(repId: string): Promise<ClassWithStudentCount[]> {
    const repClasses = await getClassesByRep(repId);
    return repClasses.map(cls => ({
        ...cls,
        studentCount: cls.students.length,
    }));
}

export async function getStudentsForClassAction(classId: string): Promise<Student[]> {
    return getStudentsByClassId(classId);
}

export async function deleteClassAction(classId: string): Promise<{ success: boolean; message: string }> {
    try {
        await deleteClass(classId);
        return { success: true, message: 'Class deleted successfully.' };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: 'An unknown error occurred while deleting the class.' };
    }
}

export async function updateSessionTimeAction(sessionId: string, newTimeLimit: number): Promise<{ success: boolean, message: string }> {
    const result = await updateSessionTimeLimit(sessionId, newTimeLimit);
    return result;
}

export async function getSavedReportsAction(): Promise<SavedReport[]> {
    return getReports();
}

export async function deleteReportAction(reportId: string): Promise<{ success: boolean, message: string }> {
    try {
        await deleteReportById(reportId);
        return { success: true, message: 'Report deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete report.' };
    }
}
