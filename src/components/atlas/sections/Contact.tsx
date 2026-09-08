import type { CSSProperties } from "react";
import { ArrowUp, Linkedin, Mail } from "lucide-react";
import { LINKS, SECTIONS } from "../content";
import { LinkButton, Reveal } from "../ui";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="prototype-contact relative border-t border-border/40 py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="section-glow pointer-events-none absolute inset-0"
        style={{ "--glow-x": "50%", "--glow-y": "100%" } as CSSProperties}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="glass lumen relative overflow-hidden rounded-3xl p-7 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <p className="mono-label flex items-center gap-3">
                  <span className="text-accent">08</span>
                  <span aria-hidden="true" className="h-px w-8 bg-border" />
                  <span>Contact</span>
                </p>
                <h2
                  id="contact-title"
                  className="display mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl"
                >
                  Reach Joshua by email or on{" "}
                  <span className="text-gradient">LinkedIn</span>.
                </h2>
                <p className="body-copy mt-6">
                  Duke University, Durham, North Carolina. Home is Toledo, Ohio.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <LinkButton href={LINKS.mailto} icon={Mail} className="justify-center">
                  {LINKS.email}
                </LinkButton>
                <LinkButton
                  href={LINKS.linkedin}
                  icon={Linkedin}
                  variant="ghost"
                  external
                  className="justify-center"
                >
                  linkedin.com/in/-joshua-wang-
                </LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 pb-10 pt-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            Joshua Wang
          </p>
          <p className="mono-label mt-1.5 normal-case tracking-[0.1em]">joshuawang.app</p>
          <p className="mt-4 text-[0.85rem] text-muted-foreground">
            &copy; {new Date().getFullYear()} Joshua Wang
          </p>
        </div>

        <nav aria-label="Footer sections" className="md:max-w-md">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {SECTIONS.filter((s) => s.id !== "top").map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-[0.85rem] text-muted-foreground transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#top"
          className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-border/70 px-4 text-[0.85rem] text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
        >
          Back to top
          <ArrowUp
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  );
}
