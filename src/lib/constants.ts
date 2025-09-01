import type { Student } from './types';

export const studentData: Student[] = [
  { id: 'STU001', name: 'John Doe', major: 'Computer Science' },
  { id: 'STU002', name: 'Jane Smith', major: 'Computer Science' },
  { id: 'STU003', name: 'Peter Jones', major: 'Software Engineering' },
  { id: 'STU004', name: 'Mary Johnson', major: 'Computer Science' },
  { id: 'STU005', name: 'David Williams', major: 'Information Technology' },
  { id: 'STU006', name: 'Emily Brown', major: 'Computer Science' },
  { id: 'STU007', name: 'Michael Davis', major: 'Software Engineering' },
  { id: 'STU008', name: 'Sarah Miller', major: 'Computer Science' },
  { id: 'STU009', name: 'Chris Wilson', major: 'Information Technology' },
  { id: 'STU010', name: 'Jessica Taylor', major: 'Computer Science' },
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
