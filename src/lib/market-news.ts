export type Article = { title: string; url: string; source: string; publishedAt: string };
export type NewsGroup = { updatedAt: string | null; status: string; articles: Article[] };
export type NewsSnapshot = { generatedAt: string; groups: Record<string, NewsGroup> };

// These are screening rules, not claims that an event caused a price move.
export const industries = [
  {
    id: "technology",
    name: "Technology",
    pattern: /\b(ai|software|chip|semiconductor|nvidia|microsoft|apple|tech)\b/i,
    context:
      "Watch earnings guidance, chip demand and AI investment. Changes in expected growth and financing costs can affect technology valuations.",
  },
  {
    id: "financials",
    name: "Financials",
    pattern: /\b(bank|banks|banking|lender|credit|insurance|financial)\b/i,
    context:
      "Watch the yield curve, lending demand and credit losses. These can affect banks' margins and the earnings outlook for financial firms.",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    pattern: /\b(health|healthcare|drug|pharma|biotech|fda|hospital)\b/i,
    context:
      "Watch clinical results, drug approvals and reimbursement policy. These can change revenue expectations and acquisition interest.",
  },
  {
    id: "energy",
    name: "Energy",
    pattern: /\b(oil|gas|energy|opec|crude|petroleum|refiner)\b/i,
    context:
      "Watch crude supply, inventories and demand. Higher oil prices can support producers while raising costs for refiners and energy users.",
  },
  {
    id: "industrials",
    name: "Industrials",
    pattern:
      /\b(industrial|manufactur|factory|airline|aerospace|boeing|defense|transport|freight)/i,
    context:
      "Watch orders, capital spending and transport demand. Tariffs and fuel costs can alter margins even when sales remain steady.",
  },
  {
    id: "discretionary",
    name: "Consumer discretionary",
    pattern: /\b(retail|consumer|auto|tesla|amazon|travel|restaurant|luxury)\b/i,
    context:
      "Watch discretionary spending, employment and consumer credit. These can affect demand for vehicles, travel and nonessential goods.",
  },
  {
    id: "staples",
    name: "Consumer staples",
    pattern: /\b(grocery|food|beverage|staples|walmart|costco|procter)\b/i,
    context:
      "Watch input costs and shoppers' response to price increases. Sales volumes and pricing power can move in different directions.",
  },
  {
    id: "communication",
    name: "Communication services",
    pattern: /\b(telecom|streaming|advertising|meta|alphabet|google|netflix|disney|media)\b/i,
    context:
      "Watch advertising demand, subscriber trends and content spending. These can change revenue growth and cash flow expectations.",
  },
  {
    id: "materials",
    name: "Materials",
    pattern: /\b(metal|copper|steel|aluminum|gold|mining|chemical|materials)\b/i,
    context:
      "Watch commodity demand, construction and manufacturing activity. Selling prices and energy costs can move producers' margins.",
  },
  {
    id: "real-estate",
    name: "Real estate",
    pattern: /\b(housing|mortgage|property|real estate|reit|office)\b/i,
    context:
      "Watch borrowing costs, occupancy and rents. Higher yields can increase refinancing costs and pressure property valuations.",
  },
  {
    id: "utilities",
    name: "Utilities",
    pattern: /\b(utility|utilities|electricity|power grid|power demand|renewable)\b/i,
    context:
      "Watch power demand, regulated returns and infrastructure spending. Interest rates can affect the cost of funding long-lived assets.",
  },
] as const;

export const metricContext: Record<string, { pattern: RegExp; text: string }> = {
  DJIA: {
    pattern: /\b(dow|tariffs?|jobs report|payrolls?|inflation|fed)\b/i,
    text: "Earnings guidance, economic releases and trade policy can shift expectations for the large companies in the Dow.",
  },
  SP500: {
    pattern: /\b(stock|s&p|earnings|inflation|fed|payroll|tech)\b/i,
    text: "Earnings expectations and interest-rate repricing can influence the S&P 500; large constituents can have an outsized effect.",
  },
  DGS10: {
    pattern: /\b(treasury|yield|inflation|fed|payroll|jobs|bond)\b/i,
    text: "Inflation and employment releases, Fed expectations and Treasury supply can influence the 10-year yield.",
  },
  DCOILWTICO: {
    pattern: /\b(oil|crude|opec|energy|inventory|inventories|petroleum)\b/i,
    text: "Supply disruptions, inventory changes and demand expectations can influence WTI spot prices.",
  },
};

export function relatedArticles(articles: Article[], id: string, observationDate: string) {
  const end = Date.parse(`${observationDate}T23:59:59Z`);
  return articles
    .filter((a) => {
      const published = Date.parse(a.publishedAt);
      return (
        published <= end &&
        published >= end - 3 * 86400000 &&
        metricContext[id]?.pattern.test(a.title)
      );
    })
    .slice(0, 2);
}

export function cleanArticles(articles: Article[], now = Date.now()): Article[] {
  const urls = new Set<string>(),
    titles = new Set<string>();
  return articles
    .filter((a) => {
      try {
        const url = new URL(a.url);
        const date = Date.parse(a.publishedAt);
        if (
          !/^https?:$/.test(url.protocol) ||
          !a.title?.trim() ||
          !a.source ||
          !Number.isFinite(date) ||
          date > now ||
          date < now - 14 * 86400000
        )
          return false;
        url.hash = "";
        for (const key of [...url.searchParams.keys()])
          if (key.startsWith("utm_")) url.searchParams.delete(key);
        a.url = url.toString();
        const title = a.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, " ")
          .trim();
        if (urls.has(a.url) || titles.has(title)) return false;
        urls.add(a.url);
        titles.add(title);
        return true;
      } catch {
        return false;
      }
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
