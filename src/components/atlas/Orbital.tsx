import type { CSSProperties } from "react";
import { Database, HeartHandshake, Sun, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo } from "./photos";

type ThemeNode = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Angle in degrees, measured clockwise from 3 o'clock. */
  angle: number;
  tone: string;
};

export const THEME_NODES: ThemeNode[] = [
  { id: "data", label: "Data", icon: Database, angle: -55, tone: "text-accent" },
  { id: "energy", label: "Energy", icon: Sun, angle: 35, tone: "text-lime" },
  { id: "finance", label: "Finance", icon: TrendingUp, angle: 125, tone: "text-primary-bright" },
  { id: "community", label: "Community", icon: HeartHandshake, angle: 215, tone: "text-accent" },
];

const ROUTE_R = 36;
const LABEL_R = 48;

/** Rounded so server and client render identical attribute strings. */
const round = (n: number) => Math.round(n * 1000) / 1000;

const polar = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: round(50 + r * Math.cos(rad)), y: round(50 + r * Math.sin(rad)) };
};

const spin: CSSProperties = { transformOrigin: "50px 50px" };
const pulse: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };

/**
 * Animated orbital map built from SVG and CSS only. The portrait sits at the
 * center; four theme nodes ride a dashed route around it. Motion is limited
 * to slow rotation and a flowing dash pattern, and reduced-motion users get
 * a static map.
 */
export function OrbitalPortrait({ photo, className }: { photo: Photo; className?: string }) {
  return (
    <div className={cn("relative mx-auto aspect-square w-full", className)}>
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.45" />
            <stop offset="60%" stopColor="var(--color-primary)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orb-route" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="50%" stopColor="var(--color-primary-bright)" />
            <stop offset="100%" stopColor="var(--color-lime)" />
          </linearGradient>
        </defs>

        {/* glow behind the portrait */}
        <circle cx="50" cy="50" r="34" fill="url(#orb-core)" />

        {/* outer, slow, faint ring */}
        <g className="animate-orbit-slow motion-reduce:animate-none" style={spin}>
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="1 4"
            vectorEffect="non-scaling-stroke"
            opacity="0.8"
          />
          <circle cx="96" cy="50" r="0.9" fill="var(--color-accent)" opacity="0.9" />
        </g>

        {/* inner counter-rotating ring */}
        <g className="animate-orbit-mid motion-reduce:animate-none" style={spin}>
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="var(--color-primary-bright)"
            strokeWidth="1"
            strokeDasharray="3 6"
            vectorEffect="non-scaling-stroke"
            opacity="0.35"
          />
          <circle cx="78" cy="50" r="0.8" fill="var(--color-lime)" />
        </g>

        {/* main route with flowing dashes */}
        <circle
          cx="50"
          cy="50"
          r={ROUTE_R}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.9"
        />
        <circle
          cx="50"
          cy="50"
          r={ROUTE_R}
          fill="none"
          stroke="url(#orb-route)"
          strokeWidth="1.5"
          pathLength={120}
          strokeDasharray="4 8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="animate-dash-flow motion-reduce:animate-none"
          opacity="0.85"
        />

        {/* spokes from each node toward the center, hidden behind the portrait */}
        {THEME_NODES.map((n) => {
          const a = polar(n.angle, ROUTE_R);
          const b = polar(n.angle, 24);
          return (
            <line
              key={`spoke-${n.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--color-accent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity="0.35"
            />
          );
        })}

        {/* nodes */}
        {THEME_NODES.map((n, i) => {
          const p = polar(n.angle, ROUTE_R);
          return (
            <g key={n.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r="3.2"
                fill="var(--color-accent)"
                opacity="0.25"
                className="animate-pulse-soft motion-reduce:animate-none"
                style={{ ...pulse, animationDelay: `${i * 0.6}s` }}
              />
              <circle cx={p.x} cy={p.y} r="1.7" fill="var(--color-background)" />
              <circle
                cx={p.x}
                cy={p.y}
                r="1.7"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={p.x} cy={p.y} r="0.7" fill="var(--color-lime)" />
            </g>
          );
        })}
      </svg>

      {/* portrait */}
      <div className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2">
        <div className="ring-glow relative aspect-square overflow-hidden rounded-full border border-border/70 bg-surface">
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 14rem, (min-width: 640px) 11rem, 7.5rem"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* labels */}
      {THEME_NODES.map((n) => {
        const p = polar(n.angle, LABEL_R);
        const Icon = n.icon;
        return (
          <span
            key={`label-${n.id}`}
            className="glass-strong absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-foreground sm:px-3 sm:text-[0.68rem]"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <Icon aria-hidden="true" className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5", n.tone)} />
            {n.label}
          </span>
        );
      })}
    </div>
  );
}
