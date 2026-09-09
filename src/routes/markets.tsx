import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ExternalLink,
  Gauge,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Backdrop, Spotlight, TopNav } from "@/components/atlas/Chrome";
import { SECTIONS } from "@/components/atlas/content";
import snapshot from "@/data/market-data.json";
import newsSnapshot from "@/data/headlines.json";
import {
  industries,
  metricContext,
  relatedArticles,
  cleanArticles,
  type NewsSnapshot,
  type NewsGroup,
} from "@/lib/market-news";

const SITE_URL = "https://joshuawang.app/markets";

type Observation = { date: string; value: number };
type Market = {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  sourceUrl: string;
  status?: string;
  latest: Observation;
  previous: Observation;
  change: number;
  percentChange: number | null;
  basisPointChange: number | null;
  history: Observation[];
};

const news = newsSnapshot as NewsSnapshot;
const allArticles = cleanArticles(
  Object.values(news.groups).flatMap((group) => group.articles),
  Date.parse(news.generatedAt) || Date.now(),
);

const marketData = snapshot as {
  generatedAt: string;
  provider: string;
  status: string;
  markets: Market[];
};

export const Route = createFileRoute("/markets")({
  component: Markets,
  head: () => ({
    meta: [
      { title: "Markets Brief | Joshua Wang" },
      {
        name: "description",
        content:
          "A daily snapshot of major U.S. market indicators, deal activity, and macro headlines.",
      },
      { property: "og:title", content: "Markets Brief | Joshua Wang" },
      {
        property: "og:description",
        content: "Daily market closes and source-linked deal and macro headlines.",
      },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

function Markets() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#market-snapshot"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-lime-foreground"
      >
        Skip to market snapshot
      </a>
      <Backdrop />
      <Spotlight />
      <TopNav sections={SECTIONS} currentPage="markets" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <section id="market-snapshot" aria-labelledby="markets-title">
          <div className="flex flex-col gap-6 border-b border-border/70 pb-9 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mono-label text-accent">Daily markets brief</p>
              <h1
                id="markets-title"
                className="display mt-4 max-w-3xl text-5xl sm:text-6xl lg:text-7xl"
              >
                The close, <span className="text-gradient">in context.</span>
              </h1>
              <p className="body-copy mt-5">
                Major U.S. indicators with their latest available source dates, with dated news,
                possible drivers and a rotating view of major industries.
              </p>
            </div>
            <SnapshotStamp />
          </div>

          {marketData.markets.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {marketData.markets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          ) : (
            <div className="glass mt-8 rounded-2xl p-6">
              <p className="font-semibold">Market snapshot unavailable</p>
              <p className="mt-2 text-muted-foreground">
                The latest values could not be retrieved. No substitute or estimated values are
                shown.
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Each card shows its observation date. Sources publish on different schedules; daily
              observations can still arrive with a delay.
            </p>
            <a
              href="https://fred.stlouisfed.org/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-accent hover:text-foreground"
            >
              FRED source library <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        <section aria-labelledby="headlines-title" className="mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mono-label text-accent">What is moving the tape</p>
              <h2 id="headlines-title" className="display-medium mt-3 text-4xl sm:text-5xl">
                Headlines
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <HeadlinePanel
              title="Deal activity"
              kicker="Transactions and capital"
              icon={<Building2 aria-hidden="true" className="h-5 w-5" />}
              group={news.groups["deals"]}
            />
            <HeadlinePanel
              title="Macro"
              kicker="Policy and economic data"
              icon={<Gauge aria-hidden="true" className="h-5 w-5" />}
              group={news.groups["macro"]}
            />
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Headlines come from publisher RSS feeds and Federal Reserve releases, refreshed during
            each scheduled build. Dates are publication times in Eastern Time. Cached results keep
            their original dates. Topic matching is automatic and may miss relevant coverage.
          </p>
        </section>

        <IndustryRotation />

        <section className="glass mt-20 rounded-2xl p-6 sm:p-8" aria-label="Data notes">
          <h2 className="display-medium text-2xl">Data notes</h2>
          <div className="mt-4 grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-2">
            <p>
              MarketWatch supplies all four primary series. Dow and S&amp;P 500 figures are daily
              index closes. The U.S. 10-year figure is the quoted Treasury yield, not a bond price.
              WTI is the front-month NYMEX futures settlement, not the Cushing spot price.
            </p>
            <p>
              This page is informational only and is not investment advice. Index data may be
              subject to the underlying provider’s redistribution restrictions.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function SnapshotStamp() {
  const generated = marketData.generatedAt ? new Date(marketData.generatedAt) : null;
  const valid = generated && !Number.isNaN(generated.getTime());
  return (
    <div className="glass min-w-64 rounded-2xl p-4">
      <p className="mono-label">Latest available snapshot</p>
      <p className="mt-2 font-mono text-sm text-foreground">
        {valid
          ? generated.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "America/New_York",
            }) + " ET"
          : "Unavailable"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Checked hourly after U.S. market close</p>
      {marketData.status !== "ok" && (
        <p className="mt-2 text-xs text-amber-300">
          Some sources could not refresh. Check individual observation dates.
        </p>
      )}
    </div>
  );
}

function MarketCard({ market }: { market: Market }) {
  const up = market.change >= 0;
  const tone = up ? "text-lime" : "text-red-300";
  const digits = market.id === "DGS10" ? 3 : 2;
  const related = relatedArticles(allArticles, market.id, market.latest.date);
  const changeLabel =
    market.id === "DGS10"
      ? `${signed(market.change, digits)} pts · ${signed(market.basisPointChange ?? 0, 1)} bp`
      : `${signed(market.change, digits)} · ${signed(market.percentChange ?? 0, 2)}%`;

  return (
    <article className="glass lumen hover-lift flex min-h-72 flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono-label text-accent">{market.shortLabel}</p>
          <h2 className="mt-2 text-base font-semibold leading-snug">{market.label}</h2>
        </div>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary ${tone}`}
        >
          {up ? (
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
          )}
        </span>
      </div>
      <p className="mt-7 font-display text-4xl font-bold tracking-tight tabular-nums">
        {formatValue(market)}
      </p>
      <p className={`mt-2 font-mono text-sm tabular-nums ${tone}`}>{changeLabel}</p>
      <Sparkline history={market.history} up={up} />
      <div className="mb-5 border-t border-border/60 pt-4 text-sm leading-6 text-muted-foreground">
        <p className="mono-label mb-2 text-accent">Possible influences</p>
        <p>
          {related.length ? (
            <>
              Coverage near this observation:{" "}
              <a
                className="text-accent underline underline-offset-4"
                href={related[0]!.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {related[0]!.title}
              </a>{" "}
              ({formatPublished(related[0]!.publishedAt)}).{" "}
            </>
          ) : (
            <>I cannot confirm a specific news driver for this observation. </>
          )}
          {metricContext[market.id]?.text}
        </p>
        <p className="mt-2 text-xs">Interpretation, not a confirmed explanation of the move.</p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <div>
          <p>{market.unit}</p>
          {market.status === "cached" && (
            <p className="mt-1 text-amber-300">Saved observation; refresh unavailable</p>
          )}
          <p className="mt-1">Observed {formatDate(market.latest.date)}</p>
          <p className="mt-1">Change since {formatDate(market.previous.date)}</p>
        </div>
        <a
          href={market.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-accent hover:text-foreground"
        >
          Source <ExternalLink aria-hidden="true" className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}

function Sparkline({ history, up }: { history: Observation[]; up: boolean }) {
  const points = useMemo(() => {
    if (history.length < 2) return "";
    const values = history.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return history
      .map((point, index) => {
        const x = (index / (history.length - 1)) * 100;
        const y = 35 - ((point.value - min) / range) * 31;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [history]);

  return (
    <svg
      viewBox="0 0 100 38"
      role="img"
      aria-label="Recent 30-observation trend"
      className="my-5 h-16 w-full overflow-visible"
    >
      <line x1="0" y1="35" x2="100" y2="35" stroke="currentColor" className="text-border" />
      {points ? (
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className={up ? "text-lime" : "text-red-300"}
        />
      ) : null}
    </svg>
  );
}

function HeadlinePanel({
  title,
  kicker,
  icon,
  group,
}: {
  title: string;
  kicker: string;
  icon: React.ReactNode;
  group: NewsGroup | undefined;
}) {
  return (
    <article className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-3 border-b border-border/70 pb-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-accent">
          {icon}
        </span>
        <div>
          <p className="mono-label">{kicker}</p>
          <h3 className="mt-1 text-xl font-semibold">{title}</h3>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {group?.updatedAt
          ? `${group.status === "cached" ? "Saved coverage" : "Checked"}: ${formatPublished(group.updatedAt)}`
          : "No recent verified coverage available"}
      </p>
      {group?.articles.length ? (
        <ol className="divide-y divide-border/60">
          {group.articles.slice(0, 5).map((article) => (
            <li key={article.url}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group block py-4"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="font-medium leading-snug group-hover:text-accent">
                    {article.title}
                  </span>
                  <ExternalLink aria-hidden="true" className="mt-1 h-3.5 w-3.5 shrink-0" />
                </span>
                <span className="mt-2 block font-mono text-xs text-muted-foreground">
                  {article.source} · {formatPublished(article.publishedAt)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-10 text-sm text-muted-foreground">
          No matching headlines were available in the last 14 days. New coverage appears after a
          successful daily refresh.
        </p>
      )}
    </article>
  );
}

function IndustryRotation() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!preference.matches);
    const change = () => setPlaying(!preference.matches);
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!playing || interacting) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % industries.length);
    }, 12000);
    return () => window.clearInterval(timer);
  }, [playing, interacting]);
  const industry = industries[index]!;
  const select = (next: number) => {
    setIndex((next + industries.length) % industries.length);
    setPlaying(false);
  };
  const control =
    "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent";
  return (
    <section
      className="mt-20"
      aria-labelledby="industry-title"
      aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
      }}
    >
      <p className="mono-label text-accent">Across the economy</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h2 id="industry-title" className="display-medium text-4xl sm:text-5xl">
          Industry watch
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className={control}
            aria-label="Previous industry"
            onClick={() => select(index - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" className={control} onClick={() => setPlaying((value) => !value)}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause rotation" : "Start rotation"}
          </button>
          <button
            type="button"
            className={control}
            aria-label="Next industry"
            onClick={() => select(index + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="my-6 flex flex-wrap gap-2" aria-label="Choose industry">
        {industries.map((item, i) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={index === i}
            onClick={() => select(i)}
            className={`min-h-11 rounded-full border px-4 py-2 text-sm ${index === i ? "border-accent bg-primary/15 text-accent" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div
        className="grid gap-6 lg:grid-cols-[1fr_1.5fr]"
        aria-live={playing ? "off" : "polite"}
        aria-atomic="true"
      >
        <div className="glass rounded-2xl p-6 sm:p-8">
          <p className="mono-label text-accent">
            {index + 1} / {industries.length} · What to watch
          </p>
          <h3 className="display-medium mt-5 text-3xl">{industry.name}</h3>
          <p className="mt-5 leading-7 text-muted-foreground">{industry.context}</p>
          <p className="mt-5 text-xs text-muted-foreground">
            General analytical context. These are potential channels, not claims about today's
            performance.
          </p>
        </div>
        <HeadlinePanel
          title={`${industry.name} headlines`}
          kicker="Recent coverage"
          icon={<Newspaper className="h-5 w-5" aria-hidden="true" />}
          group={news.groups[industry.id]}
        />
      </div>
    </section>
  );
}

function formatPublished(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      }) + " ET";
}

function formatValue(market: Market) {
  if (market.id === "DGS10") return `${market.latest.value.toFixed(3)}%`;
  if (market.id === "CL1") return `$${market.latest.value.toFixed(2)}`;
  return market.latest.value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
}

function signed(value: number, digits: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;
}
