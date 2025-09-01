
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

export function getAllClasses(): Class[] {
    return classes;
}

export function getClassById(id: string): Class | undefined {
    return classes.find(c => c.id === id);
}

export function createClass(name: string): Class {
    const newClass: Class = {
        id: `CLS${(classes.length + 1).toString().padStart(3, '0')}`,
        name: name,
        studentIds: [],
        joinCode: `${name.slice(0, 4).toUpperCase().replace(/\s/g, '')}-${Date.now().toString().slice(-4)}`
    };
    classes.push(newClass);
    return newClass;
}

export function deleteClass(id: string): void {
    classes = classes.filter(c => c.id !== id);
}

export function getStudentsByClass(classId: string): Student[] {
    const cls = getClassById(classId);
    if (!cls) return [];
    return studentData.filter(student => cls.studentIds.includes(student.id));
}

export function enrollStudentInClass(studentId: string, joinCode: string): { success: boolean; message: string; className?: string } {
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
