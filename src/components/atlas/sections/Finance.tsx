import { Briefcase, LineChart } from "lucide-react";
import { Bullets, Chip, IconBadge, Reveal, Section, TiltCard } from "../ui";

const ROLES = [
  {
    icon: Briefcase,
    tone: "blue" as const,
    org: "Wood Creek Advisors",
    role: "M&A Analyst",
    when: "Summer 2026",
    summary:
      "Buy-side advisory for two clients: The Fremont Company, a specialty food manufacturer, and Seneca Label & Packaging, a commercial label-printing company.",
    points: [
      "Sourced about 30 acquisition targets that received serious review",
      "Built an Airtable and Claude sourcing workflow that the firm adopted",
      "Prepared a General Press tax-return summary used in live diligence",
    ],
    tools: ["Airtable", "Claude", "Capital IQ", "PitchBook", "Grata", "Orbis", "ZoomInfo", "LSEG Refinitiv"],
  },
  {
    icon: LineChart,
    tone: "cyan" as const,
    org: "CoreNetwork Fund",
    role: "Venture Capital Analyst",
    when: "Summer 2026",
    summary:
      "Investor communications, a website redesign, and support for a Satelytics capital raise or sale at a Midwest technology venture fund.",
    points: [
      "Wrote much of the Q1 2026 investor report sent to about 50 limited partners",
      "Covered Cycle, 7Signal, Astronomer, Enosix, and Satelytics",
      "Built the CoreNetwork Fund website with Astro and Tailwind CSS",
      "Comparable-transaction and investment-bank research",
    ],
    tools: ["Investor reporting", "Comparable transactions", "Astro", "Tailwind CSS"],
  },
];

export function Finance() {
  return (
    <Section
      id="finance"
      className="prototype-experience"
      index="05"
      kicker="Finance experience"
      title={
        <>
          Two analyst seats, <span className="text-gradient">Summer 2026</span>.
        </>
      }
      lede="An M&A advisory firm and a venture fund, both in Summer 2026. Sourcing, diligence support, investor reporting, and research."
      glowX="50%"
      glowY="0%"
    >
      <div className="prototype-roles grid gap-5 lg:grid-cols-2">
        {ROLES.map((r, i) => (
          <Reveal key={r.org} delay={i * 90} className="h-full">
            <TiltCard className="h-full rounded-2xl" max={3}>
              <article className="prototype-role glass lumen flex h-full flex-col rounded-2xl p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <IconBadge icon={r.icon} tone={r.tone} className="h-12 w-12 rounded-2xl" />
                  <div className="min-w-0">
                    <h3 className="display-medium text-2xl text-foreground">{r.org}</h3>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-primary-bright">{r.role}</span>
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />
                      <span className="mono-label normal-case tracking-[0.08em]">{r.when}</span>
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-[0.98rem] leading-relaxed text-foreground/90">{r.summary}</p>

                <Bullets className="mt-5" items={r.points} />

                <div className="mt-auto pt-6">
                  <p className="mono-label text-[0.65rem]">Worked with</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {r.tools.map((t) => (
                      <Chip key={t} tone={r.tone}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
