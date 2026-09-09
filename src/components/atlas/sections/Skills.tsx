import { Award, Code2, Database, Languages, LineChart } from "lucide-react";
import { Chip, IconBadge, Reveal, Section, type IconType } from "../ui";

type Group = {
  icon: IconType;
  tone: "cyan" | "blue" | "lime";
  label: string;
  note: string;
  items: string[];
};

const GROUPS: Group[] = [
  {
    icon: Database,
    tone: "blue",
    label: "Transaction and market data",
    note: "Used for sourcing, screening, and comparables in analyst work.",
    items: ["Capital IQ", "PitchBook", "LSEG Refinitiv", "Grata", "Orbis", "ZoomInfo"],
  },
  {
    icon: LineChart,
    tone: "cyan",
    label: "Analytical practice",
    note: "Experience, not certification.",
    items: [
      "Financial modeling",
      "Investor reporting",
      "Precedent transaction analysis",
      "Quantitative research",
      "RNA-seq processing in R",
      "Solar cell characterization",
    ],
  },
  {
    icon: Code2,
    tone: "lime",
    label: "Build and media",
    note: "Websites, workflows, and video.",
    items: ["Astro", "Tailwind CSS", "Airtable", "Adobe Premiere Pro"],
  },
  {
    icon: Languages,
    tone: "cyan",
    label: "Languages",
    note: "Both conversational.",
    items: ["Spanish, conversational", "Mandarin, conversational"],
  },
];

export function Skills() {
  return (
    <Section
      id="skills"
      className="prototype-skills"
      index="07"
      kicker="Skills and languages"
      title="The toolkit, stated plainly."
      lede="Tools he has used in real work, practices he has repeated, and the two languages he can hold a conversation in."
      glowX="80%"
      glowY="60%"
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {GROUPS.map((g, i) => (
          <Reveal as="li" key={g.label} delay={i * 60}>
            <div className="glass hover-lift flex h-full flex-col rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <IconBadge icon={g.icon} tone={g.tone} />
                <div>
                  <h3 className="display-medium text-lg text-foreground">{g.label}</h3>
                  <p className="mt-0.5 text-[0.82rem] text-muted-foreground">{g.note}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <Chip key={it} tone={g.tone}>
                    {it}
                  </Chip>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        <Reveal as="li" delay={240} className="md:col-span-2">
          <div className="glass lumen lumen-lime flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <IconBadge icon={Award} tone="lime" className="h-12 w-12 rounded-2xl" />
              <div>
                <p className="mono-label text-lime">Certification</p>
                <h3 className="display-medium mt-1 text-lg text-foreground">
                  Wall Street Prep Financial and Valuation Modeling
                </h3>
              </div>
            </div>
            <p className="max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
              The one formal credential listed here. Everything else on this page
              is described as experience.
            </p>
          </div>
        </Reveal>
      </ul>
    </Section>
  );
}
