import { Router } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { db } from "../db.js";
import {
  paperPortfolioTable, paperPositionTable, paperTradeTable, paperPerformanceTable,
} from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { getStockQuote } from "../lib/stockData.js";

const router = Router();
router.use(clerkMiddleware());

const STARTING_BALANCE = 50000;

async function getOrCreatePortfolio(userId: string) {
  let [portfolio] = await db.select().from(paperPortfolioTable).where(eq(paperPortfolioTable.userId, userId)).limit(1);
  if (!portfolio) {
    [portfolio] = await db.insert(paperPortfolioTable).values({
      userId,
      cashBalance: STARTING_BALANCE,
      startingBalance: STARTING_BALANCE,
    }).returning();
  }
  return portfolio;
}

router.get("/portfolio", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const portfolio = await getOrCreatePortfolio(auth.userId);
  const positions = await db.select().from(paperPositionTable).where(eq(paperPositionTable.userId, auth.userId));

  let positionsValue = 0;
  let unrealizedPnl = 0;
  for (const pos of positions) {
    try {
      const q = await getStockQuote(pos.ticker);
      positionsValue += q.price * pos.shares;
      unrealizedPnl += (q.price - pos.avgCost) * pos.shares;
    } catch {}
  }

  res.json({
    userId: portfolio.userId,
    cashBalance: portfolio.cashBalance,
    totalValue: parseFloat((portfolio.cashBalance + positionsValue).toFixed(2)),
    unrealizedPnl: parseFloat(unrealizedPnl.toFixed(2)),
    startingBalance: portfolio.startingBalance,
  });
});

router.get("/positions", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const positions = await db.select().from(paperPositionTable).where(eq(paperPositionTable.userId, auth.userId));

  const withPrices = await Promise.all(
    positions.map(async (pos) => {
      let currentPrice = pos.avgCost;
      try { currentPrice = (await getStockQuote(pos.ticker)).price; } catch {}
      const totalValue = currentPrice * pos.shares;
      const unrealizedPnl = (currentPrice - pos.avgCost) * pos.shares;
      const unrealizedPnlPercent = pos.avgCost > 0 ? ((currentPrice - pos.avgCost) / pos.avgCost) * 100 : 0;
      return {
        id: pos.id,
        ticker: pos.ticker,
        companyName: pos.companyName,
        shares: pos.shares,
        avgCost: pos.avgCost,
        currentPrice,
        totalValue: parseFloat(totalValue.toFixed(2)),
        unrealizedPnl: parseFloat(unrealizedPnl.toFixed(2)),
        unrealizedPnlPercent: parseFloat(unrealizedPnlPercent.toFixed(2)),
      };
    })
  );

  res.json(withPrices);
});

router.post("/trade", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const { ticker, shares, action } = req.body;
  if (!ticker || !shares || !action) return void res.status(400).json({ error: "ticker, shares, action required" });
  if (!["buy", "sell"].includes(action)) return void res.status(400).json({ error: "action must be buy or sell" });
  if (shares <= 0) return void res.status(400).json({ error: "shares must be positive" });

  const portfolio = await getOrCreatePortfolio(auth.userId);
  let quote;
  try { quote = await getStockQuote(ticker.toUpperCase()); }
  catch { return void res.status(400).json({ error: "Could not fetch quote for ticker" }); }

  const price = quote.price;
  const total = parseFloat((price * shares).toFixed(2));

  if (action === "buy") {
    if (portfolio.cashBalance < total) {
      return void res.status(400).json({ error: `Insufficient funds. Need $${total.toFixed(2)}, have $${portfolio.cashBalance.toFixed(2)}` });
    }

    const newCash = parseFloat((portfolio.cashBalance - total).toFixed(2));
    await db.update(paperPortfolioTable).set({ cashBalance: newCash, updatedAt: new Date() })
      .where(eq(paperPortfolioTable.userId, auth.userId));

    // Update or create position
    const [existing] = await db.select().from(paperPositionTable)
      .where(and(eq(paperPositionTable.userId, auth.userId), eq(paperPositionTable.ticker, ticker.toUpperCase())))
      .limit(1);

    if (existing) {
      const newShares = existing.shares + shares;
      const newAvgCost = (existing.avgCost * existing.shares + price * shares) / newShares;
      await db.update(paperPositionTable).set({
        shares: parseFloat(newShares.toFixed(6)),
        avgCost: parseFloat(newAvgCost.toFixed(4)),
        updatedAt: new Date(),
      }).where(eq(paperPositionTable.id, existing.id));
    } else {
      await db.insert(paperPositionTable).values({
        userId: auth.userId,
        ticker: ticker.toUpperCase(),
        companyName: quote.companyName || ticker,
        shares: parseFloat(shares.toFixed(6)),
        avgCost: parseFloat(price.toFixed(4)),
      });
    }
  } else {
    const [existing] = await db.select().from(paperPositionTable)
      .where(and(eq(paperPositionTable.userId, auth.userId), eq(paperPositionTable.ticker, ticker.toUpperCase())))
      .limit(1);

    if (!existing || existing.shares < shares) {
      return void res.status(400).json({ error: `Insufficient shares. Have ${existing?.shares || 0}, need ${shares}` });
    }

    const newCash = parseFloat((portfolio.cashBalance + total).toFixed(2));
    await db.update(paperPortfolioTable).set({ cashBalance: newCash, updatedAt: new Date() })
      .where(eq(paperPortfolioTable.userId, auth.userId));

    const remainingShares = parseFloat((existing.shares - shares).toFixed(6));
    if (remainingShares < 0.001) {
      await db.delete(paperPositionTable).where(eq(paperPositionTable.id, existing.id));
    } else {
      await db.update(paperPositionTable).set({ shares: remainingShares, updatedAt: new Date() })
        .where(eq(paperPositionTable.id, existing.id));
    }
  }

  const [updatedPortfolio] = await db.select().from(paperPortfolioTable).where(eq(paperPortfolioTable.userId, auth.userId)).limit(1);

  const [trade] = await db.insert(paperTradeTable).values({
    userId: auth.userId,
    ticker: ticker.toUpperCase(),
    companyName: quote.companyName || ticker,
    shares: parseFloat(shares.toFixed(6)),
    price: parseFloat(price.toFixed(4)),
    action,
    total,
    portfolioValueAfter: updatedPortfolio.cashBalance,
  }).returning();

  // Record performance snapshot
  const today = new Date().toISOString().split("T")[0];
  const positions = await db.select().from(paperPositionTable).where(eq(paperPositionTable.userId, auth.userId));
  let posValue = 0;
  for (const pos of positions) {
    try { posValue += (await getStockQuote(pos.ticker)).price * pos.shares; } catch { posValue += pos.avgCost * pos.shares; }
  }
  const totalVal = parseFloat((updatedPortfolio.cashBalance + posValue).toFixed(2));

  await db.insert(paperPerformanceTable).values({
    userId: auth.userId,
    date: today,
    value: totalVal,
  }).onConflictDoNothing();

  res.json({
    success: true,
    trade: {
      id: trade.id,
      ticker: trade.ticker,
      companyName: trade.companyName,
      shares: trade.shares,
      price: trade.price,
      action: trade.action,
      total: trade.total,
      executedAt: trade.executedAt.toISOString(),
    },
    portfolio: {
      userId: updatedPortfolio.userId,
      cashBalance: updatedPortfolio.cashBalance,
      totalValue: totalVal,
      unrealizedPnl: 0,
      startingBalance: updatedPortfolio.startingBalance,
    },
    message: null,
  });
});

router.get("/history", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const trades = await db.select().from(paperTradeTable)
    .where(eq(paperTradeTable.userId, auth.userId))
    .orderBy(desc(paperTradeTable.executedAt))
    .limit(100);

  res.json(trades.map(t => ({
    id: t.id,
    ticker: t.ticker,
    companyName: t.companyName,
    shares: t.shares,
    price: t.price,
    action: t.action,
    total: t.total,
    executedAt: t.executedAt.toISOString(),
  })));
});

router.get("/performance", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const portfolio = await getOrCreatePortfolio(auth.userId);
  const records = await db.select().from(paperPerformanceTable)
    .where(eq(paperPerformanceTable.userId, auth.userId))
    .orderBy(paperPerformanceTable.date)
    .limit(90);

  if (!records.length) {
    const today = new Date().toISOString().split("T")[0];
    return void res.json([{ date: today, value: portfolio.cashBalance }]);
  }

  res.json(records.map(r => ({ date: r.date, value: r.value })));
});

export { router as paperTradeRouter };
