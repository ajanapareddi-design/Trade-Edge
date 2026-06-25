import { Router } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { db } from "../db.js";
import { portfolioHoldingTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getStockQuote } from "../lib/stockData.js";

const router = Router();
router.use(clerkMiddleware());

router.get("/holdings", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const holdings = await db.select().from(portfolioHoldingTable)
    .where(eq(portfolioHoldingTable.userId, auth.userId));

  const enriched = await Promise.all(
    holdings.map(async (h) => {
      let currentPrice: number | null = null;
      let totalValue: number | null = null;
      let gainLoss: number | null = null;
      let gainLossPercent: number | null = null;
      let sparkline: number[] = [];

      try {
        const q = await getStockQuote(h.ticker);
        currentPrice = q.price;
        totalValue = parseFloat((q.price * h.shares).toFixed(2));
        gainLoss = parseFloat(((q.price - h.avgCost) * h.shares).toFixed(2));
        gainLossPercent = h.avgCost > 0
          ? parseFloat((((q.price - h.avgCost) / h.avgCost) * 100).toFixed(2))
          : 0;
        sparkline = q.sparkline;
      } catch {}

      return {
        id: h.id,
        userId: h.userId,
        ticker: h.ticker,
        companyName: h.companyName,
        shares: h.shares,
        avgCost: h.avgCost,
        addedAt: h.addedAt.toISOString(),
        currentPrice,
        totalValue,
        gainLoss,
        gainLossPercent,
        sparkline,
      };
    })
  );

  res.json(enriched);
});

router.post("/holdings", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const { ticker, companyName, shares, avgCost } = req.body;
  if (!ticker || !shares || !avgCost) return void res.status(400).json({ error: "ticker, shares, avgCost required" });

  const [holding] = await db.insert(portfolioHoldingTable).values({
    userId: auth.userId,
    ticker: ticker.toUpperCase(),
    companyName: companyName || ticker.toUpperCase(),
    shares: parseFloat(shares),
    avgCost: parseFloat(avgCost),
  }).returning();

  res.status(201).json({
    id: holding.id,
    userId: holding.userId,
    ticker: holding.ticker,
    companyName: holding.companyName,
    shares: holding.shares,
    avgCost: holding.avgCost,
    addedAt: holding.addedAt.toISOString(),
    currentPrice: null,
    totalValue: null,
    gainLoss: null,
    gainLossPercent: null,
    sparkline: [],
  });
});

router.patch("/holdings/:id", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const id = parseInt(req.params.id);
  const [existing] = await db.select().from(portfolioHoldingTable)
    .where(and(eq(portfolioHoldingTable.id, id), eq(portfolioHoldingTable.userId, auth.userId)))
    .limit(1);

  if (!existing) return void res.status(404).json({ error: "Holding not found" });

  const { shares, avgCost } = req.body;
  const updateData: any = { updatedAt: new Date() };
  if (shares !== undefined) updateData.shares = parseFloat(shares);
  if (avgCost !== undefined) updateData.avgCost = parseFloat(avgCost);

  await db.update(portfolioHoldingTable).set(updateData)
    .where(eq(portfolioHoldingTable.id, id));

  const [updated] = await db.select().from(portfolioHoldingTable).where(eq(portfolioHoldingTable.id, id)).limit(1);
  res.json({
    id: updated.id,
    userId: updated.userId,
    ticker: updated.ticker,
    companyName: updated.companyName,
    shares: updated.shares,
    avgCost: updated.avgCost,
    addedAt: updated.addedAt.toISOString(),
    currentPrice: null,
    totalValue: null,
    gainLoss: null,
    gainLossPercent: null,
    sparkline: [],
  });
});

router.delete("/holdings/:id", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const id = parseInt(req.params.id);
  await db.delete(portfolioHoldingTable)
    .where(and(eq(portfolioHoldingTable.id, id), eq(portfolioHoldingTable.userId, auth.userId)));

  res.json({ success: true, message: null });
});

router.get("/summary", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const holdings = await db.select().from(portfolioHoldingTable)
    .where(eq(portfolioHoldingTable.userId, auth.userId));

  if (!holdings.length) {
    return void res.json({ totalValue: 0, holdings: [] });
  }

  const enriched = await Promise.all(
    holdings.map(async (h) => {
      let value = h.shares * h.avgCost;
      try {
        const q = await getStockQuote(h.ticker);
        value = q.price * h.shares;
      } catch {}
      return { ticker: h.ticker, companyName: h.companyName, value };
    })
  );

  const totalValue = enriched.reduce((sum, e) => sum + e.value, 0);
  const slices = enriched.map(e => ({
    ticker: e.ticker,
    companyName: e.companyName,
    value: parseFloat(e.value.toFixed(2)),
    percentage: totalValue > 0 ? parseFloat(((e.value / totalValue) * 100).toFixed(1)) : 0,
  }));

  res.json({ totalValue: parseFloat(totalValue.toFixed(2)), holdings: slices });
});

export { router as portfolioRouter };
