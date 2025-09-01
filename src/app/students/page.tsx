'use client';

import { useState, useRef, ChangeEvent } from 'react';
import * as xlsx from 'xlsx';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { StudentsTable } from "@/components/feature/students-table";
import { studentData } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Student } from '@/lib/types';

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>(studentData);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
          return;
        }
    
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            if (typeof data !== 'string') {
                if (file.name.endsWith('.xlsx')) {
                    const workbook = xlsx.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = xlsx.utils.sheet_to_json<Student>(worksheet);
                    setStudents(json);
                    toast({
                      title: 'Success!',
                      description: 'Excel file uploaded and data loaded.',
                    });
                } else {
                    throw new Error("Unsupported file type for ArrayBuffer read.");
                }
                return;
            }
    
            if (file.name.endsWith('.csv')) {
              const lines = data.split('\n');
              const headers = lines[0].split(',').map(h => h.trim());
              const newStudents: Student[] = [];
              for (let i = 1; i < lines.length; i++) {
                const currentline = lines[i].split(',');
                if (currentline.length === headers.length) {
                  const student: any = {};
                  headers.forEach((header, index) => {
                    student[header] = currentline[index].trim();
                  });
                  newStudents.push(student as Student);
                }
              }
              setStudents(newStudents);
              toast({
                title: 'Success!',
                description: 'CSV file uploaded and data loaded.',
              });
            } else if (file.name.endsWith('.xlsx')) {
                // This case should ideally be handled by reading as array buffer
                // but included as a fallback.
                const workbook = xlsx.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json<Student>(worksheet);
                setStudents(json);
                toast({
                  title: 'Success!',
                  description: 'Excel file uploaded and data loaded.',
                });
            } else {
              throw new Error("Unsupported file type. Please upload a CSV or XLSX file.");
            }
          } catch (error: any) {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: error.message || 'Failed to process file.',
            });
          }
        };
    
        reader.onerror = (error) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to read file.',
          });
        };

        if(file.name.endsWith('.xlsx')) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    };
    
    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

  return (
    <div className="flex-1 space-y-4">
       <PageHeader>
        <div>
            <PageHeaderHeading>Manage Students</PageHeaderHeading>
            <PageHeaderDescription>
                View, add, or upload student data.
            </PageHeaderDescription>
        </div>
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".csv, .xlsx"
            />
            <Button onClick={triggerFileSelect}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Data
            </Button>
        </div>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <StudentsTable data={students} />
        </CardContent>
      </Card>
    </div>
  );
}
