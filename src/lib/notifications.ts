
export interface Notification {
    id: string;
    studentId: string;
    message: string;
    createdAt: number;
    read: boolean;
    sessionId: string;
}

// In-memory store for notifications
let notifications: Notification[] = [];

/**
 * Creates notifications for all students in a session.
 */
export function createSessionNotifications(sessionId: string, topic: string, studentIds: string[]) {
    const newNotifications: Notification[] = studentIds.map(studentId => ({
        id: `notif-${Date.now()}-${studentId}`,
        studentId,
        message: `An attendance session for "${topic}" has started.`,
        createdAt: Date.now(),
        read: false,
        sessionId: sessionId,
    }));
    notifications.push(...newNotifications);
    console.log(`Created ${newNotifications.length} notifications for session ${sessionId}`);
}

/**
 * Retrieves all notifications for a specific student, sorted by most recent.
 */
export function getStudentNotifications(studentId: string): Notification[] {
    return notifications
        .filter(n => n.studentId === studentId)
        .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Marks a specific notification as read.
 */
export function markNotificationAsRead(notificationId: string) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
    }
}
