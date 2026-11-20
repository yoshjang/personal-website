import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight, Plus, Search, Trash2 } from "lucide-react";
import { CountUp } from "@/components/atlas/ui";
import { Backdrop, Spotlight, TopNav } from "@/components/atlas/Chrome";
import { SECTIONS } from "@/components/atlas/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import seedDeals from "@/data/energy-deals.json";

const SITE_URL = "https://joshuawang.app/deals";
const STORAGE_KEY = "joshua-energy-deals-v1";

type Deal = {
  id: string;
  name: string;
  counterparty: string;
  sizeLabel: string;
  sizeM: number | null;
  sector: string;
  financing: string;
  location: string;
  date: string;
  sourceName: string;
  sourceUrl: string;
  note: string;
  mine?: boolean;
};

type DealDraft = Omit<Deal, "id" | "mine">;

const EMPTY_DRAFT: DealDraft = {
  name: "",
  counterparty: "",
  sizeLabel: "",
  sizeM: null,
  sector: "Solar",
  financing: "",
  location: "",
  date: "",
  sourceName: "",
  sourceUrl: "",
  note: "",
};

const SECTOR_OPTIONS = ["Solar", "Wind", "Storage", "Hydro", "Geothermal", "Grid", "Other"];

function isDeal(value: unknown): value is Deal {
  if (!value || typeof value !== "object") return false;
  const d = value as Partial<Deal>;
  return (
    typeof d.id === "string" &&
    typeof d.name === "string" &&
    d.name.trim().length > 0 &&
    typeof d.counterparty === "string" &&
    typeof d.sizeLabel === "string" &&
    (typeof d.sizeM === "number" || d.sizeM === null) &&
    typeof d.sector === "string" &&
    typeof d.financing === "string" &&
    typeof d.location === "string" &&
    typeof d.date === "string" &&
    typeof d.sourceName === "string" &&
    typeof d.sourceUrl === "string" &&
    typeof d.note === "string"
  );
}

function readMine(): Deal[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!Array.isArray(value)) return [];
    return value.filter(isDeal).map((d) => ({ ...d, mine: true }));
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  const parsed = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatVolume(sizeM: number): string {
  if (sizeM >= 1000) return `$${(sizeM / 1000).toFixed(1)}B`;
  return `$${Math.round(sizeM)}M`;
}

export const Route = createFileRoute("/deals")({
  component: Deals,
  head: () => ({
    meta: [
      { title: "Energy Deal Tracker | Joshua Wang" },
      {
        name: "description",
        content:
          "A running dashboard of energy transition deals - solar, storage, wind and grid - tracked by buyer, size, financing and source.",
      },
      { property: "og:title", content: "Energy Deal Tracker | Joshua Wang" },
      {
        property: "og:description",
        content: "Energy transition deals tracked by buyer, size, financing and source.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: "https://joshuawang.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://joshuawang.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

function Deals() {
  const [mine, setMine] = useState<Deal[]>([]);
  useEffect(() => setMine(readMine()), []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(mine));
  }, [mine]);

  const [sector, setSector] = useState("All");
  const [financing, setFinancing] = useState("All");
  const [sort, setSort] = useState<"newest" | "largest">("newest");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  const all = useMemo(() => [...mine, ...(seedDeals as Deal[])], [mine]);
  const sectors = useMemo(() => ["All", ...new Set(all.map((d) => d.sector))], [all]);
  const financings = useMemo(() => ["All", ...new Set(all.map((d) => d.financing))], [all]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = all.filter(
      (d) =>
        (sector === "All" || d.sector === sector) &&
        (financing === "All" || d.financing === financing) &&
        (!q ||
          `${d.name} ${d.counterparty} ${d.location} ${d.note} ${d.financing}`
            .toLowerCase()
            .includes(q)),
    );
    return [...filtered].sort((a, b) =>
      sort === "newest"
        ? b.date.localeCompare(a.date)
        : (b.sizeM ?? -1) - (a.sizeM ?? -1),
    );
  }, [all, sector, financing, sort, query]);

  const stats = useMemo(() => {
    const volume = all.reduce((sum, d) => sum + (d.sizeM ?? 0), 0);
    const priced = all.filter((d) => d.sizeM !== null).length;
    const latest = all.map((d) => d.date).sort().at(-1) ?? "";
    return { volume, priced, count: all.length, sectors: sectors.length - 1, latest };
  }, [all, sectors.length]);

  const addDeal = (draft: DealDraft) => {
    const deal: Deal = {
      ...draft,
      id: `mine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mine: true,
    };
    setMine((m) => [deal, ...m]);
    setAdding(false);
  };
  const removeDeal = (id: string) => setMine((m) => m.filter((d) => d.id !== id));

  return (
    <div className="relative min-h-screen">
      <a
        href="#deal-list"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2"
      >
        Skip to deals
      </a>
      <Backdrop />
      <Spotlight />
      <TopNav sections={SECTIONS} currentPage="deals" />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <section aria-labelledby="deals-title">
          <div className="intro-item flex flex-col gap-6 border-b border-border/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mono-label text-accent">Energy transition deal tracker</p>
              <h1
                id="deals-title"
                className="display mt-4 max-w-4xl text-5xl sm:text-6xl lg:text-7xl"
              >
                Deals, <span className="text-gradient">one screen.</span>
              </h1>
              <p className="body-copy mt-5">
                Solar, storage, wind and grid transactions by buyer, size, financing structure and
                source. Seeded from public announcements; deals I add myself stay in this browser.
              </p>
            </div>
            <Button onClick={() => setAdding((v) => !v)} className="min-h-12 rounded-full">
              <Plus className="h-4 w-4" />
              {adding ? "Close form" : "Add a deal"}
            </Button>
          </div>

          <div className="editorial-ticker mt-6" aria-hidden="true">
            <div className="editorial-ticker-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="editorial-ticker-set">
                  {sectors.slice(1).map((name) => (
                    <span key={name}>
                      {name}
                      <i aria-hidden="true" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="intro-item mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ "--d": "160ms" } as CSSProperties}>
            <StatCard label="Disclosed volume" value={<CountUp value={stats.volume} format={formatVolume} />} sub={`across ${stats.priced} priced deals`} />
            <StatCard label="Deals tracked" value={<CountUp value={stats.count} />} sub={`${mine.length} added by me`} />
            <StatCard label="Sectors" value={<CountUp value={stats.sectors} />} sub={sectors.slice(1).join(", ")} />
            <StatCard label="Latest entry" value={stats.latest ? formatDate(stats.latest) : "-"} sub="by announced date" />
          </div>

          {adding && <AddDealForm onAdd={addDeal} onCancel={() => setAdding(false)} />}

          <div className="glass mt-6 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2" aria-label="Sector filter">
              {sectors.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSector(s)}
                  aria-pressed={sector === s}
                  className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${sector === s ? "border-accent bg-primary/25" : "border-border text-muted-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="relative min-w-56 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search deals, buyers, places"
                  aria-label="Search deals"
                  className="h-11 rounded-xl bg-background/45 pl-10"
                />
              </div>
              <select
                value={financing}
                onChange={(e) => setFinancing(e.target.value)}
                aria-label="Financing type"
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              >
                {financings.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "newest" | "largest")}
                aria-label="Sort order"
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="largest">Largest first</option>
              </select>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{visible.length} deals shown</p>
          </div>

          <div id="deal-list" className="mt-6 grid gap-4 lg:grid-cols-2">
            {visible.map((deal) => (
              <DealCard key={deal.id} deal={deal} onRemove={removeDeal} />
            ))}
          </div>
          {!visible.length && (
            <div className="glass mt-6 rounded-2xl p-10 text-center">
              <p className="font-semibold">No deals match those filters</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear the search or add the deal yourself.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: ReactNode; sub: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="mono-label">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 truncate text-sm text-muted-foreground" title={sub}>
        {sub}
      </p>
    </div>
  );
}

function DealCard({ deal, onRemove }: { deal: Deal; onRemove: (id: string) => void }) {
  return (
    <article className="glass lumen hover-lift flex flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {deal.sector}
            {deal.mine ? " · my entry" : ""}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold leading-snug">{deal.name}</h2>
        </div>
        <span className="shrink-0 rounded-full bg-secondary/70 px-3 py-1 text-sm font-semibold tabular-nums">
          {deal.sizeLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{deal.counterparty}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-border px-2.5 py-1">{deal.financing}</span>
        {deal.location && (
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            {deal.location}
          </span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          {formatDate(deal.date)}
        </span>
      </div>
      {deal.note && <p className="mt-3 text-sm leading-6 text-foreground/90">{deal.note}</p>}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        {deal.sourceUrl ? (
          <a
            href={deal.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            {deal.sourceName || "Source"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">{deal.sourceName}</span>
        )}
        {deal.mine && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${deal.name}`}
            onClick={() => onRemove(deal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </article>
  );
}

function AddDealForm({
  onAdd,
  onCancel,
}: {
  onAdd: (draft: DealDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<DealDraft>(EMPTY_DRAFT);
  const set = <K extends keyof DealDraft>(key: K, value: DealDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const valid = draft.name.trim().length > 0 && draft.date.trim().length > 0;
  const fieldClass = "mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm";
  const labelClass = "block text-sm font-semibold";

  return (
    <section className="glass mt-6 rounded-2xl p-5" aria-label="Add a deal">
      <p className="mono-label text-accent">Add a deal</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Saved only in this browser, alongside the public seed list. Include a source link when you
        can.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Deal name
          <input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            className={fieldClass}
            placeholder="Big Rooter solar green loan"
          />
        </label>
        <label className={labelClass}>
          Buyer / investor / parties
          <input
            value={draft.counterparty}
            onChange={(e) => set("counterparty", e.target.value)}
            className={fieldClass}
            placeholder="Developer / lender group"
          />
        </label>
        <label className={labelClass}>
          Announced date
          <input
            type="date"
            value={draft.date}
            onChange={(e) => set("date", e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          Size label
          <input
            value={draft.sizeLabel}
            onChange={(e) => set("sizeLabel", e.target.value)}
            className={fieldClass}
            placeholder="$250M or 500 MW"
          />
        </label>
        <label className={labelClass}>
          Size in $M (optional, for sorting and totals)
          <input
            type="number"
            min="0"
            value={draft.sizeM ?? ""}
            onChange={(e) =>
              set("sizeM", e.target.value === "" ? null : Number(e.target.value))
            }
            className={fieldClass}
            placeholder="250"
          />
        </label>
        <label className={labelClass}>
          Sector
          <select
            value={draft.sector}
            onChange={(e) => set("sector", e.target.value)}
            className={fieldClass}
          >
            {SECTOR_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Financing structure
          <input
            value={draft.financing}
            onChange={(e) => set("financing", e.target.value)}
            className={fieldClass}
            placeholder="Tax equity, green loan, M&A..."
          />
        </label>
        <label className={labelClass}>
          Location
          <input
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
            className={fieldClass}
            placeholder="County, State or Country"
          />
        </label>
        <label className={labelClass}>
          Source name
          <input
            value={draft.sourceName}
            onChange={(e) => set("sourceName", e.target.value)}
            className={fieldClass}
            placeholder="Press release, DealFlow..."
          />
        </label>
        <label className={labelClass}>
          Source URL
          <input
            type="url"
            value={draft.sourceUrl}
            onChange={(e) => set("sourceUrl", e.target.value)}
            className={fieldClass}
            placeholder="https://..."
          />
        </label>
      </div>
      <label className={`${labelClass} mt-4`}>
        Why it matters (optional)
        <textarea
          value={draft.note}
          onChange={(e) => set("note", e.target.value)}
          className="mt-1.5 min-h-20 w-full rounded-xl border border-border bg-background p-3 text-sm"
          placeholder="One line you could say in an interview"
        />
      </label>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => onAdd(draft)} disabled={!valid} className="rounded-full">
          Add to tracker
        </Button>
        <Button variant="ghost" onClick={onCancel} className="rounded-full">
          Cancel
        </Button>
      </div>
    </section>
  );
              }
