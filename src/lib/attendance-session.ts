
interface Location {
    latitude: number;
    longitude: number;
}
  
export interface AttendanceSession {
    id: string;
    classId: string;
    repId: string; // The ID of the user who created the session
    location: Location;
    radius: number; // in meters
    startTime: number; // Unix timestamp
    timeLimit: number; // in minutes
    active: boolean;
    topic: string;
    students: { studentId: string; signedInAt: number | null }[];
}
  
export let activeSession: AttendanceSession | null = null;
export let allSessions: AttendanceSession[] = [];

// Auto-delete sessions older than 14 days
function cleanupOldSessions() {
    const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    allSessions = allSessions.filter(session => session.startTime >= fourteenDaysAgo);
}

export function startSession(location: Location, radius: number, timeLimit: number, topic: string, studentIds: string[], classId: string, repId: string, includeRep = false) {
    // Deactivate any other active session before starting a new one
    if (activeSession) {
        const currentActive = allSessions.find(s => s.id === activeSession?.id);
        if (currentActive) {
            currentActive.active = false;
        }
    }

    const initialStudents = studentIds.map(id => ({ studentId: id, signedInAt: null }));
    
    // If rep wants to be included, add them to the list and sign them in immediately.
    if (includeRep) {
        // Check if rep is already in the student list to avoid duplicates
        if (!initialStudents.some(s => s.studentId === repId)) {
            initialStudents.push({ studentId: repId, signedInAt: Date.now() });
        } else {
             const repInList = initialStudents.find(s => s.studentId === repId);
             if (repInList) {
                repInList.signedInAt = Date.now();
             }
        }
    }

    const newSession: AttendanceSession = {
        id: `session-${Date.now()}`,
        classId,
        repId,
        location,
        radius,
        startTime: Date.now(),
        timeLimit,
        active: true,
        topic,
        students: initialStudents,
    };
    
    activeSession = newSession; 
    allSessions.unshift(newSession);

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
    cleanupOldSessions();
    return allSessions.find(s => s.id === sessionId);
}

export function getSessions() {
    cleanupOldSessions();
    return allSessions;
}

export function getSessionsByClass(classId: string) {
    cleanupOldSessions();
    return allSessions.filter(s => s.classId === classId);
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
        return false;
    }

    session.students[studentIndex].signedInAt = Date.now();
    console.log(`Student ${studentId} signed in successfully at ${session.students[studentIndex].signedInAt}`);
    return true;
}

export function toggleSessionStatus(sessionId: string, newStatus: boolean): { success: boolean; message: string, session?: AttendanceSession } {
    const session = allSessions.find(s => s.id === sessionId);
    if (!session) {
        return { success: false, message: 'Session not found.' };
    }

    // If activating a session, deactivate any other currently active session.
    if (newStatus === true) {
        allSessions.forEach(s => {
            if (s.active) {
                s.active = false;
            }
        });
        activeSession = session;
    } else {
        // If the session being deactivated is the active one, clear it.
        if (activeSession?.id === sessionId) {
            activeSession = null;
        }
    }
    
    session.active = newStatus;
    console.log(`Session ${sessionId} has been ${newStatus ? 'activated' : 'deactivated'}.`);
    return { success: true, message: `Session status updated.`, session: session };
}
