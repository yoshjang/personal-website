import type { ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";

export function ChapterSection({
  id,
  number,
  title,
  kicker,
  children,
  aside,
  after,
  tinted = false,
}: {
  id: string;
  number: string;
  title: string;
  kicker: string;
  children: ReactNode;
  /** Optional column beside the narrative text on large screens. */
  aside?: ReactNode;
  /** Optional full width block below the narrative, e.g. a gallery. */
  after?: ReactNode;
  tinted?: boolean;
}) {
  const reveal = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={[
        "relative border-t border-rule",
        tinted ? "bg-secondary/40" : "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-8 md:grid-cols-[9rem_1fr] md:gap-12">
          {/* chapter marker rail */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
              <span className="display-title text-4xl text-primary/35 tabular-nums sm:text-5xl">
                {number}
              </span>
              <span className="chapter-label">{kicker}</span>
            </div>
            <span
              aria-hidden="true"
              className="mt-4 hidden h-16 w-px bg-gradient-to-b from-rule to-transparent md:block"
            />
          </div>

          <div ref={reveal.ref} className={reveal.className}>
            <h2
              id={`${id}-heading`}
              className="display-title max-w-3xl text-3xl text-foreground sm:text-4xl md:text-[2.75rem]"
            >
              {title}
            </h2>

            {aside ? (
              <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
                <div className="space-y-5">{children}</div>
                <div className="lg:pt-1">{aside}</div>
              </div>
            ) : (
              <div className="mt-8 space-y-5">{children}</div>
            )}
          </div>
        </div>

        {after ? <div className="mt-12 sm:mt-16">{after}</div> : null}
      </div>
    </section>
  );
}

export function Para({ children }: { children: ReactNode }) {
  return <p className="prose-narrative">{children}</p>;
}

export function NoteList({
  heading,
  items,
}: {
  heading: string;
  items: ReactNode[];
}) {
  return (
    <div className="mt-8 rounded-lg border border-border bg-card p-5 sm:p-6">
      <h3 className="chapter-label">{heading}</h3>
      <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[0.95rem] leading-relaxed text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="mt-2.5 h-px w-3 shrink-0 bg-primary/50"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FactCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="chapter-label">{label}</h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

export function RoleCard({
  org,
  role,
  dates,
  children,
}: {
  org: string;
  role: string;
  dates?: string;
  children: ReactNode;
}) {
  return (
    <article className="border-l-2 border-primary/25 pl-5">
      <h3 className="display-title text-xl text-foreground">{org}</h3>
      <p className="chapter-label mt-1">{role}</p>
      {dates ? <p className="chapter-label mt-1 opacity-70">{dates}</p> : null}
      <div className="mt-3 space-y-3">{children}</div>
    </article>
  );
}
