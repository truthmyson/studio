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
