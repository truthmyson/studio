
interface Location {
    latitude: number;
    longitude: number;
}
  
export interface AttendanceSession {
    id: string;
    classId: string;
    location: Location;
    radius: number; // in meters
    startTime: number; // Unix timestamp
    timeLimit: number; // in minutes
    active: boolean;
    topic: string;
    students: { studentId: string; signedInAt: number | null }[];
}
  
export let activeSession: AttendanceSession | null = null;
export const allSessions: AttendanceSession[] = [];

export function startSession(location: Location, radius: number, timeLimit: number, topic: string, studentIds: string[], classId: string) {
    // Deactivate previous session if any, you might want to allow multiple active sessions in a real app
    if (activeSession) {
        // This is a simple implementation. A better one might check for sessions of the same class.
        // For now, we just deactivate any active session.
        // activeSession.active = false;
    }

    const newSession: AttendanceSession = {
        id: `session-${Date.now()}`,
        classId,
        location,
        radius,
        startTime: Date.now(),
        timeLimit,
        active: true,
        topic,
        students: studentIds.map(id => ({ studentId: id, signedInAt: null })),
    };
    
    // In this simple model, only one session can be "active" for sign-in at a time
    activeSession = newSession; 
    allSessions.unshift(newSession); // Add to the beginning of the list

    console.log('Session started:', activeSession);
    return newSession;
}

export function endSession() {
    if (activeSession) {
        activeSession.active = false;
        activeSession = null;
        console.log('Session ended.');
    }
}

export function getSessionById(sessionId: string) {
    return allSessions.find(s => s.id === sessionId);
}

export function signInStudent(sessionId: string, studentId: string): boolean {
    const session = getSessionById(sessionId);
    if (!session) {
        console.error(`Session with ID ${sessionId} not found.`);
        return false;
    }

    const studentIndex = session.students.findIndex(s => s.studentId === studentId);
    if (studentIndex === -1) {
        console.error(`Student with ID ${studentId} not found in session ${sessionId}.`);
        return false;
    }

    if (session.students[studentIndex].signedInAt !== null) {
        console.log(`Student ${studentId} has already signed in.`);
        return false; // Or handle as a success if re-signing is allowed
    }

    session.students[studentIndex].signedInAt = Date.now();
    console.log(`Student ${studentId} signed in successfully at ${session.students[studentIndex].signedInAt}`);
    return true;
}

    