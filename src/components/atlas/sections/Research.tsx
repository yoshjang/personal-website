import type { ReactNode } from "react";
import {
  ArrowRight,
  Atom,
  Battery,
  Dna,
  FileText,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";
import { LINKS } from "../content";
import { photos } from "../photos";
import { Bullets, Chip, Figure, IconBadge, Reveal, Section, TiltCard, type IconType } from "../ui";

type Lab = {
  icon: IconType;
  org: string;
  group?: string;
  year?: string;
  focus: string;
  summary: ReactNode;
  points: ReactNode[];
  tags: string[];
};

const LABS: Lab[] = [
  {
    icon: Atom,
    org: "ESAP",
    focus: "Nanotechnology",
    summary: "Studied nanotechnology with Professor Kim and learned cleanroom techniques.",
    points: ["Researched lithography, quantum dots, and microfluidics"],
    tags: ["Cleanroom", "Lithography", "Quantum dots"],
  },
  {
    icon: Sun,
    org: "First Solar",
    year: "2023",
    focus: "CdTe thin-film solar cells",
    summary: "Supported cadmium telluride thin-film solar-cell development.",
    points: [
      "Surface photovoltage, electroluminescence, and infrared light-induced thermography",
      "Spin coating and microscopy across more than 60 samples",
    ],
    tags: ["CdTe", "Electroluminescence", "60+ samples"],
  },
  {
    icon: Dna,
    org: "University of Toledo",
    group: "Bioinformatics program",
    year: "2023",
    focus: "RNA-seq analysis",
    summary: "Processed RNA-seq data in R, produced figures and an abstract, and coauthored a paper.",
    points: [
      <>
        Coauthor, &ldquo;Shared and Unique Transcriptional Changes in the
        Orbitofrontal Cortex in Psychiatric Disorders and Suicide&rdquo;
      </>,
    ],
    tags: ["R", "RNA-seq", "Coauthor"],
  },
  {
    icon: Battery,
    org: "University of Iowa",
    group: "SSTP, Shaw Research Group",
    year: "2024",
    focus: "Non-aqueous redox-flow batteries",
    summary: "Investigated non-aqueous redox-flow batteries.",
    points: [
      "More than 30 cyclic-voltammetry and rotating-disk-electrode trials across five electrolyte concentrations",
      "Findings presented as a research poster",
    ],
    tags: ["Cyclic voltammetry", "RDE", "Poster"],
  },
  {
    icon: Zap,
    org: "University of Toledo",
    group: "RISE, Yan Research Group",
    year: "2024",
    focus: "Perovskite solar cells",
    summary: "Characterized perovskite devices and helped build lab instrumentation.",
    points: [
      "Characterized more than 80 perovskite solar cells",
      "Copper thermal deposition for more than 100 contacts",
      "Helped build a custom mass spectrometer",
    ],
    tags: ["Perovskite", "80+ cells", "Mass spec"],
  },
];

export function Research() {
  return (
    <Section
      id="research"
      className="prototype-research"
      index="03"
      kicker="Research and sustainability"
      title={
        <>
          Lab to <span className="text-gradient">capital</span>: five research
          settings, one question.
        </>
      }
      lede="Solar cells, batteries, nanofabrication, and one bioinformatics project. Read left to right: the technical work comes first, and the financing question comes out of it."
      glowX="15%"
      glowY="20%"
    >
      {/* sequence */}
      <ol className="prototype-lab-sequence relative grid gap-4 lg:grid-cols-5 lg:gap-3">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-[2.15rem] hidden h-px bg-gradient-to-r from-lime/70 via-accent/70 to-primary-bright/70 lg:block"
        />
        {LABS.map((lab, i) => {
          const Icon = lab.icon;
          return (
            <Reveal as="li" key={`${lab.org}-${lab.focus}`} delay={i * 60} className="relative">
              <TiltCard className="h-full rounded-2xl" max={4}>
                <article className="glass hover-lift flex h-full flex-col rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-accent/50 bg-background">
                      <Icon aria-hidden="true" className="h-4 w-4 text-accent" />
                    </span>
                    {lab.year ? (
                      <span className="mono-label text-[0.65rem]">{lab.year}</span>
                    ) : null}
                  </div>
                  <h3 className="display-medium mt-4 text-lg text-foreground">{lab.org}</h3>
                  {lab.group ? (
                    <p className="text-[0.85rem] text-primary-bright">{lab.group}</p>
                  ) : null}
                  <p className="mono-label mt-2 normal-case tracking-[0.08em] text-accent">
                    {lab.focus}
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {lab.summary}
                  </p>
                  <Bullets className="mt-3" items={lab.points} />
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {lab.tags.map((t) => (
                      <Chip key={t} className="px-2.5 py-0.5 text-[0.72rem]">
                        {t}
                      </Chip>
                    ))}
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          );
        })}
      </ol>

      {/* bridge to capital */}
      <Reveal className="mt-6">
        <a
          href="#finance"
          className="glass lumen lumen-lime hover-lift group flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="flex items-start gap-4">
            <IconBadge icon={TrendingUp} tone="lime" />
            <div>
              <p className="mono-label text-lime">Where it leads</p>
              <p className="mt-2 max-w-2xl text-[0.98rem] leading-relaxed text-foreground">
                Working on solar cells and batteries raised a question about how
                these technologies get financed and scaled. That question is the
                thread into the finance work below.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 text-[0.9rem] font-semibold text-lime">
            Finance experience
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </a>
      </Reveal>

      {/* photos */}
      <div className="prototype-collage mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <Figure
            photo={photos.researchLab}
            caption="At the bench."
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
            frameClassName="aspect-[3/4]"
          />
        </Reveal>
        <Reveal delay={60}>
          <Figure
            photo={photos.researchCleanroom}
            caption="Cleanroom work."
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
            frameClassName="aspect-[3/4]"
          />
        </Reveal>
        <Reveal delay={120}>
          <Figure
            photo={photos.researchSolar}
            caption="Glovebox sample preparation."
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
            frameClassName="aspect-[3/4]"
          />
        </Reveal>
        <Reveal delay={180} className="grid gap-4">
          <Figure
            photo={photos.researchEquipment}
            caption="Instrument software during characterization."
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
            frameClassName="aspect-[4/3]"
          />
          <Figure
            photo={photos.researchNano}
            caption="Program certificate ceremony, ESAP nanotechnology."
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
            frameClassName="aspect-[4/3]"
          />
        </Reveal>
      </div>

      {/* poster artifact */}
      <Reveal className="prototype-poster mt-8">
        <div className="glass grid gap-6 rounded-2xl p-5 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:items-center sm:p-6">
          <a
            href={LINKS.poster}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open the redox-flow battery research poster (PDF, opens in a new tab)"
            className="group block rounded-2xl"
          >
            <Figure
              photo={photos.researchPoster}
              sizes="(min-width: 640px) 18rem, 100vw"
              frameClassName="aspect-[4/3] transition-opacity group-hover:opacity-90"
            />
          </a>
          <div>
            <div className="flex items-center gap-3">
              <IconBadge icon={FileText} tone="blue" />
              <h3 className="display-medium text-lg text-foreground">Research poster</h3>
            </div>
            <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-muted-foreground">
              The SSTP redox-flow battery findings were presented and defended to
              university chemistry faculty and industry mentors. The poster is
              available as a PDF.
            </p>
            <a
              href={LINKS.poster}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex min-h-10 items-center gap-2 text-[0.95rem] font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-foreground"
            >
              Open the poster (PDF)
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
