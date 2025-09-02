
import type { SVGProps } from "react";

export function VITOBULogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 7h10" />
      <path d="M12 12v5" />
      <path d="M12 22a7 7 0 0 0 7-7" />
      <path d="M5 15a7 7 0 0 0 7 7" />
      <path d="M12 2a5 5 0 0 0-5 5v3h10V7a5 5 0 0 0-5-5Z" />
    </svg>
  );
}

export function PlayStoreIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" {...props}>
            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0L11 27.3l104.6 104.6 157.6-157.6C263.2 29.3 245.3 0 211.3 0H47zm232.5 157.6l-157.6 157.6-104.6-104.6L47 211.3v261.4C47 502 61.3 512 75.3 512H211.3c34 0 51.8-29.3 62-48.4l157.6-157.6-157.6-157.6zM362.2 256l60.1-60.1-280.8-161.2L47 153.6v.1l104.6 104.6 157.6 157.6 60.1-60.1z"/>
        </svg>
    )
}
