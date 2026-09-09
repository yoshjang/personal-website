import { ArrowDown, Database, HeartHandshake, Linkedin, Mail, Sun, TrendingUp } from "lucide-react";
import { LINKS } from "../content";
import { photos } from "../photos";
import { LinkButton, Reveal, type IconType } from "../ui";

type Theme = {
  label: string;
  href: string;
  icon: IconType;
  tone: string;
  line: string;
};

const THEMES: Theme[] = [
  {
    label: "Data",
    href: "#skills",
    icon: Database,
    tone: "text-accent",
    line: "Statistical science, RNA-seq analysis, investor metrics",
  },
  {
    label: "Energy",
    href: "#research",
    icon: Sun,
    tone: "text-lime",
    line: "Thin-film and perovskite solar cells, redox-flow batteries",
  },
  {
    label: "Finance",
    href: "#finance",
    icon: TrendingUp,
    tone: "text-primary-bright",
    line: "M&A and venture analyst work, Summer 2026",
  },
  {
    label: "Community",
    href: "#community",
    icon: HeartHandshake,
    tone: "text-accent",
    line: "Toledo Minds, student leadership, church service",
  },
];

export function Opening() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="editorial-hero relative overflow-hidden pb-14 pt-24 sm:pb-20 sm:pt-32"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
          {/* copy */}
          <div className="relative z-10 order-1">
            <p className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Toledo, Ohio</span>
              <span
                aria-hidden="true"
                className="h-px w-6 bg-gradient-to-r from-accent to-transparent"
              />
              <span>Durham, North Carolina</span>
            </p>

            <h1
              id="hero-title"
              className="editorial-hero-name display mt-5 text-[3.4rem] text-foreground sm:text-7xl lg:text-[5.5rem]"
            >
              <span>Joshua</span> <span className="text-gradient">Wang</span>
            </h1>

            <p className="body-copy mt-6 text-lg sm:text-xl">
              Duke University student from Toledo, Ohio. B.S. in Statistical Science with a Data
              Science concentration and a Financial Economics minor, expected May 2029.
            </p>

            <div className="editorial-why mt-6 max-w-xl rounded-2xl border border-accent/25 bg-accent/[0.07] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="mono-label text-accent">Why this site exists</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-foreground/90">
                I built this website as a practical tool for investment banking recruiting. It gives
                recruiters and bankers a concise view of my background and interests, while Markets
                and IB Technicals help me stay current and prepare for interviews.
              </p>
            </div>

            <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
              This page is organized around four connected themes: data, energy, finance, and
              community. Energy research raised questions about how strategy and capital help
              technologies scale; community leadership shaped how he wants to use analytical work.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href={LINKS.mailto} icon={Mail}>
                Email Joshua
              </LinkButton>
              <LinkButton href={LINKS.linkedin} icon={Linkedin} variant="ghost" external>
                LinkedIn
              </LinkButton>
            </div>

            <a
              href="#focus"
              className="group mt-10 inline-flex min-h-11 items-center gap-3 rounded-full text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-surface/60 transition-colors group-hover:border-accent/60">
                <ArrowDown aria-hidden="true" className="h-4 w-4 animate-cue text-accent" />
              </span>
              <span>
                Nine sections below: journey, research, community, finance, and what he does off the
                clock
              </span>
            </a>
          </div>

          {/* orbital portrait */}
          <div className="prototype-portrait-stage order-2">
            <div className="prototype-portrait-aura" aria-hidden="true" />
            <img
              className="prototype-portrait"
              src={photos.heroPortrait.src}
              alt={photos.heroPortrait.alt}
              width={photos.heroPortrait.width}
              height={photos.heroPortrait.height}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
            <span className="prototype-orbit-word prototype-orbit-one">Data</span>
            <span className="prototype-orbit-word prototype-orbit-two">Energy</span>
            <span className="prototype-orbit-word prototype-orbit-three">Finance + Community</span>
          </div>
        </div>

        {/* theme legend */}
        <Reveal className="mt-14 sm:mt-20">
          <ol aria-label="Four themes" className="editorial-themes grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {THEMES.map((t, i) => {
              const Icon = t.icon;
              return (
                <li key={t.label}>
                  <a
                    href={t.href}
                    className="glass hover-lift lumen flex h-full flex-col gap-3 rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="mono-label text-[0.65rem]">0{i + 1}</span>
                      <Icon aria-hidden="true" className={`h-5 w-5 ${t.tone}`} />
                    </div>
                    <span className="display-medium text-xl text-foreground">{t.label}</span>
                    <span className="text-[0.875rem] leading-relaxed text-muted-foreground">
                      {t.line}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
