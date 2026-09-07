import { useEffect, useRef } from "react";
import { Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINKS, type SectionDef } from "./content";
import { useActiveSection, useFinePointer, useReducedMotion } from "./motion";

/* ---------- Skip link ---------- */

export function SkipLink() {
  return (
    <a
      href="#focus"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-lime-foreground"
    >
      Skip to content
    </a>
  );
}

/* ---------- Fixed backdrop: aurora, grid, noise ---------- */

export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora absolute inset-0" />
      <div className="grid-texture absolute inset-x-0 top-0 h-[120vh]" />
      <div className="noise" />
    </div>
  );
}

/* ---------- Scroll progress ---------- */

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = bar.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px]">
      <div
        ref={bar}
        className="h-full w-full origin-left bg-gradient-to-r from-primary via-accent to-lime shadow-[0_0_14px] shadow-accent/60"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/* ---------- Cursor spotlight (pointer devices only) ---------- */

export function Spotlight() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      const node = el.current;
      if (!node) return;
      node.style.setProperty("--sx", `${x}px`);
      node.style.setProperty("--sy", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const onLeave = () => {
      const node = el.current;
      if (node) node.style.opacity = "0";
    };
    const onEnter = () => {
      const node = el.current;
      if (node) node.style.opacity = "1";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={el} aria-hidden="true" className="spotlight z-0" />;
}

/* ---------- Top navigation ---------- */

export function TopNav({ sections }: { sections: SectionDef[] }) {
  const ids = sections.map((s) => s.id);
  const active = useActiveSection(ids);
  const scroller = useRef<HTMLUListElement>(null);

  // Keep the active link visible inside the horizontally scrolling strip.
  useEffect(() => {
    const list = scroller.current;
    if (!list) return;
    if (list.scrollWidth <= list.clientWidth) return;
    const link = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!link) return;
    const target = link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
  }, [active]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Sections"
        className="glass-strong mx-auto flex max-w-6xl items-center gap-2 rounded-full py-1.5 pl-2 pr-2 sm:gap-3 sm:pl-3"
      >
        <a
          href="#top"
          aria-label="Joshua Wang, back to top"
          className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-2"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-[0.7rem] font-bold tracking-tight text-primary-foreground shadow-[0_0_20px_-4px] shadow-accent/70"
          >
            JW
          </span>
          <span className="hidden font-display text-[0.95rem] font-semibold tracking-tight text-foreground md:inline">
            Joshua Wang
          </span>
        </a>

        <ul
          ref={scroller}
          className="scrollbar-none flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto py-0.5"
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  data-id={s.id}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative flex min-h-9 items-center gap-2 rounded-full px-3 text-[0.8125rem] font-medium transition-colors",
                    isActive
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow]",
                      isActive ? "bg-lime shadow-[0_0_10px] shadow-lime/80" : "bg-border",
                    )}
                  />
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={LINKS.mailto}
            aria-label={`Email ${LINKS.email}`}
            title={LINKS.email}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-accent"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn profile (opens in a new tab)"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-accent"
          >
            <Linkedin aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Side dot rail (large screens) ---------- */

export function DotRail({ sections }: { sections: SectionDef[] }) {
  const ids = sections.map((s) => s.id);
  const active = useActiveSection(ids);

  return (
    <nav
      aria-label="Section progress"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:block"
    >
      <ol className="flex flex-col items-end gap-2.5">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex min-h-7 items-center gap-3 rounded-full px-1.5 py-1"
              >
                <span
                  className={cn(
                    "mono-label text-[0.62rem] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                    isActive && "text-foreground",
                  )}
                >
                  {s.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    isActive
                      ? "h-2.5 w-2.5 bg-lime shadow-[0_0_12px] shadow-lime/80"
                      : "h-1.5 w-1.5 bg-border group-hover:bg-accent",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
