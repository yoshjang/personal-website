import { createFileRoute } from "@tanstack/react-router";
import { ChapterNav, type Chapter } from "@/components/site/ChapterNav";
import {
  ChapterSection,
  NoteList,
  Para,
  RoleCard,
} from "@/components/site/Chapter";

const TITLE = "Joshua Wang — Statistics, Sustainability, and Service";
const DESCRIPTION =
  "The story of Joshua Wang: a Duke statistical science student working at the intersection of sustainability, finance, and community service in Toledo and beyond.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Joshua Wang",
          email: "mailto:joshua.wang@duke.edu",
          url: "https://joshwang.app",
          sameAs: ["https://www.linkedin.com/in/-joshua-wang-/"],
          alumniOf: "Maumee Valley Country Day School",
        }),
      },
    ],
  }),
});

const chapters: Chapter[] = [
  { id: "early-life", number: "01", title: "Early Life" },
  { id: "high-school", number: "02", title: "High School" },
  { id: "research", number: "03", title: "Research" },
  { id: "toledo-minds", number: "04", title: "Toledo Minds" },
  { id: "now", number: "05", title: "Now" },
];

function Index() {
  return (
    <div id="top" className="min-h-screen">
      <a
        href="#early-life"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to the story
      </a>

      <ChapterNav chapters={chapters} />

      <main>
        <Opening />
        <ChapterSection
          id="early-life"
          number="01"
          kicker="Toledo, Ohio"
          title="Scales and proofs, side by side"
        >
          <Para>
            Joshua grew up pursuing two disciplines at once: music and
            mathematics. He competed in piano and took first place in the Gene
            Marcus Piano Competition at Purdue.
          </Para>
          <Para>
            Mathematics ran on the same track. He finished first in the Ohio
            Mathematics Contest and qualified for the MathCounts state
            competition multiple times. Practice rooms and problem sets taught
            the same lesson — the patient repetition that turns something hard
            into something familiar.
          </Para>
          <NoteList
            heading="Early markers"
            items={[
              "First place, Gene Marcus Piano Competition at Purdue",
              "First place, Ohio Mathematics Contest",
              "Multiple-time MathCounts state qualifier",
            ]}
          />
        </ChapterSection>

        <ChapterSection
          id="high-school"
          number="02"
          kicker="Maumee Valley Country Day School"
          title="Learning how much a class can carry"
        >
          <Para>
            At Maumee Valley Country Day School, Joshua took 14 AP tests with an
            average score of 4, earned a 1600 SAT, and held the highest GPA in
            the school. He was a National Merit Finalist, a Presidential
            Scholars Candidate, and earned the Seal of Biliteracy in Spanish.
          </Para>
          <Para>
            He served as Class President and received the Outstanding Senior
            Athlete Award. Leading the class meant budgets and logistics as much
            as ceremony: he raised more than $6,000 across six fundraising
            campaigns, organized and funded Prom 2024 for more than 200
            students, and ran the class social media account to more than 30,000
            monthly views. Outside of student government he took part in
            robotics, Science Olympiad, and Alumni Council.
          </Para>
          <Para>
            Track was where the long-term work showed most clearly. He was
            three-time all-conference, a six-time district finalist, a two-time
            regional finalist, and a two-time state qualifier, set two school
            records, and received Most Improved. He also played basketball and
            soccer, and worked at Three Happiness and Raising Cane&rsquo;s.
          </Para>
          <NoteList
            heading="On the record"
            items={[
              "14 AP tests, average score of 4",
              "1600 SAT; highest GPA in the school",
              "National Merit Finalist; Presidential Scholars Candidate",
              "Seal of Biliteracy in Spanish",
              "Class President; Outstanding Senior Athlete Award",
              "More than $6,000 raised across six campaigns",
              "Prom 2024 organized and funded for 200+ students",
              "Two school records in track; two-time state qualifier",
            ]}
          />
        </ChapterSection>

        <ChapterSection
          id="research"
          number="03"
          kicker="Labs and programs"
          title="Following a question into sustainability"
        >
          <Para>
            Joshua&rsquo;s research years were less a single project than a
            sequence of rooms, each one narrowing the question. He studied
            nanotechnology through ESAP with Professor Kim, then worked on CdTe
            thin-film solar cells at First Solar.
          </Para>
          <Para>
            He conducted bioinformatics research involving RNA-seq analysis,
            studied redox flow batteries through SSTP, and worked on perovskite
            solar cells and mass spectrometry through UT RISE. Different
            materials, different instruments — but the through line was energy:
            how it is captured, stored, and made cheap enough to matter.
          </Para>
          <Para>
            That accumulation is what pointed him toward sustainability and
            renewable energy, and toward solar technology in particular. No
            single poster was the turning point; the interest is the sum.
          </Para>
          <NoteList
            heading="Where the work happened"
            items={[
              "Nanotechnology — ESAP, with Professor Kim",
              "CdTe thin-film solar cells — First Solar",
              "Bioinformatics, RNA-seq analysis",
              "Redox flow batteries — SSTP",
              "Perovskite solar cells and mass spectrometry — UT RISE",
            ]}
          />
        </ChapterSection>

        <ChapterSection
          id="toledo-minds"
          number="04"
          kicker="Service"
          title="Building something that stays"
        >
          <Para>
            Joshua filed for 501(c)(3) nonprofit status for Toledo Minds and
            directed a STEM camp and winter reunion serving more than 30
            children annually. The work was unglamorous and total: marketing,
            finances, school-district outreach, and fundraising.
          </Para>
          <Para>
            His community work extended past the organization — volunteering
            with the Boys &amp; Girls Club and teaching basketball at a local
            Chinese school.
          </Para>
          <Para>
            Faith is part of the same story. Joshua serves at his church and was
            baptized on Easter 2022. He attended Urbana 2025 and holds an
            interest in missions in China.
          </Para>
          <NoteList
            heading="Service commitments"
            items={[
              "Toledo Minds — filed for 501(c)(3) status",
              "STEM camp and winter reunion, 30+ children annually",
              "Marketing, finances, district outreach, fundraising",
              "Boys & Girls Club volunteering",
              "Teaching basketball at a local Chinese school",
              "Church service; baptized Easter 2022; Urbana 2025",
            ]}
          />
        </ChapterSection>

        <ChapterSection
          id="now"
          number="05"
          kicker="Duke University"
          title="The financing side of the problem"
        >
          <Para>
            Joshua is a rising sophomore at Duke, majoring in statistical
            science and minoring in financial economics. He serves as a small
            group leader for Asian InterVarsity and is part of Alpha Kappa
            Psi&rsquo;s new member committee.
          </Para>
          <Para>
            His current intellectual focus has shifted one step upstream from
            the lab: the strategy and financing side of sustainability — how
            capital decides which technologies actually get built. In summer
            2026 he completed two finance internships.
          </Para>

          <div className="mt-10 space-y-10">
            <RoleCard org="Wood Creek Advisors" role="M&A Analyst Intern">
              <Para>
                Joshua supported buy-side advisory work for The Fremont Company
                and Seneca Label &amp; Packaging, working across Capital IQ,
                ZoomInfo, Orbis, Grata, PitchBook, and LSEG Refinitiv. He
                sourced about 30 acquisition targets that received serious
                review, built an Airtable and Claude workflow the firm adopted,
                and prepared a General Press tax-return summary for live
                diligence.
              </Para>
            </RoleCard>

            <RoleCard org="CoreNetwork Fund" role="Venture Capital Intern">
              <Para>
                He supported investor communications, a website redesign, and
                Satelytics capital raise or sale work. He authored much of the
                Q1 2026 investor report sent to about 50 limited partners,
                covering Cycle, 7Signal, Astronomer, Enosix, and Satelytics. He
                also built the CoreNetwork Fund website with Astro and Tailwind
                CSS, and researched comparable transactions and investment
                banks.
              </Para>
            </RoleCard>
          </div>
        </ChapterSection>
      </main>

      <SiteFooter />
    </div>
  );
}

function Opening() {
  return (
    <section aria-labelledby="intro-heading" className="paper-grain">
      <div className="mx-auto max-w-5xl px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <p className="chapter-label">Toledo, Ohio &middot; Durham, North Carolina</p>
        <h1
          id="intro-heading"
          className="display-title mt-5 max-w-3xl text-4xl text-foreground sm:text-5xl md:text-6xl"
        >
          Joshua Wang
        </h1>
        <p className="prose-narrative mt-6 text-lg sm:text-xl">
          A Duke student in statistical science and financial economics,
          working from solar labs toward the strategy and financing side of
          sustainability — with most of his hours outside class spent on
          service in Toledo.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="#early-life"
            className="chapter-label rounded-full border border-primary/30 px-4 py-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Read the story
          </a>
          <a
            href="mailto:joshua.wang@duke.edu"
            className="text-[0.95rem] text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            joshua.wang@duke.edu
          </a>
          <a
            href="https://www.linkedin.com/in/-joshua-wang-/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-[0.95rem] text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            LinkedIn
          </a>
        </div>

        <ol
          aria-label="Chapter overview"
          className="mt-14 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-5"
        >
          {chapters.map((c) => (
            <li key={c.id} className="bg-background">
              <a
                href={`#${c.id}`}
                className="flex h-full flex-col gap-1 px-4 py-4 transition-colors hover:bg-secondary/60"
              >
                <span className="chapter-label">{c.number}</span>
                <span className="display-title text-base text-foreground">
                  {c.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="display-title text-2xl text-foreground">Joshua Wang</p>
          <p className="mt-2 text-[0.95rem] text-muted-foreground">
            Happy to talk about sustainability, statistics, or Toledo.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <a
            href="mailto:joshua.wang@duke.edu"
            className="text-[0.95rem] underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            joshua.wang@duke.edu
          </a>
          <a
            href="https://www.linkedin.com/in/-joshua-wang-/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-[0.95rem] underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            linkedin.com/in/-joshua-wang-
          </a>
          <p className="chapter-label mt-2">
            &copy; {new Date().getFullYear()} Joshua Wang
          </p>
        </div>
      </div>
    </footer>
  );
}
