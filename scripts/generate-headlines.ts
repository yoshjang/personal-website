import { readFile, writeFile, mkdir } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { cleanArticles, industries, type Article, type NewsSnapshot } from "../src/lib/market-news";

const feeds = [
  // Channel IDs from https://www.cnbc.com/rss-feeds/.
  ...[
    "100003114",
    "10001147",
    "20910258",
    "10000664",
    "19854910",
    "10000108",
    "10000115",
    "19836768",
    "10000110",
    "10000116",
    "15839135",
  ].map((id) => ({ source: "CNBC", url: `https://www.cnbc.com/id/${id}/device/rss/rss.html` })),
  { source: "Federal Reserve", url: "https://www.federalreserve.gov/feeds/press_monetary.xml" },
];
const parser = new XMLParser({ ignoreAttributes: false, processEntities: true });
const output = "src/data/headlines.json";
let previous: NewsSnapshot = { generatedAt: "", groups: {} };
try {
  previous = JSON.parse(await readFile(output, "utf8"));
} catch {
  /* First build. */
}
// The deployed snapshot survives failed refreshes across clean scheduled checkouts.
try {
  const response = await fetch("https://joshuawang.app/data/headlines.json", {
    signal: AbortSignal.timeout(10000),
  });
  if (response.ok) {
    const deployed = (await response.json()) as NewsSnapshot;
    if (deployed.groups && deployed.generatedAt > previous.generatedAt) previous = deployed;
  }
} catch {
  /* Keep the checked-in fallback. */
}

const results = await Promise.allSettled(
  feeds.map(async (feed) => {
    const response = await fetch(feed.url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`${feed.source}: HTTP ${response.status}`);
    const xml = await response.text();
    if (XMLValidator.validate(xml) !== true) throw new Error("Invalid RSS XML");
    const payload = parser.parse(xml);
    const items = payload.rss?.channel?.item;
    if (!items) throw new Error("No RSS items");
    const text = (value: unknown): string =>
      typeof value === "string" ? value : String((value as { "#text"?: string })?.["#text"] ?? "");
    const articles = cleanArticles(
      (Array.isArray(items) ? items : [items]).map((item) => ({
        title: text(item.title)
          .replace(/<[^>]*>/g, "")
          .trim(),
        url: text(item.link),
        source: feed.source,
        publishedAt: Number.isFinite(Date.parse(text(item.pubDate)))
          ? new Date(text(item.pubDate)).toISOString()
          : "",
      })),
    );
    console.log(`${feed.url}: ${articles.length} recent articles`);
    return articles;
  }),
);
results.forEach((r) => {
  if (r.status === "rejected") console.warn(String(r.reason));
});
const fetched = cleanArticles(results.flatMap((r) => (r.status === "fulfilled" ? r.value : [])));
const matchers: Record<string, (a: Article) => boolean> = {
  macro: (a) =>
    a.source === "Federal Reserve" ||
    /\b(fed|inflation|payrolls?|jobs report|unemployment|gdp|treasury|yields?|tariffs?|economy|economic|interest rates?|oil|crude|central bank)\b/i.test(
      a.title,
    ),
  deals: (a) =>
    /\b(merger|acquisition|takeover|ipo|buyout|divestiture|capital raise|acquires?|acquiring|buying|to buy|to sell)\b/i.test(
      a.title,
    ) &&
    !/\b(nuclear|greenland|ceasefire|peace|enforcement|trade deal|time to buy|stocks to buy)\b/i.test(
      a.title,
    ),
  ...Object.fromEntries(
    industries.map((industry) => [industry.id, (a: Article) => industry.pattern.test(a.title)]),
  ),
};
const now = new Date().toISOString();
const groups = Object.fromEntries(
  Object.entries(matchers).map(([key, match]) => {
    const fresh = fetched.filter(match);
    const old = cleanArticles(previous.groups[key]?.articles ?? []).filter(match);
    return [
      key,
      {
        updatedAt: fresh.length ? now : (previous.groups[key]?.updatedAt ?? null),
        status: fresh.length ? "ok" : old.length ? "cached" : "unavailable",
        articles: cleanArticles([...fresh, ...old]).slice(0, 8),
      },
    ];
  }),
);
const snapshot = { generatedAt: now, groups };
await mkdir("public/data", { recursive: true });
await writeFile(output, JSON.stringify(snapshot, null, 2) + "\n");
await writeFile("public/data/headlines.json", JSON.stringify(snapshot) + "\n");
