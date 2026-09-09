import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { XMLParser, XMLValidator } from "fast-xml-parser";

type SeriesConfig = {
  id: "DJIA" | "SP500" | "DGS10" | "CL1";
  label: string;
  shortLabel: string;
  unit: string;
  sourceUrl: string;
  marketWatchKey: string;
  marketWatchTicker: string;
  marketWatchInstrument: "Index" | "Bond" | "Future";
};

type Observation = { date: string; value: number };

const series: SeriesConfig[] = [
  {
    id: "DJIA",
    label: "Dow Jones Industrial Average",
    shortLabel: "Dow",
    unit: "Index",
    sourceUrl: "https://www.marketwatch.com/investing/index/djia",
    marketWatchKey: "INDEX/US/DOW JONES GLOBAL/DJIA",
    marketWatchTicker: "DJIA",
    marketWatchInstrument: "Index",
  },
  {
    id: "SP500",
    label: "S&P 500",
    shortLabel: "S&P 500",
    unit: "Index",
    sourceUrl: "https://www.marketwatch.com/investing/index/spx",
    marketWatchKey: "INDEX/US/S&P US/SPX",
    marketWatchTicker: "SPX",
    marketWatchInstrument: "Index",
  },
  {
    id: "DGS10",
    label: "U.S. 10-Year Treasury",
    shortLabel: "U.S. 10Y",
    unit: "Percent",
    sourceUrl: "https://www.marketwatch.com/investing/bond/tmubmusd10y",
    marketWatchKey: "Bond/BX/XTUP/TMUBMUSD10Y",
    marketWatchTicker: "TMUBMUSD10Y",
    marketWatchInstrument: "Bond",
  },
  {
    id: "CL1",
    label: "WTI Front-Month Futures",
    shortLabel: "WTI Futures",
    unit: "Dollars per barrel",
    sourceUrl: "https://www.marketwatch.com/investing/future/cl.1",
    marketWatchKey: "FUTURE/US/XNYM/CL.1",
    marketWatchTicker: "CL.1",
    marketWatchInstrument: "Future",
  },
];

const outputPath = resolve("src/data/market-data.json");
const marketWatchToken = "cecc4267a0194af89ca343805a3e57af";

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function parseCsv(csv: string): Observation[] {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, raw] = line.split(",");
      return { date: date?.trim() ?? "", value: raw?.trim() ? Number(raw) : NaN };
    })
    .filter(
      ({ date, value }) =>
        validDate(date) && date <= new Date().toISOString().slice(0, 10) && Number.isFinite(value),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function parseTreasury(xml: string): Observation[] {
  if (XMLValidator.validate(xml) !== true) throw new Error("Invalid Treasury XML");
  const parsed = new XMLParser({ removeNSPrefix: true }).parse(xml);
  const entries = parsed.feed?.entry;
  if (!entries) throw new Error("No Treasury entries");
  return (Array.isArray(entries) ? entries : [entries])
    .flatMap((entry) => {
      const data = entry.content?.properties;
      const date = String(data?.NEW_DATE ?? "").slice(0, 10);
      const raw = data?.BC_10YEAR;
      const value =
        typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() ? Number(raw) : NaN;
      return validDate(date) &&
        date <= new Date().toISOString().slice(0, 10) &&
        Number.isFinite(value)
        ? [{ date, value }]
        : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function parseMarketWatchHistory(
  payload: unknown,
  expected: Pick<SeriesConfig, "marketWatchTicker" | "marketWatchInstrument">,
): Observation[] {
  const response = payload as {
    TimeInfo?: { Ticks?: unknown[] };
    Series?: Array<{
      SeriesId?: string;
      Ticker?: string;
      InstrumentType?: string;
      DataPoints?: unknown[];
      FormatHints?: { DecimalPlaces?: unknown };
    }>;
  };
  const ticks = response.TimeInfo?.Ticks;
  const market = response.Series?.find((item) => item.SeriesId === "s1");
  const decimalPlaces = market?.FormatHints?.DecimalPlaces;
  if (
    !Array.isArray(ticks) ||
    !market ||
    market.Ticker !== expected.marketWatchTicker ||
    market.InstrumentType !== expected.marketWatchInstrument ||
    !Array.isArray(market.DataPoints) ||
    market.DataPoints.length !== ticks.length ||
    !Number.isInteger(decimalPlaces) ||
    Number(decimalPlaces) < 0 ||
    Number(decimalPlaces) > 6
  )
    throw new Error(`Unexpected MarketWatch ${expected.marketWatchTicker} response`);

  return ticks
    .flatMap((tick, index) => {
      const point = market.DataPoints?.[index];
      const timestamp = typeof tick === "number" ? tick : Number.NaN;
      const raw = Array.isArray(point) && point.length ? point[0] : null;
      const factor = 10 ** Number(decimalPlaces);
      const value =
        typeof raw === "number" ? Math.round((raw + Number.EPSILON) * factor) / factor : Number.NaN;
      const date = Number.isFinite(timestamp) ? new Date(timestamp).toISOString().slice(0, 10) : "";
      return validDate(date) &&
        date <= new Date().toISOString().slice(0, 10) &&
        Number.isFinite(value)
        ? [{ date, value }]
        : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function marketWatchSeries(config: SeriesConfig) {
  const end = Date.now();
  const request = {
    Step: "P1D",
    TimeFrame: "P2M",
    StartDate: end - 60 * 86400000,
    EndDate: end,
    EntitlementToken: marketWatchToken,
    IncludeMockTick: false,
    FilterNullSlots: true,
    FilterClosedPoints: true,
    IncludeClosedSlots: false,
    IncludeOfficialClose: true,
    InjectOpen: false,
    ShowPreMarket: false,
    ShowAfterHours: false,
    UseExtendedTimeFrame: true,
    WantPriorClose: false,
    IncludeCurrentQuotes: false,
    ResetTodaysAfterHoursPercentChange: false,
    Series: [
      {
        Key: config.marketWatchKey,
        Dialect: "Charting",
        Kind: "Ticker",
        SeriesId: "s1",
        DataTypes: ["Last"],
      },
    ],
  };
  const url = new URL("https://api.wsj.net/api/michelangelo/timeseries/history");
  url.searchParams.set("json", JSON.stringify(request));
  url.searchParams.set("ckey", marketWatchToken.slice(0, 10));
  const response = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    headers: {
      Accept: "application/json",
      "Dylan2010.entitlementtoken": marketWatchToken,
      Origin: "https://www.marketwatch.com",
      Referer: config.sourceUrl,
    },
  });
  if (!response.ok)
    throw new Error(`MarketWatch ${config.marketWatchTicker} HTTP ${response.status}`);
  const observations = parseMarketWatchHistory(await response.json(), config);
  if (observations.length < 2)
    throw new Error(`Insufficient MarketWatch ${config.marketWatchTicker} observations`);
  return observations;
}

async function treasurySeries() {
  const year = new Date().getUTCFullYear();
  const years = new Date().getUTCMonth() < 2 ? [year - 1, year] : [year];
  const observations: Observation[] = [];
  for (const current of years) {
    const response = await fetch(
      `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=${current}`,
      { signal: AbortSignal.timeout(20000) },
    );
    if (!response.ok) throw new Error(`Treasury HTTP ${response.status}`);
    observations.push(...parseTreasury(await response.text()));
  }
  if (observations.length < 2) throw new Error("Insufficient Treasury observations");
  return observations;
}

async function fetchSeries(config: SeriesConfig) {
  console.log(`Fetching ${config.id}...`);
  let observations: Observation[] = [];
  let sourceUrl = config.sourceUrl;
  let label = config.label;
  let shortLabel = config.shortLabel;
  let status = "ok";
  try {
    observations = await marketWatchSeries(config);
  } catch (error) {
    status = "fallback";
    console.warn(
      `MarketWatch ${config.marketWatchTicker} unavailable, trying public fallback: ${String(error)}`,
    );
    if (config.id === "DGS10") {
      try {
        observations = await treasurySeries();
        sourceUrl =
          "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve";
      } catch (treasuryError) {
        console.warn(`Treasury unavailable, trying FRED: ${String(treasuryError)}`);
      }
    }
    if (config.id === "CL1") {
      label = "WTI Spot (fallback)";
      shortLabel = "WTI Spot";
      sourceUrl = "https://fred.stlouisfed.org/series/DCOILWTICO";
    } else if (config.id !== "DGS10" || !observations.length) {
      sourceUrl = `https://fred.stlouisfed.org/series/${config.id}`;
    }
  }
  if (!observations.length) {
    const fredId = config.id === "CL1" ? "DCOILWTICO" : config.id;
    const response = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${fredId}`, {
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) throw new Error(`${fredId}: HTTP ${response.status}`);
    observations = parseCsv(await response.text());
  }
  if (observations.length < 2) throw new Error(`${config.id}: fewer than two observations`);

  const history = observations.slice(-30);
  const latest = history.at(-1)!;
  const previous = history.at(-2)!;
  const change = latest.value - previous.value;
  const percentChange = previous.value === 0 ? null : (change / previous.value) * 100;

  console.log(`Fetched ${config.id}: ${latest.date}.`);
  return {
    ...config,
    label,
    shortLabel,
    sourceUrl,
    checkedAt: new Date().toISOString(),
    status,
    latest,
    previous,
    change,
    percentChange,
    basisPointChange: config.id === "DGS10" ? change * 100 : null,
    history,
  };
}

async function main() {
  let existing: { generatedAt?: string; markets?: Awaited<ReturnType<typeof fetchSeries>>[] } = {};
  try {
    existing = JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    /* First run. */
  }
  try {
    const response = await fetch("https://joshuawang.app/data/market-data.json", {
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) {
      const deployed = await response.json();
      if (deployed.markets?.length && deployed.generatedAt > (existing.generatedAt ?? ""))
        existing = deployed;
    }
  } catch {
    /* Keep checked-in fallback. */
  }
  // Fetch sequentially because public market-data endpoints may throttle
  // concurrent downloads from the same deployment runner.
  const markets = [];
  for (const config of series) {
    try {
      markets.push(await fetchSeries(config));
    } catch (error) {
      const previous = existing.markets?.find(
        (market) =>
          market.id === config.id ||
          (config.id === "CL1" && (market as { id: string }).id === "DCOILWTICO"),
      );
      if (previous)
        markets.push(
          config.id === "CL1" && (previous as { id: string }).id === "DCOILWTICO"
            ? {
                ...previous,
                id: "CL1",
                label: "WTI Spot (fallback)",
                shortLabel: "WTI Spot",
                status: "cached",
              }
            : { ...previous, status: "cached" },
        );
      console.warn(`${config.id}: preserving dated fallback if available. ${String(error)}`);
    }
  }
  const snapshot = {
    generatedAt: new Date().toISOString(),
    provider: "MarketWatch, with U.S. Treasury and FRED fallbacks",
    status:
      markets.length === series.length && markets.every((market) => market.status === "ok")
        ? "ok"
        : "partial",
    markets,
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  await mkdir("public/data", { recursive: true });
  await writeFile("public/data/market-data.json", `${JSON.stringify(snapshot)}\n`);
  console.log(`Updated ${outputPath} with ${markets.length} market series.`);
}

if (import.meta.main) await main();
