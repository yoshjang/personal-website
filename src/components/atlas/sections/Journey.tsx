import type { ReactNode } from "react";
import {
  Crown,
  GraduationCap,
  Handshake,
  MapPin,
  Piano,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { photos, type Photo } from "../photos";
import { DetailCard, Figure, Reveal, Section, type IconType } from "../ui";

type Stop = {
  marker: string;
  icon: IconType;
  tone: "cyan" | "blue" | "lime" | "default";
  title: string;
  role?: string;
  meta?: string;
  summary: ReactNode;
  details?: ReactNode[];
  photos?: { photo: Photo; caption?: string; frame: string }[];
};

const STOPS: Stop[] = [
  {
    marker: "Toledo",
    icon: Piano,
    tone: "cyan",
    title: "Piano and mathematics",
    meta: "Early years, Toledo, Ohio",
    summary:
      "Piano and mathematics competitions before high school.",
    details: [
      "First place, Gene Marcus Piano Competition at Purdue University",
      "First place, Ohio Mathematics Contest",
      "Multiple MathCounts state qualifications",
    ],
    photos: [
      { photo: photos.earlyLifeAward, caption: "An early competition award.", frame: "aspect-[3/4]" },
    ],
  },
  {
    marker: "2025",
    icon: GraduationCap,
    tone: "blue",
    title: "Maumee Valley Country Day School",
    meta: "Through 2025",
    summary: "Academic record at graduation.",
    details: [
      "1600 SAT",
      "Highest GPA in the school, 4.38",
      "14 AP exams",
      "National Merit Finalist",
      "U.S. Presidential Scholar Candidate",
      "Seal of Biliteracy in Spanish",
      "Outstanding Senior Athlete Award",
    ],
    photos: [{ photo: photos.hsGraduation, caption: "Graduation.", frame: "aspect-[3/4]" }],
  },
  {
    marker: "2022",
    icon: Crown,
    tone: "lime",
    title: "Class President",
    meta: "2022 to 2025",
    summary:
      "Three years of fundraising, event planning, vendor coordination, and class communication.",
    details: [
      "Led fundraisers that raised more than $6,000",
      "Organized Prom for more than 200 students",
      "Coordinated vendors and local businesses",
      "Managed a class social account reaching more than 30,000 monthly views",
    ],
    photos: [
      {
        photo: photos.hsClassEvent,
        caption: "At a Maumee Valley class event.",
        frame: "aspect-[3/2]",
      },
    ],
  },
  {
    marker: "Council",
    icon: Handshake,
    tone: "cyan",
    title: "Alumni Council",
    meta: "Sole student from his grade selected",
    summary:
      "The student voice on the school's alumni council.",
    details: [
      "Hosted alumni and student events",
      "Represented students in bimonthly meetings",
      "Promoted alumni activities to the student body",
    ],
  },
  {
    marker: "Track",
    icon: Timer,
    tone: "blue",
    title: "Varsity track captain",
    meta: "Sprinter",
    summary:
      "Captain of the varsity track team. Also played basketball and soccer.",
    details: [
      "District and regional finalist appearances",
      "State qualifications",
      "Two school records",
    ],
    photos: [
      { photo: photos.hsTrackMedals, caption: "Track and field.", frame: "aspect-[3/2]" },
      {
        photo: photos.hsTrackTeam,
        caption: "With track teammates.",
        frame: "aspect-[4/3]",
      },
      { photo: photos.hsSoccer, caption: "Soccer.", frame: "aspect-[3/2]" },
    ],
  },
  {
    marker: "Duke",
    icon: MapPin,
    tone: "lime",
    title: "Duke University",
    meta: "Durham, North Carolina. Expected May 2029",
    summary:
      "B.S. in Statistical Science with a Data Science concentration and a Financial Economics minor. Plays intramural basketball and football.",
    photos: [
      { photo: photos.nowCampus, caption: "At a Duke sporting event.", frame: "aspect-[3/4]" },
      { photo: photos.nowFriends, caption: "With friends on campus.", frame: "aspect-[4/3]" },
    ],
  },
];

export function Journey() {
  return (
    <Section
      id="journey"
      index="02"
      kicker="Selected journey"
      title="Toledo to Durham, in six stops."
      lede="Competitions, class leadership, and a track captaincy at Maumee Valley Country Day School, then Duke. Open any stop for the record behind it."
      glowX="90%"
      glowY="30%"
    >
      <ol className="relative">
        {/* rail */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-[1.1rem] top-2 w-px bg-gradient-to-b from-accent/70 via-primary/40 to-transparent md:left-[5.25rem]"
        />

        {STOPS.map((s) => (
          <Reveal as="li" key={s.title} delay={40} className="relative grid gap-4 pb-12 pl-12 last:pb-0 md:grid-cols-[6.5rem_minmax(0,1fr)] md:pl-0">
            {/* marker */}
            <div className="md:pt-5">
              <span className="mono-label hidden text-foreground md:block">{s.marker}</span>
              <span
                aria-hidden="true"
                className="absolute left-[0.6rem] top-5 grid h-5 w-5 place-items-center rounded-full border border-accent/60 bg-background md:left-[4.75rem]"
              >
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px] shadow-accent/80" />
              </span>
            </div>

            <DetailCard
              icon={s.icon}
              tone={s.tone}
              title={s.title}
              role={s.role}
              meta={s.meta}
              summary={s.summary}
              details={s.details}
            >
              {s.photos ? (
                /* Justified row: every frame shares one height, width follows the aspect ratio. */
                <div className="mt-5 flex flex-wrap gap-3">
                  {s.photos.map((p) => (
                    <Figure
                      key={p.photo.src}
                      photo={p.photo}
                      caption={p.caption}
                      sizes="(min-width: 640px) 22rem, 100vw"
                      className="max-w-full"
                      frameClassName={cn("h-52 max-w-full sm:h-60 lg:h-64", p.frame)}
                    />
                  ))}
                </div>
              ) : null}
            </DetailCard>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
