
'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendMessageAction, getMessagesForSessionAction } from '@/lib/actions';
import { Loader2, Send } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { format, formatDistanceToNow } from 'date-fns';
import type { AttendanceSession } from '@/lib/attendance-session';
import type { Message } from '@/lib/messaging';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { studentData } from '@/lib/constants';

interface MessagingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: AttendanceSession;
  currentUserId: string;
}

export function MessagingDialog({ isOpen, onClose, session, currentUserId }: MessagingDialogProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const isRep = currentUserId === session.repId;

    const fetchMessages = async () => {
        if (!session) return;
        const fetchedMessages = await getMessagesForSessionAction(session.id);
        setMessages(fetchedMessages);
    };

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            // Poll for new messages
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, session.id]);

     useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        // If rep is sending, they reply to the last student who sent a message.
        // If student is sending, they send to the rep.
        const lastStudentMessage = [...messages].reverse().find(m => m.senderId !== session.repId);
        const receiverId = isRep ? (lastStudentMessage?.senderId || '') : session.repId;

        if (!receiverId && isRep) {
            toast({ variant: 'destructive', title: 'Cannot Reply', description: "No student has sent a message yet in this session." });
            setIsSending(false);
            return;
        }

        const result = await sendMessageAction(currentUserId, receiverId, session.id, newMessage);

        if (result.success) {
            setNewMessage('');
            await fetchMessages(); // Re-fetch immediately after sending
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.message || 'Failed to send message.',
            });
        }
        setIsSending(false);
    };

    const getUser = (userId: string) => studentData.find(s => s.id === userId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle>Session Chat: {session.topic}</DialogTitle>
            <DialogDescription>
                {isRep ? "Review messages from students for this session." : "Communicate with the session representative."}
            </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <ScrollArea className="h-72 w-full rounded-md border p-4" ref={scrollAreaRef}>
                     {messages.length > 0 ? (
                        messages.map(msg => {
                            const user = getUser(msg.senderId);
                            const isMe = msg.senderId === currentUserId;
                            return (
                                <div key={msg.id} className={cn("flex items-end gap-2 mb-4", isMe ? "justify-end" : "justify-start")}>
                                     {!isMe && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://picsum.photos/seed/${user?.email}/32/32`} />
                                            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                                        </Avatar>
                                     )}
                                    <div className={cn("max-w-xs rounded-lg p-3", isMe ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        <p className="text-sm">{msg.content}</p>
                                        <p className="text-xs text-right mt-1 opacity-70" title={format(new Date(msg.timestamp), "PPP p")}>
                                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {isMe && (
                                         <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://picsum.photos/seed/${user?.email}/32/32`} />
                                            <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                                        </Avatar>
                                     )}
                                </div>
                            )
                        })
                     ) : (
                         <div className="flex h-full items-center justify-center">
                            <p className="text-muted-foreground">No messages yet.</p>
                         </div>
                     )}
                </ScrollArea>
                <div className="flex items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isSending}
                    />
                    <Button onClick={handleSendMessage} disabled={isSending}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
