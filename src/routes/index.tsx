import { createFileRoute } from "@tanstack/react-router";
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
import { Community } from "@/components/atlas/sections/Community";
import { Contact, Footer } from "@/components/atlas/sections/Contact";
import { Finance } from "@/components/atlas/sections/Finance";
import { Focus } from "@/components/atlas/sections/Focus";
import { Journey } from "@/components/atlas/sections/Journey";
import { Opening } from "@/components/atlas/sections/Opening";
import { Research } from "@/components/atlas/sections/Research";
import { Skills } from "@/components/atlas/sections/Skills";

const SITE_URL = "https://joshuawang.app/";
const TITLE = "Joshua Wang | Data, Energy, Finance, Community";
const DESCRIPTION =
  "Joshua Wang is a Duke statistical science student from Toledo, Ohio. Solar and battery research, M&A and venture analyst work, and community leadership.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#0b1020" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
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
  return (
    <div className="relative min-h-screen">
      <SkipLink />
      <Backdrop />
      <Spotlight />
      <ScrollProgress />
      <TopNav sections={SECTIONS} />
      <DotRail sections={SECTIONS} />

      <main>
        <Opening />
        <Focus />
        <Journey />
        <Research />
        <Community />
        <Finance />
        <Beyond />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
