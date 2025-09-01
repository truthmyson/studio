
'use server';

import type { Student } from "./types";
import { studentData } from "./constants";

// Mock class structure
export interface Class {
  id: string;
  name: string;
  studentIds: string[];
  joinCode: string;
}

// In-memory store for classes
let classes: Class[] = [
    { id: 'CLS001', name: 'Software Engineering Q', studentIds: ['STU001', 'STU002', 'STU004'], joinCode: 'SWE-Q-2024' },
    { id: 'CLS002', name: 'Intro to AI', studentIds: ['STU001', 'STU003', 'STU005', 'STU006', 'STU007'], joinCode: 'AI-INTRO-2024' },
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
        studentIds: [],
        joinCode: `${name.slice(0, 4).toUpperCase().replace(/\s/g, '')}-${Date.now().toString().slice(-4)}`
    };
    classes.push(newClass);
    return newClass;
}

export async function deleteClass(id: string): Promise<void> {
    classes = classes.filter(c => c.id !== id);
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
    const cls = await getClassById(classId);
    if (!cls) return [];
    return studentData.filter(student => cls.studentIds.includes(student.id));
}

export async function enrollStudentInClass(studentId: string, joinCode: string): Promise<{ success: boolean; message: string; className?: string }> {
    const classToJoin = classes.find(c => c.joinCode === joinCode);
    if (!classToJoin) {
        return { success: false, message: "Invalid join code." };
    }

    if (classToJoin.studentIds.includes(studentId)) {
        return { success: false, message: "You are already enrolled in this class." };
    }

    classToJoin.studentIds.push(studentId);
    return { success: true, message: `Successfully joined class: ${classToJoin.name}`, className: classToJoin.name };
}

export async function getClassesByStudent(studentId: string): Promise<Class[]> {
    return classes.filter(c => c.studentIds.includes(studentId));
}

export async function studentLeaveClass(classId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    const classToLeave = await getClassById(classId);
    if (!classToLeave) {
        return { success: false, message: "Class not found." };
    }
    const studentIndex = classToLeave.studentIds.indexOf(studentId);
    if (studentIndex > -1) {
        classToLeave.studentIds.splice(studentIndex, 1);
        return { success: true, message: `You have left the class: ${classToLeave.name}` };
    }
    return { success: false, message: "You were not enrolled in this class." };
}

export async function removeStudentFromClass(classId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    const classToEdit = await getClassById(classId);
    if (!classToEdit) {
        return { success: false, message: "Class not found." };
    }
    const studentIndex = classToEdit.studentIds.indexOf(studentId);
    if (studentIndex > -1) {
        classToEdit.studentIds.splice(studentIndex, 1);
        const student = studentData.find(s => s.id === studentId);
        return { success: true, message: `Removed ${student?.name || 'student'} from the class.` };
    }
    return { success: false, message: "Student not found in this class." };
}
