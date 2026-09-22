import { FlaskConical, Presentation, Workflow } from "lucide-react";
import { IconBadge, Reveal, Section, type IconType } from "../ui";

type Step = { label: string; text: string };

type CaseStudy = {
  icon: IconType;
  tone: "cyan" | "blue" | "lime";
  context: string;
  title: string;
  steps: Step[];
};

const CASES: CaseStudy[] = [
  {
    icon: Workflow,
    tone: "blue",
    context: "Wood Creek Advisors · M&A Analyst · Summer 2026",
    title: "A sourcing workflow the firm kept",
    steps: [
      {
        label: "Problem",
        text: "Two lower-middle-market buy-side clients needed a steady flow of qualified acquisition targets, and manual sourcing could not keep up.",
      },
      {
        label: "Action",
        text: "Built a firm-wide Airtable database with an AI-integrated workflow for enrichment, deduplication, and pipeline exports, plus a personal 10-point scoring screen across Capital IQ, PitchBook, and Grata.",
      },
      {
        label: "Output",
        text: "About 10 qualified targets presented weekly to each client, screened out of 22,000 unique companies.",
      },
      {
        label: "Result",
        text: "The firm adopted the workflow, overall sourcing time dropped 8x, and both processes reached LOI at roughly $5M enterprise value each.",
      },
    ],
  },
  {
    icon: Presentation,
    tone: "cyan",
    context: "CoreNetwork Fund · Venture Capital Analyst · Summer 2026",
    title: "Investor reporting and a $70M sale process",
    steps: [
      {
        label: "Problem",
        text: "A Midwest venture fund owed more than 40 limited partners clear quarterly reporting while a $70M geospatial analytics portfolio company prepared a strategic sale or capital raise.",
      },
      {
        label: "Action",
        text: "Synthesized board decks, financial results, and company materials into the Q1 and Q2 investor reports covering five portfolio companies, and supported a nine-bank sell-side advisor bake-off with diligence materials and valuation research.",
      },
      {
        label: "Output",
        text: "Reports distributed to 40+ LPs, three finalist banks presented to the founding partner, and a roughly 50% EBITDA overstatement caught and corrected in an advisor valuation.",
      },
      {
        label: "Result",
        text: "Decision-ready materials for the founding partner and cleaner numbers in front of potential buyers.",
      },
    ],
  },
  {
    icon: FlaskConical,
    tone: "lime",
    context: "Five research settings · 2022 to 2024 · The through-line",
    title: "From the lab bench to finance",
    steps: [
      {
        label: "Problem",
        text: "Years of solar-cell and battery research produced real technical results, but raised a bigger question: how do technologies like these actually get financed and scaled?",
      },
      {
        label: "Action",
        text: "Characterized more than 80 perovskite solar cells, ran 30+ redox-flow battery trials that improved the best formulation's electron-transfer rate 55x, then moved to Duke's statistical science program with a financial economics minor.",
      },
      {
        label: "Output",
        text: "A coauthored paper, a research poster defended to university faculty and industry mentors, and a working command of the data tools behind market analysis.",
      },
      {
        label: "Result",
        text: "The question became a direction: M&A and venture analyst seats in Summer 2026, with investment banking recruiting now underway.",
      },
    ],
  },
];

export function CaseWork({ index = "02" }: { index?: string }) {
  return (
    <Section
      id="casework"
      className="prototype-casework"
      index={index}
      kicker="Case studies"
      title={
        <>
          Three work stories, <span className="text-gradient">problem to result</span>.
        </>
      }
      lede="What the summer analyst work actually looked like, and where it came from. Client names are anonymized for confidentiality."
      glowX="20%"
      glowY="20%"
    >
      <div className="grid gap-5">
        {CASES.map((c, i) => (
          <Reveal key={c.title} delay={i * 70}>
            <article className="glass lumen rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <IconBadge icon={c.icon} tone={c.tone} className="h-12 w-12 rounded-2xl" />
                <div className="min-w-0">
                  <h3 className="display-medium text-2xl text-foreground">{c.title}</h3>
                  <p className="mono-label mt-1.5 normal-case tracking-[0.08em]">{c.context}</p>
                </div>
              </div>
              <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {c.steps.map((s) => (
                  <li
                    key={s.label}
                    className="rounded-xl border border-border/60 bg-background/50 p-4"
                  >
                    <p className="mono-label text-[0.65rem] text-accent">{s.label}</p>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-foreground/90">
                      {s.text}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
