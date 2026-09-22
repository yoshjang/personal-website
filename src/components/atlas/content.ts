export const LINKS = {
  email: "joshua.wang@duke.edu",
  mailto: "mailto:joshua.wang@duke.edu",
  linkedin: "https://www.linkedin.com/in/-joshua-wang-/",
  poster: "/documents/josh-poster.pdf",
  resume: "/documents/joshua-wang-resume.pdf",
} as const;

export type SectionDef = {
  id: string;
  index: string;
  label: string;
  /** Shown in the recruiter-first view as well as the full story. */
  recruiter: boolean;
};

/** Single-page anchors, in reading order. */
export const SECTIONS: SectionDef[] = [
  { id: "top", index: "00", label: "Opening", recruiter: true },
  { id: "focus", index: "01", label: "Through-line", recruiter: true },
  { id: "casework", index: "02", label: "Case studies", recruiter: true },
  { id: "journey", index: "03", label: "Journey", recruiter: false },
  { id: "research", index: "04", label: "Research", recruiter: false },
  { id: "community", index: "05", label: "Community", recruiter: false },
  { id: "finance", index: "06", label: "Finance", recruiter: true },
  { id: "beyond", index: "07", label: "Beyond", recruiter: false },
  { id: "skills", index: "08", label: "Skills", recruiter: true },
  { id: "contact", index: "09", label: "Contact", recruiter: true },
];

/** The recruiter-first subset of the homepage. */
export const RECRUITER_SECTIONS = SECTIONS.filter((s) => s.recruiter);
