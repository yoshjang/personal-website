import type { SVGProps } from "react";

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Basketball, drawn to match the Lucide stroke style. */
export function BasketballIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="M5.6 5.6c2.4 1.3 4 3.7 4 6.4s-1.6 5.1-4 6.4" />
      <path d="M18.4 5.6c-2.4 1.3-4 3.7-4 6.4s1.6 5.1 4 6.4" />
    </svg>
  );
}

/** American football, drawn to match the Lucide stroke style. */
export function FootballIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 3.5c-5.2-1-10.4.7-13.6 3.9S2.5 15.3 3.5 20.5c5.2 1 10.4-.7 13.6-3.9s4.9-8 3.4-13.1Z" />
      <path d="M8.5 15.5l7-7" />
      <path d="M10 12l1.5 1.5" />
      <path d="M12 10l1.5 1.5" />
      <path d="M4 4l3 3" />
      <path d="M17 17l3 3" />
    </svg>
  );
}

/** Racing helmet silhouette for Formula 1, matching the Lucide style. */
export function HelmetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 14a8 8 0 0 1 16 0v3a2 2 0 0 1-2 2H9a5 5 0 0 1-5-5Z" />
      <path d="M4 13h9a3 3 0 0 1 3 3v3" />
      <path d="M8 10h6" />
    </svg>
  );
}

/** Laurel wreath for history and myth, matching the Lucide style. */
export function LaurelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v16" />
      <path d="M12 8c-3 0-5-2-5-4 2 0 5 1 5 4Z" />
      <path d="M12 8c3 0 5-2 5-4-2 0-5 1-5 4Z" />
      <path d="M12 13c-3 0-6-1.5-6-4 2.5 0 6 1 6 4Z" />
      <path d="M12 13c3 0 6-1.5 6-4-2.5 0-6 1-6 4Z" />
      <path d="M12 18c-3 0-6-1-7-4 3 0 7 1 7 4Z" />
      <path d="M12 18c3 0 6-1 7-4-3 0-7 1-7 4Z" />
    </svg>
  );
}
