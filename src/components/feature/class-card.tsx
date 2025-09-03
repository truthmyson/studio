
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Copy, Trash2, Download, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import type { ClassWithStudentCount } from '@/lib/actions';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface ClassCardProps {
  classData: ClassWithStudentCount;
}

export function ClassCard({ classData }: ClassCardProps) {
  const { toast } = useToast();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classData.joinCode);
    toast({
      title: 'Copied!',
      description: 'The join code has been copied to your clipboard.',
    });
  };

  const generateQrCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(classData.joinCode, {
        width: 512,
        margin: 2,
        errorCorrectionLevel: 'H',
      });
      setQrCodeDataUrl(dataUrl);
      return dataUrl;
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate QR code.',
      });
      return '';
    }
  };

  const handleDownloadQR = async () => {
    const dataUrl = qrCodeDataUrl || (await generateQrCode());
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qrcode_${classData.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Success',
      description: 'QR code download started.',
    });
  };

  return (
    <TooltipProvider>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{classData.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1">
            <Users className="h-4 w-4" />
            {classData.studentCount} student{classData.studentCount !== 1 ? 's' : ''} enrolled
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">
            {classData.description || 'No description provided.'}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-4">
            <div className='w-full'>
                <Label className="text-xs text-muted-foreground">Join Code</Label>
                 <div className="flex items-center w-full gap-2">
                    <Badge variant="outline" className="text-lg font-mono tracking-widest flex-grow text-center py-2">
                        {classData.joinCode}
                    </Badge>
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                                <Copy className="h-5 w-5" />
                                <span className="sr-only">Copy Join Code</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy Code</p>
                        </TooltipContent>
                    </Tooltip>
                 </div>
            </div>
            <div className="flex w-full justify-between items-center gap-2">
                <div className="flex gap-2">
                    <Dialog onOpenChange={(open) => { if (open) generateQrCode(); }}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview QR
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs">
                            <DialogHeader>
                                <DialogTitle>QR Code for {classData.name}</DialogTitle>
                            </DialogHeader>
                            {qrCodeDataUrl && (
                                <div className="flex justify-center p-4">
                                    <Image src={qrCodeDataUrl} alt={`QR Code for ${classData.name}`} width={256} height={256} />
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleDownloadQR}>
                        <Download className="mr-2 h-4 w-4" />
                        Download QR
                    </Button>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Delete Class</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete Class (Coming Soon)</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
