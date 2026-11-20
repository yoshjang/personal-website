import {
  ArrowDown,
  Briefcase,
  Database,
  FileDown,
  HeartHandshake,
  Linkedin,
  Mail,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { trackEvent } from "@/lib/analytics";
import { LINKS } from "../content";
import { photos } from "../photos";
import { CountUp, LinkButton, Magnetic, Reveal, Star, type IconType } from "../ui";
import type { ViewMode } from "@/lib/view-mode";

type Theme = {
  label: string;
  href: { full: string; recruiter: string };
  icon: IconType;
  tone: string;
  line: string;
};

const THEMES: Theme[] = [
  {
    label: "Data",
    href: { full: "#skills", recruiter: "#skills" },
    icon: Database,
    tone: "text-accent",
    line: "Statistical science, RNA-seq analysis, investor metrics",
  },
  {
    label: "Energy",
    href: { full: "#research", recruiter: "#casework" },
    icon: Sun,
    tone: "text-lime",
    line: "Thin-film and perovskite solar cells, redox-flow batteries",
  },
  {
    label: "Finance",
    href: { full: "#finance", recruiter: "#finance" },
    icon: TrendingUp,
    tone: "text-primary-bright",
    line: "M&A and venture analyst work, Summer 2026",
  },
  {
    label: "Community",
    href: { full: "#community", recruiter: "#focus" },
    icon: HeartHandshake,
    tone: "text-accent",
    line: "Toledo Minds, student leadership, church service",
  },
];

const PROOF_POINTS: { value: number; format: (v: number) => string; label: string }[] = [
  {
    value: 2,
    format: (v) => String(Math.round(v)),
    label: "live buy-side processes supported to LOI, ~$5M enterprise value each",
  },
  {
    value: 22000,
    format: (v) => Math.round(v).toLocaleString("en-US"),
    label: "companies screened with a personal 10-point scoring system",
  },
  {
    value: 40,
    format: (v) => `${Math.round(v)}+`,
    label: "limited partners received quarterly investor reports he wrote",
  },
];

const SELECTED_EXPERIENCE = [
  {
    org: "Wood Creek Advisors",
    role: "M&A Analyst",
    when: "Summer 2026",
    line: "Buy-side sourcing and diligence for two lower-middle-market clients; a sourcing workflow the firm adopted.",
  },
  {
    org: "CoreNetwork Fund",
    role: "Venture Capital Analyst",
    when: "Summer 2026",
    line: "Quarterly reporting for 40+ LPs and support for a $70M portfolio-company sale process.",
  },
];

export function Opening({
  view,
  onViewChange,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}) {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="editorial-hero relative overflow-hidden pb-14 pt-24 sm:pb-20 sm:pt-32"
    >
      <HeroLines />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
          {/* copy */}
          <div className="relative z-10 order-1">
            <p
              className="mono-label intro-item flex flex-wrap items-center gap-x-3 gap-y-1"
              style={{ "--d": "60ms" } as CSSProperties}
            >
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
              <span className="mask-line">
                <span className="mask-inner" style={{ "--d": "140ms" } as CSSProperties}>
                  Joshua
                </span>
              </span>{" "}
              <span className="mask-line">
                <span
                  className="mask-inner text-gradient"
                  style={{ "--d": "300ms" } as CSSProperties}
                >
                  Wang
                  <Star className="ml-4 inline-block h-[0.32em] w-[0.32em] align-baseline text-primary" />
                </span>
              </span>
            </h1>

            <p
              className="body-copy intro-item mt-6 text-lg sm:text-xl"
              style={{ "--d": "460ms" } as CSSProperties}
            >
              Duke University student from Toledo, Ohio. B.S. in Statistical Science with a Data
              Science concentration and a Financial Economics minor, expected May 2029. M&A and
              venture capital analyst, Summer 2026. Investment banking recruiting for 2028.
            </p>

            {/* proof points */}
            <div className="intro-item mt-7" style={{ "--d": "580ms" } as CSSProperties}>
              <dl className="grid gap-3 sm:grid-cols-3">
                {PROOF_POINTS.map((p) => (
                  <div key={p.label} className="glass rounded-2xl px-4 py-3.5">
                    <dt className="sr-only">Proof point</dt>
                    <dd className="font-display text-2xl font-bold tracking-tight text-lime">
                      <CountUp value={p.value} format={p.format} />
                    </dd>
                    <dd className="mt-1 text-[0.8rem] leading-snug text-muted-foreground">
                      {p.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* selected experience */}
            <div className="intro-item mt-4" style={{ "--d": "700ms" } as CSSProperties}>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="mono-label flex items-center gap-2 text-accent">
                    <Briefcase aria-hidden="true" className="h-3.5 w-3.5" />
                    Selected experience
                  </p>
                  <a
                    href="#casework"
                    className="link-sweep text-[0.8rem] font-semibold text-accent transition-colors hover:text-foreground"
                  >
                    Case studies
                  </a>
                </div>
                <ul className="mt-3.5 space-y-3.5">
                  {SELECTED_EXPERIENCE.map((e) => (
                    <li key={e.org}>
                      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-foreground">{e.org}</span>
                        <span className="text-[0.85rem] text-primary-bright">{e.role}</span>
                        <span className="mono-label text-[0.62rem] normal-case tracking-[0.08em]">
                          {e.when}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                        {e.line}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="intro-item mt-7 flex flex-wrap items-center gap-3"
              style={{ "--d": "820ms" } as CSSProperties}
            >
              <Magnetic>
                <LinkButton
                  href={LINKS.mailto}
                  icon={Mail}
                  onClick={() => trackEvent("contact-email")}
                >
                  Email Joshua
                </LinkButton>
              </Magnetic>
              <Magnetic>
                <LinkButton
                  href={LINKS.resume}
                  icon={FileDown}
                  variant="lime"
                  external
                  onClick={() => trackEvent("resume-download")}
                >
                  Download resume
                </LinkButton>
              </Magnetic>
              <Magnetic>
                <LinkButton
                  href={LINKS.linkedin}
                  icon={Linkedin}
                  variant="ghost"
                  external
                  onClick={() => trackEvent("contact-linkedin")}
                >
                  LinkedIn
                </LinkButton>
              </Magnetic>
            </div>

            {/* view switch */}
            <div className="intro-item mt-7" style={{ "--d": "940ms" } as CSSProperties}>
              <ViewSwitch view={view} onViewChange={onViewChange} />
              <p className="mt-2.5 max-w-md text-[0.82rem] leading-relaxed text-muted-foreground">
                {view === "recruiter"
                  ? "Recruiter view keeps the essentials: case studies, finance experience, skills, and contact. The full story adds the journey, research, community, and life off the clock."
                  : "The full story adds the journey from Toledo to Duke, the research record, community work, and life off the clock. Recruiter view trims it to the essentials."}
              </p>
            </div>

            <a
              href={view === "recruiter" ? "#casework" : "#focus"}
              className="group intro-item mt-8 inline-flex min-h-11 items-center gap-3 rounded-full text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
              style={{ "--d": "1040ms" } as CSSProperties}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-surface/60 transition-colors group-hover:border-accent/60">
                <ArrowDown aria-hidden="true" className="h-4 w-4 animate-cue text-accent" />
              </span>
              <span>
                {view === "recruiter"
                  ? "Below: the through-line, three case studies, finance experience, skills, and contact"
                  : "Ten sections below: journey, research, community, finance, and what he does off the clock"}
              </span>
            </a>
          </div>

          {/* orbital portrait */}
          <div
            className="prototype-portrait-stage intro-item relative z-10 order-2"
            style={{ "--d": "520ms" } as CSSProperties}
          >
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
          <ol
            aria-label="Four themes"
            className="editorial-themes grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {THEMES.map((t, i) => {
              const Icon = t.icon;
              return (
                <li key={t.label}>
                  <a
                    href={t.href[view]}
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

export function ViewSwitch({
  view,
  onViewChange,
  className,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string | undefined;
}) {
  return (
    <div
      role="group"
      aria-label="Choose how much of the site to show"
      className={`glass inline-flex items-center gap-1 rounded-full p-1 ${className ?? ""}`}
    >
      {(
        [
          ["recruiter", "Recruiter view"],
          ["full", "Full story"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          onClick={() => onViewChange(value)}
          className={`min-h-9 rounded-full px-4 text-[0.85rem] font-semibold transition-colors ${
            view === value
              ? "bg-primary text-primary-foreground shadow-[0_8px_22px_-10px] shadow-primary/70"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * Animated warped-line field behind the hero, in the spirit of the
 * reference sites' kinetic backgrounds. Pure canvas, no dependencies.
 * Static single frame for reduced-motion users; pauses when tab hidden.
 */
function HeroLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let raf = 0;
    let stroke = "";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stroke = getComputedStyle(canvas).color;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      const count = Math.max(18, Math.floor(width / 26));
      const step = 16;
      for (let i = 0; i <= count; i++) {
        const x0 = (i / count) * width;
        ctx.beginPath();
        for (let y = -step; y <= height + step; y += step) {
          const warp =
            Math.sin(y * 0.006 + t * 0.00045 + i * 0.38) * 24 +
            Math.sin(y * 0.012 - t * 0.00062 + i * 0.9) * 11 +
            Math.sin((x0 + y) * 0.0021 + t * 0.00023) * 16;
          let x = x0 + warp;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 25600) {
            const f = (1 - d2 / 25600) * 30;
            x += (dx / Math.sqrt(d2 + 0.01)) * f;
          }
          if (y === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: globalThis.PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    if (!reduced) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }
    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="hero-lines" />;
}
