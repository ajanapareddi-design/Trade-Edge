import { Router } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { db } from "../db.js";
import { watchlistTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getStockQuote } from "../lib/stockData.js";

const router = Router();
router.use(clerkMiddleware());

router.get("/", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const items = await db.select().from(watchlistTable).where(eq(watchlistTable.userId, auth.userId));

  const withQuotes = await Promise.all(
    items.map(async (item) => {
      let quote = null;
      try { quote = await getStockQuote(item.ticker); } catch {}
      return {
        id: item.id,
        userId: item.userId,
        ticker: item.ticker,
        companyName: item.companyName,
        addedAt: item.addedAt.toISOString(),
        quote,
      };
    })
  );

  res.json(withQuotes);
});

router.post("/", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const { ticker, companyName } = req.body;
  if (!ticker) return void res.status(400).json({ error: "ticker is required" });

  const existing = await db.select().from(watchlistTable)
    .where(and(eq(watchlistTable.userId, auth.userId), eq(watchlistTable.ticker, ticker.toUpperCase())))
    .limit(1);

  if (existing.length) return void res.status(409).json({ error: "Already in watchlist" });

  const [item] = await db.insert(watchlistTable).values({
    userId: auth.userId,
    ticker: ticker.toUpperCase(),
    companyName: companyName || ticker.toUpperCase(),
  }).returning();

  res.status(201).json({
    id: item.id,
    userId: item.userId,
    ticker: item.ticker,
    companyName: item.companyName,
    addedAt: item.addedAt.toISOString(),
    quote: null,
  });
});

router.delete("/:ticker", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  await db.delete(watchlistTable).where(
    and(eq(watchlistTable.userId, auth.userId), eq(watchlistTable.ticker, req.params.ticker.toUpperCase()))
  );

  res.json({ success: true, message: null });
});

export { router as watchlistRouter };
