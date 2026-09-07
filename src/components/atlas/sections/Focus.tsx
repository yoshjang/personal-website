import {
  Briefcase,
  Database,
  GraduationCap,
  HeartHandshake,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react";
import { Bullets, IconBadge, Reveal, Section, TiltCard, type IconType } from "../ui";

type Stop = { id: string; label: string; icon: IconType; text: string };

const STOPS: Stop[] = [
  {
    id: "energy",
    label: "Energy",
    icon: Sun,
    text: "Thin-film and perovskite solar cells, redox-flow batteries, and nanofabrication across five research settings.",
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    text: "RNA-seq processing in R, device characterization, and now statistical science with a data science concentration.",
  },
  {
    id: "finance",
    label: "Finance",
    icon: TrendingUp,
    text: "A question about how strategy and capital help technologies scale, followed by M&A and venture analyst work.",
  },
  {
    id: "community",
    label: "Community",
    icon: HeartHandshake,
    text: "Toledo Minds, class leadership, and church service, which shaped how he wants to use analytical work.",
  },
];

const NOW = [
  {
    icon: GraduationCap,
    label: "Studying",
    tone: "cyan" as const,
    items: [
      "B.S. in Statistical Science, Data Science concentration",
      "Financial Economics minor",
      "Duke University, expected May 2029",
    ],
  },
  {
    icon: Briefcase,
    label: "Working, Summer 2026",
    tone: "blue" as const,
    items: [
      "M&A Analyst, Wood Creek Advisors",
      "Venture Capital Analyst, CoreNetwork Fund",
    ],
  },
  {
    icon: Users,
    label: "Leading",
    tone: "lime" as const,
    items: [
      "VP of Operations, Asian Leadership Initiative",
      "New-Member Committee, Alpha Kappa Psi",
      "Small-group leader, Asian InterVarsity",
    ],
  },
];

export function Focus() {
  return (
    <Section
      id="focus"
      index="01"
      kicker="Through-line"
      title={
        <>
          Energy research raised a question about{" "}
          <span className="text-gradient">capital</span>.
        </>
      }
      lede="Joshua started in labs: solar cells, batteries, cleanrooms. That technical work led to curiosity about how strategy and capital help companies and technologies scale. Community leadership, in Toledo and at Duke, shaped the desire to use analytical work responsibly."
      glowX="10%"
    >
      {/* connected stops */}
      <Reveal>
        <ol
          aria-label="How the themes connect"
          className="relative grid gap-4 md:grid-cols-4"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-8 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-lime via-accent to-primary-bright opacity-60 md:block"
          />
          {STOPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.id} className="relative">
                <div className="glass hover-lift relative h-full rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <span className="relative grid h-7 w-7 place-items-center rounded-full border border-accent/50 bg-background">
                      <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px] shadow-accent/80" />
                    </span>
                    <span className="mono-label text-[0.65rem]">Stop 0{i + 1}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2.5">
                    <Icon aria-hidden="true" className="h-5 w-5 text-accent" />
                    <h3 className="display-medium text-xl text-foreground">{s.label}</h3>
                  </div>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>

      {/* current focus */}
      <div className="mt-14">
        <Reveal>
          <h3 className="mono-label">Current focus</h3>
        </Reveal>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {NOW.map((n, i) => (
            <Reveal key={n.label} delay={i * 80}>
              <TiltCard className="h-full rounded-2xl">
                <article className="glass lumen h-full rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={n.icon} tone={n.tone} />
                    <h4 className="display-medium text-lg text-foreground">{n.label}</h4>
                  </div>
                  <Bullets className="mt-5" items={n.items} />
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
