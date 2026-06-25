# FinEdge

A Bloomberg-terminal-meets-mobile-app for self-directed investors and day traders — financial literacy lessons, real stock discovery, paper trading, and portfolio tracking.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied to `/api`)
- `pnpm --filter @workspace/finedge run dev` — run the frontend (port 19479, proxied to `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`
- Optional env: `ALPHA_VANTAGE_API_KEY` — real stock data (falls back to mock data without it)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Clerk auth, TailwindCSS + shadcn/ui
- Charts: lightweight-charts (candlesticks), Recharts (sparklines/pie)
- API: Express 5 with Clerk middleware
- DB: PostgreSQL + Drizzle ORM
- Auth: Clerk (whitelabel, proxy at `/api/__clerk`)
- Payments: Stripe ($7.99/month Pro subscription)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (don't edit manually)
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (don't edit manually)
- `lib/db/src/schema/` — Drizzle table schemas (users, watchlist, paper_trade, portfolio, quiz)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/` — lessons data, stock data service
- `artifacts/finedge/src/pages/` — React pages (landing, learn, trade, portfolio, profile)
- `artifacts/finedge/src/components/` — shared UI components

## Architecture decisions

- Clerk auth proxied through the API server at `/api/__clerk` for custom domain support
- Stripe webhook route registered BEFORE express.json() to receive raw body
- Stock data falls back to realistic mock data when ALPHA_VANTAGE_API_KEY is absent
- Paper trading starts with $50,000 virtual USD per user, persisted in PostgreSQL
- Free tier: Learn page. Pro tier ($7.99/mo via Stripe): Trade, Portfolio, Paper Trading, Watchlist

## Product

- **Learn** (free): Daily financial literacy lesson + learning streak tracker + upcoming lesson previews
- **Trade** (Pro): Onboarding quiz → curated stock discovery with candlestick charts → Watchlist → Paper trading
- **Portfolio** (Pro): Smart insight cards (AI-style) + interactive pie chart + real holdings tracker
- **Profile**: Subscription management (Stripe checkout/portal), quiz preferences, account info

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- Run `pnpm run typecheck:libs` before checking leaf packages if DB schema changed
- OpenAPI operations with both path params AND query params can cause Orval naming collisions — test with codegen after adding query params
- lightweight-charts v5: use `chart.addSeries(CandlestickSeries, opts)` not `addCandlestickSeries()`
- Stripe webhook must be mounted BEFORE express.json() or it fails with raw body parsing

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.local/skills/clerk-auth/SKILL.md` for Clerk configuration
- See `.local/skills/stripe/SKILL.md` for Stripe integration patterns
