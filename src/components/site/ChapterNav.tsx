import { useActiveSection } from "./useScrollReveal";

export type Chapter = { id: string; number: string; title: string };

export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const ids = chapters.map((c) => c.id);
  const active = useActiveSection(ids);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Chapters"
        className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3 sm:px-8"
      >
        <a
          href="#top"
          className="display-title shrink-0 text-base text-foreground transition-colors hover:text-primary"
        >
          Joshua Wang
        </a>

        <ul className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chapters.map((c) => {
            const isActive = active === c.id;
            return (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "chapter-label rounded-full px-3 py-1.5 transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "hover:bg-secondary/60 hover:text-foreground",
                  ].join(" ")}
                >
                  <span aria-hidden="true" className="mr-1.5 opacity-60">
                    {c.number}
                  </span>
                  {c.title}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <a
            className="chapter-label transition-colors hover:text-primary"
            href="mailto:joshua.wang@duke.edu"
          >
            Email
          </a>
          <a
            className="chapter-label transition-colors hover:text-primary"
            href="https://www.linkedin.com/in/-joshua-wang-/"
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
          </a>
        </div>
      </nav>
    </header>
  );
}
