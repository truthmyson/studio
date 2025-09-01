
import { createRepNotification } from "./notifications";
import { getStudentById } from "./constants";

export interface Message {
    id: string;
    sessionId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: number;
}

// In-memory store for messages
let messages: Message[] = [];

export async function sendMessage(senderId: string, receiverId: string, sessionId: string, content: string) {
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sessionId,
        senderId,
        receiverId,
        content,
        timestamp: Date.now(),
    };
    messages.push(newMessage);

    // Notify the receiver
    const sender = await getStudentById(senderId);
    const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "A user";
    createRepNotification(receiverId, `New message from ${senderName}: "${content.substring(0, 30)}..."`);
    
    console.log(`Message sent from ${senderId} to ${receiverId} in session ${sessionId}`);
    return newMessage;
}

export async function getMessagesForSession(sessionId: string): Promise<Message[]> {
    return messages
        .filter(m => m.sessionId === sessionId)
        .sort((a, b) => a.timestamp - b.timestamp);
}
