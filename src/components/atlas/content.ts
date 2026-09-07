export const LINKS = {
  email: "joshua.wang@duke.edu",
  mailto: "mailto:joshua.wang@duke.edu",
  linkedin: "https://www.linkedin.com/in/-joshua-wang-/",
  poster: "/documents/josh-poster.pdf",
} as const;

export type SectionDef = { id: string; index: string; label: string };

/** Single-page anchors, in reading order. */
export const SECTIONS: SectionDef[] = [
  { id: "top", index: "00", label: "Opening" },
  { id: "focus", index: "01", label: "Through-line" },
  { id: "journey", index: "02", label: "Journey" },
  { id: "research", index: "03", label: "Research" },
  { id: "community", index: "04", label: "Community" },
  { id: "finance", index: "05", label: "Finance" },
  { id: "beyond", index: "06", label: "Beyond" },
  { id: "skills", index: "07", label: "Skills" },
  { id: "contact", index: "08", label: "Contact" },
];
