
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

export function signInStudent(sessionId: string, studentId: string) {
    const session = getSessionById(sessionId);
    if (session) {
        const student = session.students.find(s => s.studentId === studentId);
        if (student) {
            student.signedInAt = Date.now();
            return true;
        }
    }
    return false;
}
