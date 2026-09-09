# Market source review

Reviewed September 7, 2026.

| Metric             | Decision                                             | Reason                                                                                                                                                                                                                                       |
| ------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dow and S&P 500    | Retain FRED daily closes                             | The live site's September 4 observation matches FRED. Refreshing the page cannot produce a new close before the next trading session. FRED identifies S&P Dow Jones Indices as the provider; existing redistribution conditions still apply. |
| U.S. 10-year yield | Prefer Treasury's public XML feed, fall back to FRED | The direct feed returned September 4 while the old site showed September 3. Both represent constant-maturity/par-curve yields, not a tradable bond's last price.                                                                             |
| WTI spot           | Retain FRED's EIA series and its observation date    | FRED itself last showed September 1. Daily observation frequency does not imply same-day publication. A WTI futures settlement is a different instrument and must not silently replace spot history.                                         |

Sources:

- https://fred.stlouisfed.org/series/SP500
- https://fred.stlouisfed.org/series/DJIA
- https://home.treasury.gov/treasury-daily-interest-rate-xml-feed
- https://fred.stlouisfed.org/series/DGS10
- https://fred.stlouisfed.org/series/DCOILWTICO
- https://www.eia.gov/todayinenergy/prices.php

EIA's daily prices page is an alternative display of spot and futures data, with third-party attribution. It does not by itself establish a faster, unrestricted API for the same WTI spot series. A licensed futures feed could support a separately labeled daily futures card; that change would require choosing an instrument, contract-roll method and provider terms.

## Headlines and context

Publisher feeds listed at https://www.cnbc.com/rss-feeds/ and Federal Reserve monetary releases listed at https://www.federalreserve.gov/feeds/feeds.htm are fetched at build time. Only titles, publication dates, attribution and links are displayed. No article bodies are copied. Topic matching is heuristic.

Requests have deadlines and are isolated so a failed feed does not blank all headlines. A clean checkout can recover the last deployed JSON. Cached headlines retain their publication dates and expire from the next generated snapshot after 14 days. The existing daily GitHub Pages workflow runs the generators before prerendering.

Metric context only links news published on or before the metric's observation date, within a three-day lookback. It describes potential channels and explicitly does not assert causation. If no matching coverage is available, the site says it cannot confirm a specific driver. Industry notes are general analytical context, not invented daily returns.

## Validation

Run `bun test scripts/market-data.test.ts`, `bun run generate:headlines`, `bun run generate:markets`, and `bun run build`. Individual market refresh failures preserve that series' dated fallback while allowing other series to update. Blank CSV cells are excluded rather than interpreted as zero.
