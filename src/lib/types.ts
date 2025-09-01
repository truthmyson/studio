
export interface Student {
    id: string; // School ID
    firstName: string;
    middleName?: string;
    lastName: string;
    // For simplicity, we'll derive the full name when needed.
    // name: string; 
    major: string; // Course Name
    email: string;
    contact?: string;
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    courseName: string;
}
