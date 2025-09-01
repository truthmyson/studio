
'use server';

import type { Student } from "./types";
import { studentData, getStudentById } from "./constants";
import { createRepNotification } from "./notifications";
import { format } from "date-fns";

// Mock class structure
export interface ClassStudent {
    studentId: string;
    joinedAt: string; // ISO 8601 date string
}

export interface Class {
  id: string;
  name: string;
  students: ClassStudent[];
  joinCode: string;
}

// In-memory store for classes
let classes: Class[] = [
    { id: 'CLS001', name: 'Software Engineering Q', students: [
        { studentId: '24275016', joinedAt: '2024-05-01T10:00:00Z' },
        { studentId: 'STU002', joinedAt: '2024-05-02T11:00:00Z' },
        { studentId: 'STU004', joinedAt: '2024-05-03T09:30:00Z' },
    ], joinCode: 'SWEQ2024' },
    { id: 'CLS002', name: 'Intro to AI', students: [
        { studentId: '24275016', joinedAt: '2024-05-01T10:00:00Z' },
        { studentId: 'STU003', joinedAt: '2024-05-04T14:00:00Z' },
        { studentId: 'STU005', joinedAt: '2024-05-05T16:00:00Z' },
        { studentId: 'STU006', joinedAt: '2024-05-06T11:20:00Z' },
        { studentId: 'STU007', joinedAt: '2024-05-07T13:00:00Z' },
    ], joinCode: 'AINT2024' },
    { id: 'CLS003', name: 'My Course', students: [{ studentId: '24275016', joinedAt: '2024-05-10T10:00:00Z' }], joinCode: 'MYCO5702' },
];

export async function getAllClasses(): Promise<Class[]> {
    return classes;
}

export async function getClassById(id: string): Promise<Class | undefined> {
    return classes.find(c => c.id === id);
}

export async function createClass(name: string): Promise<Class> {
    const newClass: Class = {
        id: `CLS${(classes.length + 1).toString().padStart(3, '0')}`,
        name: name,
        students: [],
        joinCode: `${name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`
    };
    classes.push(newClass);
    return newClass;
}

export async function deleteClass(id: string): Promise<void> {
    const classIndex = classes.findIndex(c => c.id === id);
    if (classIndex > -1) {
        const classToDelete = classes[classIndex];
        
        // Notify all students in the class that it's been deleted
        if (classToDelete.students && classToDelete.students.length > 0) {
            classToDelete.students.forEach(student => {
                createRepNotification(student.studentId, `The class "${classToDelete.name}" has been deleted by the representative.`);
            });
        }
        
        // Remove the class from the array
        classes.splice(classIndex, 1);
    }
}


export async function getStudentsByClassId(classId: string): Promise<Student[]> {
    const cls = await getClassById(classId);
    if (!cls) return [];
    const studentIds = cls.students.map(s => s.studentId);
    return studentData.filter(student => studentIds.includes(student.id));
}

export async function enrollStudentInClass(studentId: string, joinCode: string): Promise<{ success: boolean; message: string; className?: string }> {
    const classToJoin = classes.find(c => c.joinCode.trim().toUpperCase() === joinCode.trim().toUpperCase());
    if (!classToJoin) {
        return { success: false, message: "Invalid join code." };
    }

    if (classToJoin.students.some(s => s.studentId === studentId)) {
        return { success: false, message: "You are already enrolled in this class." };
    }

    classToJoin.students.push({ studentId, joinedAt: new Date().toISOString() });
    return { success: true, message: `Successfully joined class: ${classToJoin.name}`, className: classToJoin.name };
}

export async function getClassesByStudent(studentId: string): Promise<Class[]> {
    return classes.filter(c => c.students.some(s => s.studentId === studentId));
}

export async function studentLeaveClass(classId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    const classToLeave = await getClassById(classId);
    if (!classToLeave) {
        return { success: false, message: "Class not found." };
    }
    const studentIndex = classToLeave.students.findIndex(s => s.studentId === studentId);
    if (studentIndex > -1) {
        classToLeave.students.splice(studentIndex, 1);
        return { success: true, message: `You have left the class: ${classToLeave.name}` };
    }
    return { success: false, message: "You were not enrolled in this class." };
}

export async function removeStudentFromClass(classId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    const classToEdit = await getClassById(classId);
    if (!classToEdit) {
        return { success: false, message: "Class not found." };
    }
    const studentIndex = classToEdit.students.findIndex(s => s.studentId === studentId);
    if (studentIndex > -1) {
        classToEdit.students.splice(studentIndex, 1);
        const student = await getStudentById(studentId);
        const studentName = student ? `${student.firstName} ${student.lastName}` : 'student';
        return { success: true, message: `Removed ${studentName} from the class.` };
    }
    return { success: false, message: "Student not found in this class." };
}
