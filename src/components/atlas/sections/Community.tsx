import { BookOpen, Church, HeartHandshake, Landmark, Sprout, Users } from "lucide-react";
import { photos } from "../photos";
import { DetailCard, Figure, Reveal, Section } from "../ui";

export function Community() {
  return (
    <Section
      id="community"
      index="04"
      kicker="Leadership and community"
      title="Student organizations at Duke, and the work that started in Toledo."
      lede="Operations and membership work in three student organizations at Duke, a nonprofit STEM program at home, and years of service at church."
      glowX="85%"
      glowY="10%"
    >
      {/* Duke */}
      <Reveal>
        <h3 className="mono-label">At Duke</h3>
      </Reveal>
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <Reveal delay={0}>
            <DetailCard
              icon={Users}
              tone="blue"
              title="Asian Leadership Initiative"
              role="VP of Operations"
              meta="Since April 2026"
              summary="Operations lead for the student organization."
              details={[
                "Helped secure official student-club status",
                "Recruited more than 40 members",
                "Coordinated with more than 10 preprofessional and cultural clubs",
                "Secured two finance professionals for the Asian Futures in Finance mentorship program",
              ]}
            />
          </Reveal>
          <Reveal delay={70}>
            <DetailCard
              icon={Landmark}
              tone="cyan"
              title="Alpha Kappa Psi"
              role="New-Member Committee"
              meta="Since February 2026"
              summary="Case work and recruiting for the professional business fraternity."
              details={[
                "Worked on a CVS equity recommendation",
                "Worked on a PepsiCo and Celsius M&A case",
                "Worked on a campus food startup",
                "Helped select a 20-member pledge class from more than 200 rushees",
                "Expanded new-member programming",
              ]}
            />
          </Reveal>
          <Reveal delay={140}>
            <DetailCard
              icon={BookOpen}
              tone="lime"
              title="Asian InterVarsity"
              role="Small-group leader"
              summary="Small-group leader in the campus fellowship."
            />
          </Reveal>
        </div>
        <Reveal delay={90} className="h-full">
          <Figure
            photo={photos.nowDukeGroup}
            caption="A group photo at Duke."
            sizes="(min-width: 1024px) 32rem, 100vw"
            className="flex h-full flex-col"
            frameClassName="aspect-[4/3] lg:aspect-auto lg:min-h-[22rem] lg:flex-1"
          />
        </Reveal>
      </div>

      {/* Toledo */}
      <Reveal className="mt-14">
        <h3 className="mono-label">In Toledo</h3>
      </Reveal>
      <div className="mt-5 grid gap-4">
        <Reveal>
          <DetailCard
            icon={Sprout}
            tone="lime"
            title="Toledo Minds"
            role="Chief Operating Officer"
            meta="Nonprofit STEM education. Not actively involved while at college"
            summary="Ran a week-long STEM camp and a winter reunion serving more than 30 children annually, and handled the operations behind them."
            details={[
              "Helped move the program to the Toledo Main Library",
              "Completed the 501(c)(3) paperwork",
              "Managed marketing and financial operations",
              "Helped with school-district relationships and fundraising",
            ]}
          >
            <div className="mt-5 flex min-w-0 flex-wrap gap-3">
              <Figure
                photo={photos.toledoGroup}
                caption="STEM camp participants with their certificates."
                sizes="(min-width: 640px) 24rem, 100vw"
                className="w-full min-w-0 sm:w-auto sm:max-w-full"
                frameClassName="aspect-[4/3] w-full sm:h-60 sm:w-auto sm:max-w-full lg:h-64"
              />
              <Figure
                photo={photos.toledoBasketball}
                caption="Basketball workshop, December 2023."
                sizes="(min-width: 640px) 20rem, 100vw"
                className="w-full min-w-0 sm:w-auto sm:max-w-full"
                frameClassName="aspect-[8/7] w-full sm:h-60 sm:w-auto sm:max-w-full lg:h-64"
              />
            </div>
          </DetailCard>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <Reveal delay={60}>
            <DetailCard
              icon={Church}
              tone="cyan"
              title="Church"
              role="Service and music"
              summary="Weekly food preparation for a congregation of more than 100 people, plus piano, worship and service leadership, slides, and mentoring. Baptized in 2022. Attended Urbana 2025."
              details={[
                "Helped lead a vacation Bible school for more than 50 children",
                "Pianist, worship leader, and service leader",
                "Slideshow operation and mentoring younger members",
              ]}
            >
              <div className="mt-5">
                <Figure
                  photo={photos.toledoBaptism}
                  caption="Baptism, Easter 2022."
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  frameClassName="aspect-[16/9]"
                />
              </div>
            </DetailCard>
          </Reveal>
          <Reveal delay={120}>
            <DetailCard
              icon={HeartHandshake}
              tone="blue"
              title="Other service"
              summary="Volunteered with the Boys & Girls Club and taught basketball to children at a local Chinese school."
            >
              <div className="mt-5">
                <Figure
                  photo={photos.toledoService}
                  caption="Volunteers with bags of collected litter."
                  sizes="(min-width: 1024px) 30rem, 100vw"
                  frameClassName="aspect-[16/9]"
                />
              </div>
            </DetailCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
