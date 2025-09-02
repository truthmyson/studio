
'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFont } from "@/hooks/use-font";

export default function SettingsPage() {
  const { setFont } = useFont();

  return (
    <div className="flex-1 space-y-4">
      <PageHeader>
        <div>
            <PageHeaderHeading>Settings</PageHeaderHeading>
            <PageHeaderDescription>
                Manage your account and application settings.
            </PageHeaderDescription>
        </div>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="lecture-notifications" className="text-base">Lecture Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                        Send notifications 15 minutes before a lecture starts.
                    </p>
                </div>
                <Switch id="lecture-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="attendance-confirmations" className="text-base">Attendance Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive a notification after your attendance is marked.
                    </p>
                </div>
                <Switch id="attendance-confirmations" />
            </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
                Customize the look and feel of the application.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="font-select">Font</Label>
                 <Select onValueChange={setFont}>
                    <SelectTrigger id="font-select" className="w-[280px]">
                        <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="pt-sans">PT Sans</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-sm text-muted-foreground">
                    Set the font you want to use across the application.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
