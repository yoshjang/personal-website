import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Backdrop,
  DotRail,
  ScrollProgress,
  SkipLink,
  Spotlight,
  TopNav,
} from "@/components/atlas/Chrome";
import { LINKS, SECTIONS } from "@/components/atlas/content";
import { Beyond } from "@/components/atlas/sections/Beyond";
import { CaseWork } from "@/components/atlas/sections/CaseWork";
import { Community } from "@/components/atlas/sections/Community";
import { Contact, Footer } from "@/components/atlas/sections/Contact";
import { Finance } from "@/components/atlas/sections/Finance";
import { Focus } from "@/components/atlas/sections/Focus";
import { Journey } from "@/components/atlas/sections/Journey";
import { Opening, ViewSwitch } from "@/components/atlas/sections/Opening";
import { Research } from "@/components/atlas/sections/Research";
import { Skills } from "@/components/atlas/sections/Skills";
import { VIEW_MODE_KEY, type ViewMode } from "@/lib/view-mode";

const SITE_URL = "https://joshuawang.app/";
const TITLE = "Joshua Wang | Data, Energy, Finance, Community";
const DESCRIPTION =
  "Joshua Wang is a Duke statistical science student from Toledo, Ohio. Solar and battery research, M&A and venture analyst work, and community leadership.";
const OG_IMAGE = "https://joshuawang.app/og-image.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#f2efe7" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Joshua Wang - Duke statistical science, M&A and venture analyst work",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
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
          email: LINKS.mailto,
          url: SITE_URL,
          sameAs: [LINKS.linkedin],
          alumniOf: "Maumee Valley Country Day School",
          affiliation: "Duke University",
        }),
      },
    ],
  }),
});

function Index() {
  const [view, setView] = useState<ViewMode>("recruiter");

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_MODE_KEY);
    if (saved === "full" || saved === "recruiter") setView(saved);
  }, []);

  const chooseView = (next: ViewMode) => {
    setView(next);
    window.localStorage.setItem(VIEW_MODE_KEY, next);
  };

  const visible = (view === "recruiter" ? SECTIONS.filter((s) => s.recruiter) : SECTIONS).map(
    (s, i) => ({ ...s, index: String(i).padStart(2, "0") }),
  );
  const indexOf = (id: string) => visible.find((s) => s.id === id)?.index ?? "00";
  const full = view === "full";

  return (
    <div className="editorial-site relative min-h-screen">
      <SkipLink />
      <Backdrop />
      <Spotlight />
      <ScrollProgress />
      <TopNav sections={visible} />
      <DotRail sections={visible} />

      <main>
        <Opening view={view} onViewChange={chooseView} />
        <KineticStrip />
        <Focus index={indexOf("focus")} />
        <CaseWork index={indexOf("casework")} />
        {full ? <Journey index={indexOf("journey")} /> : null}
        {full ? <Research index={indexOf("research")} /> : null}
        {full ? <Community index={indexOf("community")} /> : null}
        <Finance index={indexOf("finance")} />
        {full ? <Beyond index={indexOf("beyond")} /> : null}
        <Skills index={indexOf("skills")} />
        <Contact index={indexOf("contact")} />
      </main>

      <Footer sections={visible} />

      <div className="mt-8 flex justify-center px-4 sm:fixed sm:bottom-5 sm:right-5 sm:z-40 sm:mt-0 sm:block sm:px-0 print:hidden">
        <ViewSwitch view={view} onViewChange={chooseView} />
      </div>
    </div>
  );
}

function KineticStrip() {
  const words = ["Statistical science", "Clean energy", "M&A", "Community leadership"];

  return (
    <div className="editorial-ticker" aria-label="Joshua's four connected themes">
      <div className="editorial-ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="editorial-ticker-set">
            {words.map((word) => (
              <span key={word}>
                {word}
                <i aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
