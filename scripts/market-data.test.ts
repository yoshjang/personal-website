import { test, expect } from "bun:test";
import { parseCsv, parseTreasury } from "./generate-market-data";
import { cleanArticles, relatedArticles } from "../src/lib/market-news";

test("missing CSV values never become zero prices; observations are chronological", () => {
  expect(
    parseCsv(
      "DATE,VALUE\n2026-01-03,4.2\n2026-01-01,4.1\n2026-01-02,\n2026-01-04,.\n2026-01-05,NaN",
    ),
  ).toEqual([
    { date: "2026-01-01", value: 4.1 },
    { date: "2026-01-03", value: 4.2 },
  ]);
});
test("Treasury parser reads the ten-year field and rejects missing values", () => {
  expect(
    parseTreasury(
      '<feed xmlns:d="d" xmlns:m="m"><entry><content><m:properties><d:NEW_DATE>2026-01-02T00:00:00</d:NEW_DATE><d:BC_10YEAR>4.2</d:BC_10YEAR></m:properties></content></entry><entry><content><m:properties><d:NEW_DATE>2026-01-03T00:00:00</d:NEW_DATE><d:BC_10YEAR /></m:properties></content></entry></feed>',
    ),
  ).toEqual([{ date: "2026-01-02", value: 4.2 }]);
});
const article = {
  title: "Treasury yields decline",
  source: "Example",
  url: "https://example.com/news",
  publishedAt: "2026-01-02T10:00:00Z",
};
test("headline cleanup rejects unsafe links, duplicates, future dates and stale articles", () => {
  const articles = [
    article,
    { ...article, url: article.url + "?utm_source=rss" },
    { ...article, url: "javascript:alert(1)" },
    { ...article, title: "Future", publishedAt: "2027-01-01" },
    { ...article, title: "Old", publishedAt: "2025-01-01" },
  ];
  expect(cleanArticles(articles, Date.parse("2026-01-03"))).toEqual([article]);
});
test("context never attributes a later headline to an earlier market observation", () => {
  expect(relatedArticles([article], "DGS10", "2026-01-01")).toHaveLength(0);
  expect(relatedArticles([article], "DGS10", "2026-01-02")).toHaveLength(1);
  expect(relatedArticles([article], "DCOILWTICO", "2026-01-02")).toHaveLength(0);
});
