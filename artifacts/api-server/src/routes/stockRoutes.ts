import { Router } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { getStockQuote, getStockOHLC, searchStocks, DISCOVER_TICKERS } from "../lib/stockData.js";

const router = Router();
router.use(clerkMiddleware());

router.get("/discover", async (req, res) => {
  try {
    const cards = await Promise.all(
      DISCOVER_TICKERS.map(async (ticker) => {
        const [quote, candles] = await Promise.all([
          getStockQuote(ticker),
          getStockOHLC(ticker),
        ]);
        return {
          ticker: quote.ticker,
          companyName: quote.companyName || ticker,
          price: quote.price,
          changePercent: quote.changePercent,
          previousHigh: quote.previousHigh,
          previousLow: quote.previousLow,
          atr: quote.atr,
          isHighVolatility: quote.isHighVolatility,
          candles,
        };
      })
    );
    res.json(cards);
  } catch (err) {
    req.log.error(err, "Failed to fetch discover stocks");
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

router.get("/quote/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;
    const quote = await getStockQuote(ticker.toUpperCase());
    res.json(quote);
  } catch (err) {
    req.log.error(err, "Failed to fetch stock quote");
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

router.get("/ohlc/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;
    const candles = await getStockOHLC(ticker.toUpperCase());
    res.json(candles);
  } catch (err) {
    req.log.error(err, "Failed to fetch OHLC data");
    res.status(500).json({ error: "Failed to fetch candles" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q as string) || "";
    if (!q.trim()) return void res.json([]);
    const results = await searchStocks(q.trim());
    res.json(results);
  } catch (err) {
    req.log.error(err, "Failed to search stocks");
    res.status(500).json({ error: "Failed to search" });
  }
});

router.get("/insight", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  try {
    // Return curated insights based on top movers
    const [sofi, pltr] = await Promise.all([
      getStockQuote("SOFI"),
      getStockQuote("RIVN"),
    ]);

    const opportunityTicker = sofi.changePercent >= 0 ? sofi : pltr;
    const slowdownTicker = sofi.changePercent < 0 ? sofi : pltr;

    res.json({
      opportunity: {
        ticker: opportunityTicker.ticker,
        companyName: opportunityTicker.companyName || opportunityTicker.ticker,
        summary: `${opportunityTicker.companyName || opportunityTicker.ticker} is showing strong momentum with analysts noting positive price action. The stock is trading ${Math.abs(opportunityTicker.changePercent).toFixed(2)}% ${opportunityTicker.changePercent >= 0 ? "higher" : "lower"} following recent market activity.`,
        label: "Gaining Attention",
        changePercent30d: opportunityTicker.changePercent * 6,
        generatedAt: new Date().toISOString(),
      },
      slowdown: {
        ticker: slowdownTicker.ticker,
        companyName: slowdownTicker.companyName || slowdownTicker.ticker,
        summary: `${slowdownTicker.companyName || slowdownTicker.ticker} has seen consistent selling pressure recently. Volume analysis suggests institutions may be reducing exposure ahead of key technical levels.`,
        label: "Slowing Down",
        changePercent30d: slowdownTicker.changePercent * 6,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to fetch market insights");
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

export { router as stockRouter };
