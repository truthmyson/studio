
import type { Student } from './types';
import type { AttendanceSession } from './attendance-session';

export const studentData: Student[] = [
  { id: '24275016', firstName: 'Chris', middleName: '', lastName: 'Mensah', major: 'Computer Science', email: 'chris.mensah@university.edu', courseName: 'Computer Science', isRep: true },
  { id: 'STU002', firstName: 'Jane', middleName: '', lastName: 'Smith', major: 'Computer Science', email: 'jane.smith@university.edu', courseName: 'Computer Science' },
  { id: 'STU003', firstName: 'Peter', middleName: '', lastName: 'Jones', major: 'Software Engineering', email: 'peter.jones@university.edu', courseName: 'Software Engineering' },
  { id: 'STU004', firstName: 'Mary', middleName: '', lastName: 'Johnson', major: 'Computer Science', email: 'mary.johnson@university.edu', courseName: 'Computer Science' },
  { id: 'STU005', firstName: 'David', middleName: '', lastName: 'Williams', major: 'Information Technology', email: 'david.williams@university.edu', courseName: 'Information Technology' },
  { id: 'STU006', firstName: 'Emily', middleName: '', lastName: 'Brown', major: 'Computer Science', email: 'emily.brown@university.edu', courseName: 'Computer Science' },
  { id: 'STU007', firstName: 'Michael', middleName: '', lastName: 'Davis', major: 'Software Engineering', email: 'michael.davis@university.edu', courseName: 'Software Engineering' },
  { id: 'STU008', firstName: 'Sarah', middleName: '', lastName: 'Miller', major: 'Computer Science', email: 'sarah.miller@university.edu', courseName: 'Computer Science' },
  { id: 'STU009', firstName: 'Chris', middleName: '', lastName: 'Wilson', major: 'Information Technology', email: 'chris.wilson@university.edu', courseName: 'Information Technology' },
  { id: 'STU010', firstName: 'Jessica', middleName: '', lastName: 'Taylor', major: 'Computer Science', email: 'jessica.taylor@university.edu', courseName: 'Computer Science' },
];

export const sessionData: AttendanceSession[] = [
    {
        id: 'session-1715853600000', // A fixed past date
        classId: 'CLS001',
        repId: '24275016',
        location: null,
        radius: 100,
        startTime: new Date('2024-05-16T10:00:00Z').getTime(),
        timeLimit: 60,
        active: false,
        topic: 'Advanced Networking',
        venue: 'Online',
        students: [
            { studentId: '24275016', signedInAt: null },
            { studentId: 'STU002', signedInAt: new Date('2024-05-16T10:01:00Z').getTime() },
            { studentId: 'STU004', signedInAt: new Date('2024-05-16T10:02:30Z').getTime() },
        ],
    },
    {
        id: 'session-1715940000000', // A fixed past date
        classId: 'CLS002',
        repId: '24275016',
        location: null,
        radius: 100,
        startTime: new Date('2024-05-17T12:00:00Z').getTime(),
        timeLimit: 90,
        active: false,
        topic: 'Intro to AI - Ethics',
        venue: 'Auditorium B',
        students: [
            { studentId: '24275016', signedInAt: new Date('2024-05-17T12:00:15Z').getTime() },
            { studentId: 'STU003', signedInAt: new Date('2024-05-17T12:05:00Z').getTime() },
            { studentId: 'STU005', signedInAt: new Date('2024-05-17T12:01:00Z').getTime() },
            { studentId: 'STU006', signedInAt: new Date('2024-05-17T12:03:20Z').getTime() },
            { studentId: 'STU007', signedInAt: null },
        ],
    }
];

export async function getStudentById(id: string): Promise<Student | undefined> {
    return studentData.find(s => s.id === id);
}

export function addStudent(student: Student) {
    studentData.push(student);
}

export const studentDetailsJsonExample = JSON.stringify(
  [
    { id: 'STU001', "First Name": 'John', "Last Name": "Doe", "Course Name": 'Computer Science' },
    { id: 'STU002', "First Name": 'Jane', "Last Name": "Smith", "Course Name": 'Computer Science' },
    { id: 'STU003', "First Name": 'Peter', "Last Name": "Jones", "Course Name": 'Software Engineering' },
  ],
  null,
  2
);

export const attendanceRecordsJsonExample = JSON.stringify(
  {
    '2024-05-10': ['STU001', 'STU002'],
    '2024-05-12': ['STU001', 'STU002', 'STU003'],
    '2024-05-14': ['STU002', 'STU003'],
  },
  null,
  2
);
