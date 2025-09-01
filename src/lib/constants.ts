
import type { Student } from './types';

export const studentData: Student[] = [
  { id: 'STU001', firstName: 'John', lastName: 'Doe', major: 'Computer Science', email: 'john.doe@university.edu', courseName: 'Computer Science' },
  { id: 'STU002', firstName: 'Jane', lastName: 'Smith', major: 'Computer Science', email: 'jane.smith@university.edu', courseName: 'Computer Science' },
  { id: 'STU003', firstName: 'Peter', lastName: 'Jones', major: 'Software Engineering', email: 'peter.jones@university.edu', courseName: 'Software Engineering' },
  { id: 'STU004', firstName: 'Mary', lastName: 'Johnson', major: 'Computer Science', email: 'mary.johnson@university.edu', courseName: 'Computer Science' },
  { id: 'STU005', firstName: 'David', lastName: 'Williams', major: 'Information Technology', email: 'david.williams@university.edu', courseName: 'Information Technology' },
  { id: 'STU006', firstName: 'Emily', lastName: 'Brown', major: 'Computer Science', email: 'emily.brown@university.edu', courseName: 'Computer Science' },
  { id: 'STU007', firstName: 'Michael', lastName: 'Davis', major: 'Software Engineering', email: 'michael.davis@university.edu', courseName: 'Software Engineering' },
  { id: 'STU008', firstName: 'Sarah', lastName: 'Miller', major: 'Computer Science', email: 'sarah.miller@university.edu', courseName: 'Computer Science' },
  { id: 'STU009', firstName: 'Chris', lastName: 'Wilson', major: 'Information Technology', email: 'chris.wilson@university.edu', courseName: 'Information Technology' },
  { id: 'STU010', firstName: 'Jessica', lastName: 'Taylor', major: 'Computer Science', email: 'jessica.taylor@university.edu', courseName: 'Computer Science' },
];

export const recentAttendance = [
    {
        topic: 'Introduction to Algorithms',
        date: '2024-05-10',
        status: {
            'STU001': 'Present', 'STU002': 'Present', 'STU003': 'Absent', 'STU004': 'Present', 'STU005': 'Present', 'STU006': 'Present', 'STU007': 'Absent', 'STU008': 'Present', 'STU009': 'Present', 'STU010': 'Present'
        }
    },
    {
        topic: 'Data Structures',
        date: '2024-05-12',
        status: {
            'STU001': 'Present', 'STU002': 'Present', 'STU003': 'Present', 'STU004': 'Present', 'STU005': 'Absent', 'STU006': 'Present', 'STU007': 'Present', 'STU008': 'Present', 'STU009': 'Present', 'STU010': 'Absent'
        }
    },
    {
        topic: 'Machine Learning Basics',
        date: '2024-05-14',
        status: {
            'STU001': 'Present', 'STU002': 'Present', 'STU003': 'Present', 'STU004': 'Present', 'STU005': 'Present', 'STU006': 'Present', 'STU007': 'Present', 'STU008': 'Present', 'STU009': 'Present', 'STU010': 'Present'
        }
    },
    {
        topic: 'Advanced Networking',
        date: '2024-05-16',
        status: {
            'STU001': 'Absent', 'STU002': 'Present', 'STU003': 'Absent', 'STU004': 'Present', 'STU005': 'Present', 'STU006': 'Absent', 'STU007': 'Present', 'STU008': 'Present', 'STU009': 'Absent', 'STU010': 'Present'
        }
    },
    {
        topic: 'Cybersecurity Fundamentals',
        date: '2024-05-18',
        status: {
            'STU001': 'Present', 'STU002': 'Present', 'STU003': 'Present', 'STU004': 'Present', 'STU005': 'Present', 'STU006': 'Present', 'STU007': 'Present', 'STU008': 'Absent', 'STU009': 'Present', 'STU010': 'Present'
        }
    }
]

export const studentDetailsJsonExample = JSON.stringify(
  [
    { id: 'STU001', name: 'John Doe', major: 'Computer Science' },
    { id: 'STU002', name: 'Jane Smith', major: 'Computer Science' },
    { id: 'STU003', name: 'Peter Jones', major: 'Software Engineering' },
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
