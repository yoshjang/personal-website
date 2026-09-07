import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ExternalLink,
  Gauge,
  LoaderCircle,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import { Backdrop, Spotlight, TopNav } from "@/components/atlas/Chrome";
import { SECTIONS } from "@/components/atlas/content";
import snapshot from "@/data/market-data.json";

const SITE_URL = "https://joshuawang.app/markets";

type Observation = { date: string; value: number };
type Market = {
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  sourceUrl: string;
  latest: Observation;
  previous: Observation;
  change: number;
  percentChange: number | null;
  basisPointChange: number | null;
  history: Observation[];
};

type Article = {
  url: string;
  url_mobile?: string;
  title: string;
  seendate?: string;
  domain?: string;
  language?: string;
  sourcecountry?: string;
};

type HeadlineState =
  | { status: "loading"; articles: Article[]; error?: undefined }
  | { status: "ready"; articles: Article[]; error?: undefined }
  | { status: "error"; articles: Article[]; error: string };

const marketData = snapshot as {
  generatedAt: string;
  provider: string;
  status: string;
  markets: Market[];
};

const headlineQueries = {
  deals:
    '(merger OR acquisition OR takeover OR IPO OR "capital raise" OR divestiture OR "strategic alternatives") sourcelang:english',
  macro:
    '("Federal Reserve" OR inflation OR payrolls OR GDP OR "Treasury yields" OR tariffs OR "energy prices") sourcelang:english',
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
  const [refreshKey, setRefreshKey] = useState(0);

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
                Major U.S. indicators with their latest available source dates, followed by a live
                scan of deal and macro coverage.
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
              Values are the latest non-missing observations available from FRED and may be delayed.
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
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-border bg-secondary/60 px-4 text-sm font-semibold transition-colors hover:border-accent/50 hover:text-accent"
              aria-label="Refresh deal and macro headlines"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Refresh headlines
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <HeadlinePanel
              key={`deals-${refreshKey}`}
              title="Deal activity"
              kicker="Transactions and capital"
              icon={<Building2 aria-hidden="true" className="h-5 w-5" />}
              query={headlineQueries.deals}
            />
            <HeadlinePanel
              key={`macro-${refreshKey}`}
              title="Macro"
              kicker="Policy and economic data"
              icon={<Gauge aria-hidden="true" className="h-5 w-5" />}
              query={headlineQueries.macro}
            />
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Headlines are automatically selected from public coverage indexed by GDELT. Results may
            include duplicate themes or uneven sourcing. Links open the original publishers.
          </p>
        </section>

        <section className="glass mt-20 rounded-2xl p-6 sm:p-8" aria-label="Data notes">
          <h2 className="display-medium text-2xl">Data notes</h2>
          <div className="mt-4 grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-2">
            <p>
              Dow and S&amp;P 500 figures are daily index closes. The U.S. 10-year figure is the
              constant-maturity market yield, not a traded closing price. WTI is the Cushing spot
              price, not a futures settlement.
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
      <p className="mt-1 text-xs text-muted-foreground">Rebuilt daily after U.S. market hours</p>
    </div>
  );
}

function MarketCard({ market }: { market: Market }) {
  const up = market.change >= 0;
  const tone = up ? "text-lime" : "text-red-300";
  const digits = market.id === "DGS10" ? 2 : 2;
  const changeLabel =
    market.id === "DGS10"
      ? `${signed(market.change, 2)} pts · ${signed(market.basisPointChange ?? 0, 1)} bp`
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
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <div>
          <p>{market.unit}</p>
          <p className="mt-1">Observed {formatDate(market.latest.date)}</p>
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
  query,
}: {
  title: string;
  kicker: string;
  icon: React.ReactNode;
  query: string;
}) {
  const [state, setState] = useState<HeadlineState>({ status: "loading", articles: [] });

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 10_000);
    const params = new URLSearchParams({
      query,
      mode: "artlist",
      format: "json",
      maxrecords: "30",
      sort: "datedesc",
      timespan: "3d",
    });

    fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Headline service returned ${response.status}`);
        const payload = (await response.json()) as { articles?: Article[] };
        const articles = dedupeArticles(payload.articles ?? []).slice(0, 6);
        setState({ status: "ready", articles });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          setState({ status: "error", articles: [], error: "The headline request timed out." });
        } else {
          setState({
            status: "error",
            articles: [],
            error: "Headlines are temporarily unavailable.",
          });
        }
        console.warn(error);
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

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

      {state.status === "loading" ? (
        <div
          className="flex min-h-56 items-center justify-center gap-3 text-muted-foreground"
          role="status"
        >
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
          Loading source-linked headlines
        </div>
      ) : state.status === "error" ? (
        <div className="flex min-h-56 flex-col items-center justify-center text-center">
          <Newspaper aria-hidden="true" className="h-7 w-7 text-muted-foreground" />
          <p className="mt-3 font-semibold">{state.error}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            The market snapshot above remains available.
          </p>
        </div>
      ) : state.articles.length === 0 ? (
        <div className="flex min-h-56 items-center justify-center text-center text-muted-foreground">
          No relevant headlines were returned for the last three days.
        </div>
      ) : (
        <ol className="divide-y divide-border/60">
          {state.articles.map((article) => (
            <li key={normalizeUrl(article.url)}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group block py-4"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
                    {article.title}
                  </span>
                  <ExternalLink
                    aria-hidden="true"
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                  />
                </span>
                <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                  <span>{article.domain || domainOf(article.url)}</span>
                  {article.seendate ? <span>{formatSeenDate(article.seendate)}</span> : null}
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

function dedupeArticles(articles: Article[]) {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  return articles.filter((article) => {
    if (!article?.url || !article?.title) return false;
    const url = normalizeUrl(article.url);
    const title = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (seenUrls.has(url) || seenTitles.has(title)) return false;
    seenUrls.add(url);
    seenTitles.add(title);
    return true;
  });
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_")) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return value;
  }
}

function domainOf(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
}

function formatSeenDate(value: string) {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!match) return value;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function formatValue(market: Market) {
  if (market.id === "DGS10") return `${market.latest.value.toFixed(2)}%`;
  if (market.id === "DCOILWTICO") return `$${market.latest.value.toFixed(2)}`;
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
