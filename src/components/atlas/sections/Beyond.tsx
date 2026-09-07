import { BookOpen, Dices, Dumbbell, Landmark, Music, Piano, Shield, Sigma } from "lucide-react";
import { cn } from "@/lib/utils";
import { BasketballIcon, FootballIcon, HelmetIcon, LaurelIcon } from "../icons";
import { photos } from "../photos";
import { Figure, Reveal, Section, type IconType } from "../ui";

/* ---------- concert constellation ---------- */

type Star = { name: string; x: number; y: number };

const STARS: Star[] = [
  { name: "Drake", x: 8, y: 34 },
  { name: "Lil Wayne", x: 18, y: 14 },
  { name: "Don Toliver", x: 22, y: 52 },
  { name: "Lil Durk", x: 33, y: 30 },
  { name: "Kendrick Lamar", x: 44, y: 12 },
  { name: "SZA", x: 50, y: 46 },
  { name: "Kanye West", x: 60, y: 26 },
  { name: "Lil Tecca", x: 70, y: 10 },
  { name: "24kGoldn", x: 78, y: 44 },
  { name: "Quavo", x: 90, y: 22 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
  [6, 7],
  [6, 8],
  [7, 9],
  [8, 9],
];

const DUST = [
  [4, 8],
  [12, 50],
  [28, 6],
  [38, 52],
  [56, 8],
  [66, 50],
  [84, 6],
  [95, 40],
  [48, 30],
  [74, 30],
] as const;

const H = 60;

function Constellation() {
  return (
    <div className="relative hidden aspect-[100/60] w-full md:block">
      <svg
        viewBox={`0 0 100 ${H}`}
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {EDGES.map(([a, b]) => {
          const from = STARS[a];
          const to = STARS[b];
          if (!from || !to) return null;
          return (
          <line
            key={`${a}-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--color-accent)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.28"
          />
          );
        })}
        {DUST.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="0.35"
            fill="var(--color-foreground)"
            opacity="0.5"
            className="animate-twinkle motion-reduce:animate-none"
            style={{ animationDelay: `${i * 0.45}s` }}
          />
        ))}
      </svg>

      <ul aria-label="Live concerts attended" className="absolute inset-0">
        {STARS.map((s, i) => (
          <li
            key={s.name}
            className="group absolute flex flex-col items-center gap-2"
            style={{ left: `${s.x}%`, top: `${Math.round((s.y / H) * 1000) / 10}%`, transform: "translate(-50%, -6px)" }}
          >
            <span
              aria-hidden="true"
              className="relative grid h-3 w-3 place-items-center"
            >
              <span
                className="absolute inset-0 rounded-full bg-accent/40 blur-[3px] transition-transform duration-300 group-hover:scale-[2.2] motion-reduce:transition-none"
              />
              <span
                className={cn(
                  "relative h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125 motion-reduce:transition-none",
                  i % 3 === 0 ? "bg-lime shadow-[0_0_10px] shadow-lime/80" : "bg-accent shadow-[0_0_10px] shadow-accent/80",
                )}
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            </span>
            <span className="glass-strong whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground transition-colors group-hover:border-accent/60 group-hover:text-accent">
              {s.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- interests bento ---------- */

type Interest = {
  label: string;
  tag: string;
  icon: IconType;
  tone: "cyan" | "blue" | "lime";
};

const INTERESTS: Interest[] = [
  { label: "Piano", tag: "Music", icon: Piano, tone: "cyan" },
  { label: "Mathematics", tag: "Numbers", icon: Sigma, tone: "blue" },
  { label: "Dallas Cowboys", tag: "NFL", icon: FootballIcon, tone: "blue" },
  { label: "Formula 1", tag: "Motorsport", icon: HelmetIcon, tone: "lime" },
  { label: "Board games", tag: "Tabletop", icon: Dices, tone: "cyan" },
  { label: "History", tag: "Reading", icon: Landmark, tone: "blue" },
  { label: "Greek myths", tag: "Reading", icon: LaurelIcon, tone: "lime" },
  { label: "Dystopian novels", tag: "Reading", icon: BookOpen, tone: "cyan" },
  { label: "Chest training", tag: "Gym", icon: Dumbbell, tone: "blue" },
  { label: "Marvel", tag: "Film and comics", icon: Shield, tone: "lime" },
  { label: "Intramural basketball", tag: "Duke intramurals", icon: BasketballIcon, tone: "cyan" },
  { label: "Intramural football", tag: "Duke intramurals", icon: FootballIcon, tone: "blue" },
];

const toneText = {
  cyan: "text-accent",
  blue: "text-primary-bright",
  lime: "text-lime",
} as const;

const toneBg = {
  cyan: "bg-accent/12",
  blue: "bg-primary/22",
  lime: "bg-lime/12",
} as const;

export function Beyond() {
  return (
    <Section
      id="beyond"
      index="06"
      kicker="Beyond the work"
      title={
        <>
          Concerts, Cowboys, <span className="text-gradient">Greek myths</span>, and
          chest training.
        </>
      }
      lede="What Joshua does off the clock. Ten artists seen live, two intramural sports, and a reading list that runs from history to dystopia."
      glowX="20%"
      glowY="40%"
    >
      {/* concerts */}
      <Reveal>
        <div className="glass lumen relative overflow-hidden rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <Music aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="display-medium text-lg text-foreground">Live concerts</h3>
              <p className="mono-label mt-0.5 text-[0.65rem]">Artists seen live</p>
            </div>
          </div>

          <div className="mt-6">
            <Constellation />
            <ul aria-label="Live concerts attended" className="flex flex-wrap gap-2 md:hidden">
              {STARS.map((s, i) => (
                <li
                  key={s.name}
                  className="glass-strong inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      i % 3 === 0 ? "bg-lime" : "bg-accent",
                    )}
                  />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* photo + interests */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <Reveal className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <Figure
            photo={photos.nowBasketball}
            caption="On a Duke basketball court."
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 24rem, 100vw"
            frameClassName="aspect-[3/4]"
          />
        </Reveal>

        <ul
          aria-label="Interests and hobbies"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
        >
          {INTERESTS.map((it, i) => {
            const Icon = it.icon;
            return (
              <Reveal as="li" key={it.label} delay={(i % 4) * 40} className="min-w-0">
                <div className="glass hover-lift group flex h-full min-h-[7.5rem] flex-col justify-between rounded-2xl p-4">
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none",
                      toneBg[it.tone],
                      toneText[it.tone],
                    )}
                  >
                    <Icon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />
                  </span>
                  <div className="mt-4 min-w-0">
                    <p className="display-medium text-[1.02rem] leading-tight text-foreground">
                      {it.label}
                    </p>
                    <p className="mono-label mt-1 text-[0.6rem]">{it.tag}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
