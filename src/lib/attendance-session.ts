
interface Location {
    latitude: number;
    longitude: number;
}
  
interface AttendanceSession {
    location: Location;
    radius: number; // in meters
    startTime: number; // Unix timestamp
    timeLimit: number; // in minutes
    active: boolean;
}
  
export let activeSession: AttendanceSession | null = null;

export function startSession(location: Location, radius: number, timeLimit: number) {
    activeSession = {
        location,
        radius,
        startTime: Date.now(),
        timeLimit,
        active: true,
    };
    console.log('Session started:', activeSession);
}

export function endSession() {
    if (activeSession) {
        activeSession.active = false;
        console.log('Session ended.');
    }
}
