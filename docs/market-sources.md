# Market source review

Reviewed September 7, 2026.

| Metric             | Primary source                                      | Fallback                                   |
| ------------------ | --------------------------------------------------- | ------------------------------------------ |
| Dow and S&P 500    | MarketWatch daily index closes                      | Matching FRED daily index series           |
| U.S. 10-year yield | MarketWatch U.S. 10 Year Treasury Note quoted yield | U.S. Treasury public XML, followed by FRED |
| WTI crude          | MarketWatch front-month NYMEX futures settlement    | FRED's EIA Cushing spot series             |

Sources:

- https://fred.stlouisfed.org/series/SP500
- https://fred.stlouisfed.org/series/DJIA
- https://www.marketwatch.com/investing/index/djia
- https://www.marketwatch.com/investing/index/spx
- https://www.marketwatch.com/investing/bond/tmubmusd10y
- https://www.marketwatch.com/investing/future/cl.1
- https://home.treasury.gov/treasury-daily-interest-rate-xml-feed
- https://fred.stlouisfed.org/series/DGS10
- https://fred.stlouisfed.org/series/DCOILWTICO
- https://www.eia.gov/todayinenergy/prices.php

The generator requests MarketWatch's official daily close for each series and excludes intraday mock ticks. Each source is isolated so one failure does not block the other cards. If MarketWatch is unavailable, the card uses the public fallback listed above and reports a partial refresh. The WTI fallback changes its label to `WTI Spot (fallback)` so futures and spot instruments are never silently mixed.

## Headlines and context

Publisher feeds listed at https://www.cnbc.com/rss-feeds/ and Federal Reserve monetary releases listed at https://www.federalreserve.gov/feeds/feeds.htm are fetched at build time. Only titles, publication dates, attribution and links are displayed. No article bodies are copied. Topic matching is heuristic.

Requests have deadlines and are isolated so a failed feed does not blank all headlines. A clean checkout can recover the last deployed JSON. Cached headlines retain their publication dates and expire from the next generated snapshot after 14 days. The existing daily GitHub Pages workflow runs the generators before prerendering.

Metric context only links news published on or before the metric's observation date, within a three-day lookback. It describes potential channels and explicitly does not assert causation. If no matching coverage is available, the site says it cannot confirm a specific driver. Industry notes are general analytical context, not invented daily returns.

## Validation

Run `bun test scripts/market-data.test.ts`, `bun run generate:headlines`, `bun run generate:markets`, and `bun run build`. Individual market refresh failures preserve that series' dated fallback while allowing other series to update. Blank CSV cells are excluded rather than interpreted as zero.
