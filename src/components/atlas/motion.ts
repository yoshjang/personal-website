import { useEffect, useRef, useState } from "react";

/** Subscribes to a media query. Always false during SSR and first paint. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True only for mouse or trackpad style devices that can hover. */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export type RevealState = "idle" | "hidden" | "shown";

/**
 * Reveals an element once it scrolls into view.
 * Content renders visible on the server and for the first paint; only
 * elements below the fold are hidden and then revealed. Reduced motion
 * users never see anything hidden.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return;
    }
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setState("shown");
      return;
    }
    setState("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("shown");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, state };
}

/** Tracks which section id currently occupies the reading band. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const list = key.split("|").filter(Boolean);
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = list
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        // Prefer the section that starts closest to the top of the band.
        const candidates = nodes
          .filter((n) => (ratios.get(n.id) ?? 0) > 0)
          .sort(
            (a, b) =>
              Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top),
          );
        if (candidates[0]) setActive(candidates[0].id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
    );
    nodes.forEach((n) => observer.observe(n));

    const onScroll = () => {
      if (window.scrollY < 40 && list[0]) setActive(list[0]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [key]);

  return active;
}
