
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendMessageAction } from '@/lib/actions';
import { Loader2, Send } from 'lucide-react';
import type { Student } from '@/lib/types';
import { Label } from '../ui/label';

interface DirectMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  repId: string;
}

export function DirectMessageDialog({ isOpen, onClose, student, repId }: DirectMessageDialogProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Message cannot be empty.' });
            return;
        }

        setIsSending(true);
        const result = await sendMessageAction(repId, student.id, null, message);

        if (result.success) {
            toast({ title: 'Success!', description: 'Your message has been sent.' });
            setMessage('');
            onClose();
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
                    <DialogTitle>Send Message to {student.firstName} {student.lastName}</DialogTitle>
                    <DialogDescription>
                        Compose your message below. The student will receive it as a notification.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="message-content">Message</Label>
                        <Textarea
                            id="message-content"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`Type your message to ${student.firstName}...`}
                            rows={5}
                            disabled={isSending}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSendMessage} disabled={isSending}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Send className="h-4 w-4 mr-2" />}
                        Send Message
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
