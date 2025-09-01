
interface Location {
    latitude: number;
    longitude: number;
}
  
export interface AttendanceSession {
    id: string;
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

export function startSession(location: Location, radius: number, timeLimit: number, topic: string, studentIds: string[]) {
    // Deactivate previous session if any
    if (activeSession) {
        activeSession.active = false;
    }

    const newSession: AttendanceSession = {
        id: `session-${Date.now()}`,
        location,
        radius,
        startTime: Date.now(),
        timeLimit,
        active: true,
        topic,
        students: studentIds.map(id => ({ studentId: id, signedInAt: null })),
    };
    
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
