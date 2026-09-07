import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type SeriesConfig = {
  id: "DJIA" | "SP500" | "DGS10" | "DCOILWTICO";
  label: string;
  shortLabel: string;
  unit: string;
  sourceUrl: string;
};

type Observation = { date: string; value: number };

const series: SeriesConfig[] = [
  {
    id: "DJIA",
    label: "Dow Jones Industrial Average",
    shortLabel: "Dow",
    unit: "Index",
    sourceUrl: "https://fred.stlouisfed.org/series/DJIA",
  },
  {
    id: "SP500",
    label: "S&P 500",
    shortLabel: "S&P 500",
    unit: "Index",
    sourceUrl: "https://fred.stlouisfed.org/series/SP500",
  },
  {
    id: "DGS10",
    label: "U.S. 10-Year Treasury",
    shortLabel: "U.S. 10Y",
    unit: "Percent",
    sourceUrl: "https://fred.stlouisfed.org/series/DGS10",
  },
  {
    id: "DCOILWTICO",
    label: "WTI Spot",
    shortLabel: "WTI Spot",
    unit: "Dollars per barrel",
    sourceUrl: "https://fred.stlouisfed.org/series/DCOILWTICO",
  },
];

const outputPath = resolve("src/data/market-data.json");

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function parseCsv(csv: string): Observation[] {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, raw] = line.split(",");
      return { date: date?.trim() ?? "", value: Number(raw) };
    })
    .filter(({ date, value }) => validDate(date) && Number.isFinite(value));
}

async function fetchSeries(config: SeriesConfig) {
  console.log(`Fetching ${config.id}...`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(
      `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${config.id}`,
      { signal: controller.signal },
    );
    if (!response.ok) throw new Error(`${config.id}: HTTP ${response.status}`);
    const observations = parseCsv(await response.text());
    if (observations.length < 2) throw new Error(`${config.id}: fewer than two observations`);

    const history = observations.slice(-30);
    const latest = history.at(-1)!;
    const previous = history.at(-2)!;
    const change = latest.value - previous.value;
    const percentChange = previous.value === 0 ? null : (change / previous.value) * 100;

    console.log(`Fetched ${config.id}: ${latest.date}.`);
    return {
      ...config,
      latest,
      previous,
      change,
      percentChange,
      basisPointChange: config.id === "DGS10" ? change * 100 : null,
      history,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  try {
    // Fetch sequentially because the public FRED graph endpoint may throttle
    // concurrent downloads from the same deployment runner.
    const markets = [];
    for (const config of series) markets.push(await fetchSeries(config));
    const snapshot = {
      generatedAt: new Date().toISOString(),
      provider: "Federal Reserve Bank of St. Louis (FRED)",
      status: "ok",
      markets,
    };
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(`Updated ${outputPath} with ${markets.length} market series.`);
  } catch (error) {
    try {
      const existing = JSON.parse(await readFile(outputPath, "utf8"));
      if (existing?.markets?.length === series.length) {
        console.warn(`Market refresh failed; preserving the last valid snapshot. ${String(error)}`);
        return;
      }
    } catch {
      // The explicit failure below is clearer than a missing or invalid asset.
    }
    throw error;
  }
}

await main();
