
'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendMessageAction, getDirectMessagesAction } from '@/lib/actions';
import { Loader2, Send } from 'lucide-react';
import type { Student } from '@/lib/types';
import type { Message } from '@/lib/messaging';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface DirectMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  repId: string;
}

export function DirectMessageDialog({ isOpen, onClose, student, repId }: DirectMessageDialogProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        if (!student) return;
        const fetchedMessages = await getDirectMessagesAction(repId, student.id);
        setMessages(fetchedMessages);
        if (isLoading) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, repId, student.id]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);


    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Message cannot be empty.' });
            return;
        }

        setIsSending(true);
        // Direct messages are not tied to a session, so sessionId is null
        const result = await sendMessageAction(repId, student.id, null, message);

        if (result.success) {
            setMessage('');
            await fetchMessages(); // Re-fetch immediately
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.message || 'Failed to send message.',
            });
        }
        setIsSending(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Chat with {student.firstName} {student.lastName}</DialogTitle>
                    <DialogDescription>
                        Your conversation history with this student. New messages will appear automatically.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <ScrollArea className="h-72 w-full rounded-md border p-4" ref={scrollAreaRef}>
                        {isLoading ? (
                             <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                             </div>
                        ) : messages.length > 0 ? (
                            messages.map(msg => {
                                const isMe = msg.senderId === repId;
                                const user = isMe ? null : student; // The other person is the student
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
                                                {/* Rep's avatar could be customized further */}
                                                <AvatarFallback>You</AvatarFallback>
                                             </Avatar>
                                         )}
                                    </div>
                                )
                            })
                        ) : (
                             <div className="flex h-full items-center justify-center">
                                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                             </div>
                        )}
                    </ScrollArea>
                    <div className="space-y-2">
                        <Textarea
                            id="message-content"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`Type your message to ${student.firstName}...`}
                            rows={3}
                            disabled={isSending}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={onClose} disabled={isSending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSendMessage} disabled={isSending}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Send className="h-4 w-4 mr-2" />}
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
