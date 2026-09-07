import {
  type ComponentType,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion, useReveal } from "./motion";
import type { Photo } from "./photos";

/** Any icon component that accepts a className, including Lucide icons. */
export type IconType = ComponentType<{
  className?: string | undefined;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/* ---------- Reveal ---------- */

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  delay?: number | undefined;
  as?: "div" | "li" | "article" | "figure" | "header" | undefined;
}) {
  const { ref, state } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      data-state={state}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}

/* ---------- Section shell ---------- */

export function Section({
  id,
  index,
  kicker,
  title,
  lede,
  children,
  className,
  glowX,
  glowY,
}: {
  id: string;
  index: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
  glowX?: string | undefined;
  glowY?: string | undefined;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative border-t border-border/40 py-20 sm:py-28", className)}
    >
      <div
        aria-hidden="true"
        className="section-glow pointer-events-none absolute inset-0 opacity-70"
        style={{ "--glow-x": glowX ?? "85%", "--glow-y": glowY ?? "0%" } as CSSProperties}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal as="header">
          <div className="mono-label flex items-center gap-3">
            <span className="text-accent">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-border" />
            <span>{kicker}</span>
          </div>
          <h2
            id={`${id}-title`}
            className="display-medium mt-5 max-w-3xl text-[2rem] text-foreground sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          {lede ? <p className="body-copy mt-6">{lede}</p> : null}
        </Reveal>
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}

/* ---------- Tilt card ---------- */

export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string | undefined;
  max?: number | undefined;
}) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!enabled || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--sheen", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative", enabled && "tilt", className)}
    >
      {children}
    </div>
  );
}

/* ---------- Small atoms ---------- */

type Tone = "default" | "blue" | "cyan" | "lime";

const chipTones: Record<Tone, string> = {
  default: "border-border/80 bg-secondary/60 text-foreground",
  blue: "border-primary/50 bg-primary/15 text-primary-bright",
  cyan: "border-accent/40 bg-accent/10 text-accent",
  lime: "border-lime/40 bg-lime/10 text-lime",
};

export function Chip({
  children,
  tone = "default",
  icon: Icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone | undefined;
  icon?: IconType | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.8125rem] font-medium leading-6",
        chipTones[tone],
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
}

const badgeTones: Record<Tone, string> = {
  default: "border-border/80 bg-secondary text-foreground",
  blue: "border-primary/40 bg-primary/20 text-primary-bright",
  cyan: "border-accent/40 bg-accent/10 text-accent",
  lime: "border-lime/40 bg-lime/10 text-lime",
};

export function IconBadge({
  icon: Icon,
  tone = "cyan",
  className,
}: {
  icon: IconType;
  tone?: Tone | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid h-10 w-10 shrink-0 place-items-center rounded-xl border",
        badgeTones[tone],
        className,
      )}
    >
      <Icon className="h-[1.15rem] w-[1.15rem]" />
    </span>
  );
}

export function Bullets({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted-foreground">
          <span
            aria-hidden="true"
            className="mt-[0.7rem] h-px w-3 shrink-0 bg-accent/70"
          />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  icon: Icon,
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "lime" | undefined;
  icon?: IconType | undefined;
  external?: boolean | undefined;
  className?: string | undefined;
}) {
  const base =
    "group inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[0.95rem] font-semibold transition-[background-color,border-color,color,transform,box-shadow] duration-200 active:scale-[0.98]";
  const styles = {
    primary:
      "bg-primary text-primary-foreground shadow-[0_10px_30px_-12px] shadow-primary/70 hover:bg-primary-bright hover:text-accent-foreground",
    ghost: "glass text-foreground hover:border-accent/60 hover:text-accent",
    lime: "bg-lime text-lime-foreground hover:brightness-110",
  } as const;
  return (
    <a
      href={href}
      className={cn(base, styles[variant], className)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
      <span>{children}</span>
      {external ? (
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      ) : null}
    </a>
  );
}

/* ---------- Expandable detail card ---------- */

export function DetailCard({
  icon,
  title,
  role,
  meta,
  summary,
  details,
  tone = "cyan",
  className,
  children,
}: {
  icon: IconType;
  title: string;
  role?: string | undefined;
  meta?: string | undefined;
  summary: ReactNode;
  details?: ReactNode[] | undefined;
  tone?: Tone | undefined;
  className?: string | undefined;
  children?: ReactNode | undefined;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hasDetails = Boolean(details && details.length > 0);

  return (
    <article
      className={cn(
        "glass hover-lift relative flex flex-col rounded-2xl p-5 sm:p-6",
        open && "border-accent/40",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <IconBadge icon={icon} tone={tone} />
        <div className="min-w-0 flex-1">
          <h3 className="display-medium text-[1.2rem] text-foreground">{title}</h3>
          {role || meta ? (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {role ? (
                <span className="text-[0.9rem] font-medium text-primary-bright">{role}</span>
              ) : null}
              {role && meta ? (
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />
              ) : null}
              {meta ? <span className="mono-label normal-case tracking-[0.08em]">{meta}</span> : null}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{summary}</p>

      {children}

      {hasDetails ? (
        <>
          <div
            id={panelId}
            aria-hidden={!open}
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
              open ? "[grid-template-rows:1fr] opacity-100" : "[grid-template-rows:0fr] opacity-0",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="mt-4 border-t border-border/50 pt-4">
                <Bullets items={details ?? []} />
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="mono-label mt-4 inline-flex min-h-9 w-fit items-center gap-2 rounded-full text-accent transition-colors hover:text-foreground"
          >
            {open ? "Show less" : "Details"}
            <ChevronDown
              aria-hidden="true"
              className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
            />
          </button>
        </>
      ) : null}
    </article>
  );
}

/* ---------- Figure ---------- */

export function Figure({
  photo,
  caption,
  priority = false,
  sizes = "(min-width: 1024px) 32rem, 100vw",
  className,
  frameClassName,
  imgClassName,
}: {
  photo: Photo;
  caption?: string | undefined;
  priority?: boolean | undefined;
  sizes?: string | undefined;
  className?: string | undefined;
  frameClassName?: string | undefined;
  imgClassName?: string | undefined;
}) {
  return (
    <figure className={cn("min-w-0", className)}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border/60 bg-surface",
          frameClassName,
        )}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : undefined}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none",
            "[@media(hover:hover)]:group-hover:scale-[1.03]",
            imgClassName,
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px] shadow-foreground/5"
        />
      </div>
      {caption ? (
        <figcaption className="mono-label mt-2.5 block normal-case leading-relaxed tracking-[0.1em]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
