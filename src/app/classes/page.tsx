
'use client';

import { useEffect, useState } from 'react';
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateClassDialog } from '@/components/feature/create-class-dialog';
import { getClassesByRepAction, type ClassWithStudentCount } from '@/lib/actions';
import { ClassCard } from '@/components/feature/class-card';
import { Skeleton } from '@/components/ui/skeleton';

// Hardcoded for now, in a real app this would come from the user's session
const REP_ID = '24275016'; 

export default function ClassesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [classes, setClasses] = useState<ClassWithStudentCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    setIsLoading(true);
    const repClasses = await getClassesByRepAction(REP_ID);
    setClasses(repClasses);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader>
        <div>
            <PageHeaderHeading>Manage Classes</PageHeaderHeading>
            <PageHeaderDescription>
                Create new classes and view your existing ones.
            </PageHeaderDescription>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Class
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-5/6" />
                   <div className="flex justify-between items-center pt-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                   </div>
                </CardContent>
             </Card>
          ))}
        </div>
      ) : classes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
                <ClassCard key={cls.id} classData={cls} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center h-80">
            <h3 className="text-xl font-semibold tracking-tight">No classes found</h3>
            <p className="text-muted-foreground mt-2">
                Click "Create Class" to set up your first one.
            </p>
        </div>
      )}

      <CreateClassDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        repId={REP_ID}
        onClassCreated={fetchClasses} // Refresh the list after creation
      />
    </div>
  );
}
