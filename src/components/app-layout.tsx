
'use client';

// This component is no longer needed for a single-page website layout.
// The layout logic is now simplified and handled directly in src/app/page.tsx and src/app/layout.tsx.
// Keeping this file in case a multi-page structure is needed again in the future.
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
