import { createFileRoute } from "@tanstack/react-router";
import { ChapterNav, type Chapter } from "@/components/site/ChapterNav";
import {
  ChapterSection,
  FactCard,
  NoteList,
  Para,
  RoleCard,
} from "@/components/site/Chapter";
import { Figure } from "@/components/site/Figure";
import { photos } from "@/components/site/photos";

const SITE_URL = "https://joshwang.app/";
const TITLE = "Joshua Wang | Statistics, Sustainability, and Service";
const DESCRIPTION =
  "The story of Joshua Wang: a Duke statistical science student whose work spans piano and math competitions, solar and energy research, nonprofit service in Toledo, and the financing side of sustainability.";
const OG_IMAGE = "https://joshwang.app/photos/hero-portrait.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Joshua Wang",
          email: "mailto:joshua.wang@duke.edu",
          url: SITE_URL,
          image: OG_IMAGE,
          sameAs: ["https://www.linkedin.com/in/-joshua-wang-/"],
          alumniOf: "Maumee Valley Country Day School",
          affiliation: "Duke University",
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

        {/* 01 */}
        <ChapterSection
          id="early-life"
          number="01"
          kicker="Toledo, Ohio"
          title="Piano competitions and math competitions, at the same time"
          aside={
            <Figure
              photo={photos.earlyLifeAward}
              caption="An early competition award."
              sizes="(min-width: 1024px) 22rem, 100vw"
              frameClassName="aspect-[3/4]"
            />
          }
        >
          <Para>
            Joshua grew up in Toledo, Ohio, competing in piano and in
            mathematics. He took first place in the Gene Marcus Piano
            Competition at Purdue University.
          </Para>
          <Para>
            In mathematics he finished first in the Ohio Mathematics Contest and
            qualified for the MathCounts state competition multiple times.
          </Para>
          <NoteList
            heading="Early results"
            items={[
              "First place, Gene Marcus Piano Competition at Purdue",
              "First place, Ohio Mathematics Contest",
              "Multiple-time MathCounts state qualifier",
            ]}
          />
        </ChapterSection>

        {/* 02 */}
        <ChapterSection
          id="high-school"
          number="02"
          kicker="Maumee Valley Country Day School"
          title="Class president, distance runner, cashier"
          tinted
          after={<HighSchoolGallery />}
        >
          <Para>
            At Maumee Valley Country Day School, Joshua took 14 AP tests with an
            average score of 4, earned a 1600 SAT, and held the highest GPA in
            the school. He was a National Merit Finalist, a Presidential Scholars
            Candidate, a Seal of Biliteracy recipient in Spanish, and received
            the Outstanding Senior Athlete Award.
          </Para>
          <Para>
            As Class President he raised more than $6,000 through six fundraising
            campaigns, including designing custom clothing and connecting with
            local businesses. He organized and funded Prom 2024 for more than 200
            students, overseeing budgeting for decorations and vendor
            coordination, led weekly student government and prom committee
            meetings, and managed the official class social media account to more
            than 30,000 monthly views.
          </Para>
          <Para>
            He was the single student in his grade selected for Alumni Council,
            where he hosted alumni and student events, served as the student
            voice at bimonthly council meetings, and raised awareness of alumni
            activity through assemblies. He also took part in robotics and
            Science Olympiad, placing at regionals.
          </Para>
          <Para>
            In track he was three-time all-conference, a six-time district
            finalist, a two-time regional finalist, and a two-time state
            qualifier, set two school records, and received Most Improved. He
            also played basketball and soccer, and worked as a cashier at Three
            Happiness and at Raising Cane&rsquo;s.
          </Para>
          <NoteList
            heading="On the record"
            items={[
              "14 AP tests, average score of 4",
              "1600 SAT and the highest GPA in the school",
              "National Merit Finalist and Presidential Scholars Candidate",
              "Seal of Biliteracy in Spanish",
              "Class President and Outstanding Senior Athlete Award",
              "More than $6,000 raised across six campaigns",
              "Prom 2024 organized and funded for 200+ students",
              "Two school records in track; two-time state qualifier",
            ]}
          />
        </ChapterSection>

        {/* 03 */}
        <ChapterSection
          id="research"
          number="03"
          kicker="Labs and summer programs"
          title="Five labs, and an interest in solar energy"
          aside={
            <div className="space-y-6">
              <Figure
                photo={photos.researchLab}
                sizes="(min-width: 1024px) 22rem, 100vw"
                frameClassName="aspect-[3/4]"
              />
              <Figure
                photo={photos.researchNano}
                caption="Program certificate ceremony, ESAP nanotechnology."
                sizes="(min-width: 1024px) 22rem, 100vw"
                frameClassName="aspect-[4/3]"
              />
            </div>
          }
          after={<ResearchDetail />}
        >
          <Para>
            Joshua worked across five research settings. Through ESAP he studied
            nanotechnology with Professor Kim, learned cleanroom etiquette and
            techniques, and researched and presented on lithography, quantum
            dots, and microfluidics.
          </Para>
          <Para>
            At First Solar he supported CdTe thin-film solar cell development,
            conducting surface photovoltage, electroluminescence, infrared
            light-induced thermography, and spin-coating deposition across more
            than 60 production samples, and operating optical microscopy to
            inspect thin-film layers and identify defects.
          </Para>
          <Para>
            In bioinformatics he coauthored a manuscript, &ldquo;Shared and
            Unique Transcriptional Changes in the Orbitofrontal Cortex in
            Psychiatric Disorders and Suicide,&rdquo; published in the peer
            reviewed Translational Journal of Medical Sciences. He used R to
            process RNA-seq data covering more than 200,000 gene expression
            calculations from 60 postmortem brain samples, quantified the top 100
            differentially expressed genes, performed pathway enrichment
            analysis, and drafted the abstract and generated figures including
            heatmaps, pathway enrichment plots, and Venn analyses.
          </Para>
          <Para>
            Through these projects he developed an interest in sustainability and
            renewable energy, and in solar panels in particular.
          </Para>
        </ChapterSection>

        {/* 04 */}
        <ChapterSection
          id="toledo-minds"
          number="04"
          kicker="Nonprofit work and church"
          title="A STEM camp, a basketball workshop, and Sunday rice"
          tinted
          after={<ToledoGallery />}
        >
          <Para>
            Joshua personally filed Toledo Minds for 501(c)(3) nonprofit status
            and directed a week-long STEM education camp and a winter reunion for
            more than 30 children annually in underserved communities.
          </Para>
          <Para>
            He supervised marketing and financial operations through the
            organization&rsquo;s official social media accounts, connected with
            four local school districts, and coordinated the annual community
            fundraiser.
          </Para>
          <Para>
            He also volunteered with the Boys &amp; Girls Club and taught
            basketball to children at a local Chinese school. At church he
            prepared rice for a congregation of more than 100 every week and
            instructed children to do the same, and served as pianist, presider,
            worship leader, slideshow operator, mentor for younger generations,
            and group leader for the annual VBS summer camp of more than 50
            children.
          </Para>
          <Para>
            He was baptized on Easter 2022. He attended Urbana 2025 and hopes to
            do missions in China at some point.
          </Para>
        </ChapterSection>

        {/* 05 */}
        <ChapterSection
          id="now"
          number="05"
          kicker="Duke University"
          title="Statistical science, and the financing side of sustainability"
          aside={
            <Figure
              photo={photos.nowDukeGroup}
              caption="Alpha Kappa Psi group photo at Duke."
              sizes="(min-width: 1024px) 22rem, 100vw"
              frameClassName="aspect-[4/3]"
            />
          }
          after={<NowGallery />}
        >
          <Para>
            Joshua is a rising sophomore at Duke University, majoring in
            statistical science and minoring in financial economics. He is a
            small group leader for Asian InterVarsity and serves on the new
            member committee for Alpha Kappa Psi.
          </Para>
          <Para>
            He has developed an interest in the strategy and financing side of
            sustainability. In summer 2026 he held two finance internships.
          </Para>

          <div className="mt-10 space-y-10">
            <RoleCard
              org="Wood Creek Advisors"
              role="M&amp;A Analyst Intern"
              dates="May 2026 to August 2026"
            >
              <Para>
                Joshua supported buy-side acquisition sourcing and execution for
                two clients: The Fremont Company, a specialty food manufacturer,
                and Seneca Label &amp; Packaging, a commercial label-printing
                company. He ran company searches across Capital IQ, ZoomInfo,
                Orbis, Grata, PitchBook, and LSEG Refinitiv, helped build master
                databases containing approximately 22,000 unique companies, and
                presented approximately 10 seriously reviewed acquisition targets
                to the clients each week.
              </Para>
              <Para>
                He designed and built Airtable and AI deal-tracking databases
                that the managing partner adopted as the firm&rsquo;s primary
                internal sourcing system, then transferred ownership of both
                before the internship ended. On the analysis side he built a
                historical three-statement model and an EBITDA bridge for Safie
                Foods, a seven-transaction precedent analysis for Yost Foods and
                comparable spice and flavoring companies, and a General Press
                financial summary used during a live acquisition process. When
                automated tools returned unreliable contact data, he manually
                identified 30 verified contacts across 10 food-sector investment
                banks.
              </Para>
            </RoleCard>

            <RoleCard
              org="CoreNetwork Fund"
              role="Venture Capital Intern"
              dates="May 2026 to present"
            >
              <Para>
                At CoreNetwork Fund, a Midwest technology-focused venture fund in
                Toledo, Joshua authored most of the Q1 and Q2 2026 investor
                newsletters distributed to approximately 50 limited partners and
                investors, covering Cycle, 7Signal, Astronomer, Enosix, and
                Satelytics.
              </Para>
              <Para>
                He led the redesign and development of the fund&rsquo;s public
                website using Astro and Tailwind CSS and deployed it on portfolio
                company Cycle&rsquo;s container infrastructure, documenting a
                repeatable release process. He supported a potential $30M to $50M
                Satelytics capital raise or strategic sale by researching more
                than 30 investment banks, managing outreach and relationships
                across 11 banks and advisory firms, coordinating NDAs and
                diligence materials, attending valuation pitches, and completing
                comparable-company and precedent-transaction analyses. He also
                rebuilt a full record of capital calls and distributions and
                identified two distributions omitted from investor statements.
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
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="chapter-label">
              Duke Statistical Science &middot; Financial Economics
            </p>
            <h1
              id="intro-heading"
              className="display-title mt-5 text-[3.25rem] leading-[0.95] text-foreground sm:text-7xl"
            >
              Joshua
              <br />
              Wang
            </h1>
            <p className="prose-narrative mt-7 text-lg sm:text-xl">
              A rising sophomore at Duke University from Toledo, Ohio. His work
              so far spans piano and math competitions, student government and
              distance running, solar and energy research, nonprofit and church
              service, and the strategy and financing side of sustainability.
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
          </div>

          <Figure
            photo={photos.heroPortrait}
            caption="Toledo, Ohio to Durham, North Carolina."
            priority
            sizes="(min-width: 1024px) 34rem, 100vw"
            frameClassName="aspect-square"
          />
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

function HighSchoolGallery() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Figure
          photo={photos.hsGraduation}
          caption="Graduation, 2024."
          sizes="(min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[3/4]"
        />
        <Figure
          photo={photos.hsTrackMedals}
          caption="Track and field."
          sizes="(min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[3/4]"
        />
        <Figure
          photo={photos.hsClassEvent}
          caption="A class event organized as Class President."
          sizes="(min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[3/4]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Figure
          photo={photos.hsTrackTeam}
          caption="With teammates after a track meet."
          sizes="(min-width: 640px) 34rem, 100vw"
          frameClassName="aspect-[4/3]"
        />
        <Figure
          photo={photos.hsSoccer}
          caption="Soccer."
          sizes="(min-width: 640px) 34rem, 100vw"
          frameClassName="aspect-[4/3]"
        />
      </div>
    </div>
  );
}

function ResearchDetail() {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <Figure
          photo={photos.researchCleanroom}
          caption="Cleanroom work."
          sizes="(min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[3/4]"
        />
        <Figure
          photo={photos.researchSolar}
          caption="Glovebox sample preparation."
          sizes="(min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[3/4]"
        />
        <Figure
          photo={photos.researchEquipment}
          caption="Instrument software during characterization."
          sizes="(min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[3/4]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FactCard label="ESAP nanotechnology">
          Studied nanotechnology with Professor Kim, learned cleanroom etiquette
          and techniques, and presented on lithography, quantum dots, and
          microfluidics.
        </FactCard>
        <FactCard label="First Solar">
          Supported CdTe thin-film solar cell development across more than 60
          production samples using surface photovoltage, electroluminescence,
          infrared thermography, spin-coating deposition, and optical microscopy.
        </FactCard>
        <FactCard label="SSTP redox flow batteries">
          Researched organic redox flow batteries with the Shaw Research Group
          under D3TaLES, running more than 30 cyclic voltammetry and
          rotating-disk electrode trials across five electrolyte concentrations
          and calculating diffusion coefficients and electron transfer rates by
          hand.
        </FactCard>
        <FactCard label="UT RISE">
          Characterized more than 80 perovskite solar cells using J-V,
          electroluminescence, and photoluminescence, performed copper thermal
          deposition for more than 100 device contacts, and CAD-modeled and
          assembled a custom mass spectrometer.
        </FactCard>
      </div>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] sm:items-start">
        <a
          href="/documents/josh-poster.pdf"
          target="_blank"
          rel="noreferrer noopener"
          className="group block rounded-lg focus-visible:outline-2"
        >
          <Figure
            photo={photos.researchPoster}
            sizes="(min-width: 640px) 20rem, 100vw"
            frameClassName="aspect-[4/3] transition-opacity group-hover:opacity-85"
          />
        </a>
        <div>
          <h3 className="chapter-label">Secondary artifact</h3>
          <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-muted-foreground">
            The SSTP redox flow battery findings were presented and defended to
            university chemistry faculty and industry mentors. The poster is
            available as a PDF.
          </p>
          <a
            href="/documents/josh-poster.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-block text-[0.95rem] underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            Open the research poster (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}

function ToledoGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Figure
        photo={photos.toledoGroup}
        caption="STEM camp participants with their certificates."
        sizes="(min-width: 1024px) 36rem, (min-width: 640px) 22rem, 100vw"
        frameClassName="aspect-[16/9]"
        className="lg:col-span-2"
      />
      <Figure
        photo={photos.toledoBasketball}
        caption="Basketball workshop, December 2023."
        sizes="(min-width: 1024px) 18rem, (min-width: 640px) 22rem, 100vw"
        frameClassName="aspect-[4/3]"
      />
      <div className="grid gap-4">
        <Figure
          photo={photos.toledoService}
          caption="Community cleanup volunteering."
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[16/9]"
        />
        <Figure
          photo={photos.toledoBaptism}
          caption="Baptism, Easter 2022."
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 22rem, 100vw"
          frameClassName="aspect-[16/9]"
        />
      </div>
    </div>
  );
}

function NowGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Figure
        photo={photos.nowCampus}
        caption="At a Duke sporting event."
        sizes="(min-width: 640px) 22rem, 100vw"
        frameClassName="aspect-[3/4]"
      />
      <Figure
        photo={photos.nowBasketball}
        caption="On a Duke basketball court."
        sizes="(min-width: 640px) 22rem, 100vw"
        frameClassName="aspect-[3/4]"
      />
      <Figure
        photo={photos.nowFriends}
        caption="With friends on campus."
        sizes="(min-width: 640px) 22rem, 100vw"
        frameClassName="aspect-[3/4]"
      />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="display-title max-w-3xl text-3xl sm:text-4xl">
          Statistics, sustainability, and service.
        </p>
        <div className="mt-10 flex flex-col gap-6 border-t border-background/20 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="display-title text-2xl">Joshua Wang</p>
            <p className="chapter-label mt-2 text-background/60">
              joshwang.app
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <a
              href="mailto:joshua.wang@duke.edu"
              className="text-[0.95rem] underline decoration-background/40 underline-offset-4 transition-colors hover:decoration-background"
            >
              joshua.wang@duke.edu
            </a>
            <a
              href="https://www.linkedin.com/in/-joshua-wang-/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-[0.95rem] underline decoration-background/40 underline-offset-4 transition-colors hover:decoration-background"
            >
              linkedin.com/in/-joshua-wang-
            </a>
            <p className="chapter-label mt-2 text-background/60">
              &copy; {new Date().getFullYear()} Joshua Wang
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
