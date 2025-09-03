
import { createRepNotification } from "./notifications";
import { getStudentById } from "./constants";
import { getSessionById } from "./attendance-session";

export interface Message {
    id: string;
    sessionId: string | null; // Can be null for direct messages
    senderId: string;
    receiverId: string; // Is a userId or a topic like `session-${sessionId}`
    content: string;
    timestamp: number;
}

// In-memory store for messages
let messages: Message[] = [];

export async function sendMessage(senderId: string, receiverIdOrTopic: string, sessionId: string | null, content: string) {
    const sender = await getStudentById(senderId);
    const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "A user";

    // Check if it's a broadcast message to a session
    if (sessionId && receiverIdOrTopic === `session-${sessionId}`) {
        const session = getSessionById(sessionId);
        if (!session) {
            console.error(`Session not found for broadcast: ${sessionId}`);
            return;
        }

        const checkedInStudents = session.students.filter(s => s.signedInAt !== null && s.studentId !== senderId);
        
        // Create one message for the sender (the rep) to store in history
        const broadcastMessageForRep: Message = {
            id: `msg-${Date.now()}-${Math.random()}`,
            sessionId,
            senderId,
            receiverId: receiverIdOrTopic, // The topic is the receiver
            content,
            timestamp: Date.now(),
        };
        messages.push(broadcastMessageForRep);
        
        // Notify each checked-in student
        checkedInStudents.forEach(student => {
            createRepNotification(student.studentId, `Broadcast from ${senderName} in "${session.topic}": "${content.substring(0, 30)}..."`);
        });

        console.log(`Broadcast message from ${senderId} to ${checkedInStudents.length} students in session ${sessionId}`);

    } else {
        // It's a direct message (either in a session context or outside)
        const newMessage: Message = {
            id: `msg-${Date.now()}-${Math.random()}`,
            sessionId,
            senderId,
            receiverId: receiverIdOrTopic,
            content,
            timestamp: Date.now(),
        };
        messages.push(newMessage);
    
        // Notify the receiver
        createRepNotification(receiverIdOrTopic, `New message from ${senderName}: "${content.substring(0, 30)}..."`);
        
        console.log(`Message sent from ${senderId} to ${receiverIdOrTopic}`);
        return newMessage;
    }
}


export async function getMessagesForSession(sessionId: string): Promise<Message[]> {
    const session = getSessionById(sessionId);
    if (!session) return [];

    const repId = session.repId;
    const broadcastTopic = `session-${sessionId}`;

    const sessionMessages = messages
        .filter(m => {
            // Include direct messages within the session
            if (m.sessionId === sessionId && m.receiverId !== broadcastTopic) {
                return true;
            }
            // Include broadcast messages sent by the rep
            if (m.sessionId === sessionId && m.senderId === repId && m.receiverId === broadcastTopic) {
                return true;
            }
            return false;
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    return sessionMessages;
}


export async function getDirectMessages(userId1: string, userId2: string): Promise<Message[]> {
    return messages
        .filter(m => 
            m.sessionId === null &&
            ((m.senderId === userId1 && m.receiverId === userId2) || 
             (m.senderId === userId2 && m.receiverId === userId1))
        )
        .sort((a, b) => a.timestamp - b.timestamp);
}
