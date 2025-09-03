
import { createRepNotification } from "./notifications";
import { getStudentById } from "./constants";

export interface Message {
    id: string;
    sessionId: string | null; // Can be null for direct messages
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: number;
}

// In-memory store for messages
let messages: Message[] = [];

export async function sendMessage(senderId: string, receiverId: string, sessionId: string | null, content: string) {
    const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
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
    
    console.log(`Message sent from ${senderId} to ${receiverId}`);
    return newMessage;
}

export async function getMessagesForSession(sessionId: string): Promise<Message[]> {
    return messages
        .filter(m => m.sessionId === sessionId)
        .sort((a, b) => a.timestamp - b.timestamp);
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
    

