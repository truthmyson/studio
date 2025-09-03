
export interface Notification {
    id: string;
    userId: string;
    message: string;
    createdAt: number;
    read: boolean;
    sessionId?: string;
}

// In-memory store for notifications
let notifications: Notification[] = [];

/**
 * Creates notifications for all students in a session.
 */
export function createSessionNotifications(sessionId: string, topic: string, studentIds: string[]) {
    const newNotifications: Notification[] = studentIds.map(studentId => ({
        id: `notif-${Date.now()}-${studentId}`,
        userId: studentId,
        message: `An attendance session for "${topic}" has started.`,
        createdAt: Date.now(),
        read: false,
        sessionId: sessionId,
    }));
    notifications.push(...newNotifications);
    console.log(`Created ${newNotifications.length} notifications for session ${sessionId}`);
}

/**
 * Creates a notification for a specific user (rep or student).
 */
export function createRepNotification(userId: string, message: string) {
    const newNotification: Notification = {
        id: `notif-${Date.now()}-${userId}`,
        userId: userId,
        message: message,
        createdAt: Date.now(),
        read: false,
    };
    notifications.push(newNotification);
    console.log(`Created notification for user ${userId}: "${message}"`);
}


/**
 * Retrieves all notifications for a specific user, sorted by most recent.
 */
export function getStudentNotifications(userId: string): Notification[] {
    return notifications
        .filter(n => n.userId === userId)
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

    