import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { type SectionDef } from "./content";
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

type TopNavProps = {
  sections: SectionDef[];
  currentPage?: "about" | "markets" | "technicals";
};

export function TopNav({ sections, currentPage = "about" }: TopNavProps) {
  const ids = sections.map((s) => s.id);
  const active = useActiveSection(ids);
  const aboutActive = currentPage === "about";
  const sectionPrefix = aboutActive ? "" : "/";

  const topLevelClass =
    "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full px-3 text-[0.78rem] font-bold tracking-tight transition-all hover:bg-secondary hover:text-foreground sm:min-h-11 sm:px-5 sm:text-[0.95rem]";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Primary navigation"
        className="editorial-main-nav glass-strong mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl border border-accent/20 p-1.5 shadow-[0_16px_50px_-24px_rgba(63,189,255,0.65)] sm:rounded-full sm:pl-3"
      >
        <a
          href={aboutActive ? "#top" : "/"}
          aria-label="Joshua Wang, back to top"
          className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 sm:pr-2"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-[0.7rem] font-bold tracking-tight text-primary-foreground shadow-[0_0_20px_-4px] shadow-accent/70"
          >
            JW
          </span>
          <span className="hidden font-display text-[0.95rem] font-semibold tracking-tight text-foreground lg:inline">
            Joshua Wang
          </span>
        </a>

        <div className="flex min-w-0 items-center gap-0.5 rounded-full bg-background/70 p-1 ring-1 ring-border/80 sm:gap-1">
          <NavigationMenu className="flex-none">
            <NavigationMenuList className="space-x-0">
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  aria-current={aboutActive ? "page" : undefined}
                  className={cn(
                    topLevelClass,
                    "h-auto bg-transparent",
                    aboutActive
                      ? "bg-primary/30 text-foreground shadow-[0_0_22px_-10px] shadow-accent"
                      : "text-muted-foreground",
                  )}
                >
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[min(22rem,calc(100vw-1.5rem))] p-2.5">
                    <div className="px-2 pb-2 pt-1">
                      <p className="font-display text-sm font-semibold text-foreground">
                        About Joshua
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Jump to a section</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {sections.map((section) => {
                        const isActive = aboutActive && active === section.id;
                        return (
                          <NavigationMenuLink key={section.id} asChild>
                            <a
                              href={`${sectionPrefix}#${section.id}`}
                              aria-current={isActive ? "location" : undefined}
                              className={cn(
                                "group flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:outline-none",
                                isActive
                                  ? "bg-primary/20 text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              <span className="font-mono text-[0.65rem] text-accent">
                                {section.index}
                              </span>
                              <span>{section.label}</span>
                            </a>
                          </NavigationMenuLink>
                        );
                      })}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link
            to="/markets"
            aria-current={currentPage === "markets" ? "page" : undefined}
            className={cn(
              topLevelClass,
              currentPage === "markets"
                ? "bg-primary/30 text-foreground shadow-[0_0_22px_-10px] shadow-accent"
                : "text-muted-foreground",
            )}
          >
            Markets
          </Link>
          <Link
            to="/technicals"
            aria-current={currentPage === "technicals" ? "page" : undefined}
            className={cn(
              topLevelClass,
              currentPage === "technicals"
                ? "bg-primary/30 text-foreground shadow-[0_0_22px_-10px] shadow-accent"
                : "text-muted-foreground",
            )}
          >
            IB Technicals
          </Link>
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
