const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// Cache to respect free tier rate limits (5 calls/min, 500/day)
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 min

async function fetchWithCache(url: string, cacheKey: string): Promise<any> {
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL) return cached.data;

  const resp = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  cache.set(cacheKey, { data, ts: now });
  return data;
}

export interface OHLCCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuoteData {
  ticker: string;
  companyName: string | null;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  previousHigh: number;
  previousLow: number;
  volume: number | null;
  avgVolume: number | null;
  atr: number | null;
  isHighVolatility: boolean;
  sparkline: number[];
}

// Fallback mock data when API key not available
function getMockQuote(ticker: string): StockQuoteData {
  const seed = ticker.charCodeAt(0) + ticker.charCodeAt(ticker.length - 1);
  const base = 20 + (seed % 60);
  const change = ((seed % 7) - 3) * 0.5;
  return {
    ticker,
    companyName: MOCK_COMPANIES[ticker] || ticker,
    price: parseFloat((base + change).toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / base) * 100).toFixed(2)),
    previousClose: parseFloat(base.toFixed(2)),
    previousHigh: parseFloat((base + Math.abs(change) + 0.5).toFixed(2)),
    previousLow: parseFloat((base - Math.abs(change) - 0.3).toFixed(2)),
    volume: 3_500_000 + (seed * 100000),
    avgVolume: 4_000_000,
    atr: parseFloat((base * 0.025).toFixed(2)),
    isHighVolatility: false,
    sparkline: Array.from({ length: 5 }, (_, i) => parseFloat((base + (i - 2) * 0.3).toFixed(2))),
  };
}

function getMockCandles(ticker: string): OHLCCandle[] {
  const seed = ticker.charCodeAt(0);
  const base = 20 + (seed % 60);
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (4 - i));
    const o = base + (Math.random() - 0.5) * 2;
    const c = o + (Math.random() - 0.5) * 1.5;
    const h = Math.max(o, c) + Math.random() * 0.5;
    const l = Math.min(o, c) - Math.random() * 0.5;
    return {
      time: d.toISOString().split("T")[0],
      open: parseFloat(o.toFixed(2)),
      high: parseFloat(h.toFixed(2)),
      low: parseFloat(l.toFixed(2)),
      close: parseFloat(c.toFixed(2)),
      volume: Math.floor(1_000_000 + Math.random() * 5_000_000),
    };
  });
}

const MOCK_COMPANIES: Record<string, string> = {
  AAPL: "Apple Inc.", TSLA: "Tesla Inc.", NVDA: "NVIDIA Corp.", AMD: "Advanced Micro Devices",
  SOFI: "SoFi Technologies", PLTR: "Palantir Technologies", RIVN: "Rivian Automotive",
  LCID: "Lucid Group", F: "Ford Motor Co.", GME: "GameStop Corp.", AMC: "AMC Entertainment",
  BBBY: "Bed Bath & Beyond", HOOD: "Robinhood Markets", COIN: "Coinbase Global",
  SNAP: "Snap Inc.", PINS: "Pinterest Inc.", UBER: "Uber Technologies", LYFT: "Lyft Inc.",
  DKNG: "DraftKings Inc.", RBLX: "Roblox Corp.", CLOV: "Clover Health", BB: "BlackBerry Ltd.",
  NOK: "Nokia Corp.", SPCE: "Virgin Galactic", WKHS: "Workhorse Group", XPEV: "XPeng Inc.",
  NIO: "NIO Inc.", NKLA: "Nikola Corp.", CTRM: "Castor Maritime", SNDL: "Sundial Growers",
};

export async function getStockQuote(ticker: string): Promise<StockQuoteData> {
  if (!ALPHA_VANTAGE_KEY) return getMockQuote(ticker);

  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`;
    const data = await fetchWithCache(url, `quote_${ticker}`);
    const q = data["Global Quote"];
    if (!q || !q["05. price"]) return getMockQuote(ticker);

    const price = parseFloat(q["05. price"]);
    const prevClose = parseFloat(q["08. previous close"]);
    const change = parseFloat(q["09. change"]);
    const changePercent = parseFloat(q["10. change percent"]?.replace("%", "") || "0");
    const volume = parseInt(q["06. volume"] || "0");

    // Get daily for high/low/ATR
    const dailyUrl = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${ALPHA_VANTAGE_KEY}`;
    let prevHigh = price;
    let prevLow = price;
    let atr: number | null = null;
    let sparkline: number[] = [prevClose, price];
    let avgVolume: number | null = null;

    try {
      const daily = await fetchWithCache(dailyUrl, `daily_${ticker}`);
      const series = daily["Time Series (Daily)"];
      if (series) {
        const dates = Object.keys(series).sort().reverse();
        if (dates[0]) {
          prevHigh = parseFloat(series[dates[0]]["2. high"]);
          prevLow = parseFloat(series[dates[0]]["3. low"]);
        }
        // ATR approx using last 14 days
        const candles = dates.slice(0, 14).map(d => ({
          h: parseFloat(series[d]["2. high"]),
          l: parseFloat(series[d]["3. low"]),
          c: parseFloat(series[d]["4. close"]),
        }));
        if (candles.length >= 2) {
          const trs = candles.slice(0, -1).map((c, i) => {
            const prev = candles[i + 1];
            return Math.max(c.h - c.l, Math.abs(c.h - prev.c), Math.abs(c.l - prev.c));
          });
          atr = trs.reduce((a, b) => a + b, 0) / trs.length;
        }
        sparkline = dates.slice(0, 20).reverse().map(d => parseFloat(series[d]["4. close"]));
        // avg volume from last 20 days
        const vols = dates.slice(0, 20).map(d => parseInt(series[d]["5. volume"] || "0"));
        avgVolume = Math.round(vols.reduce((a, b) => a + b, 0) / vols.length);
      }
    } catch {}

    const isHighVolatility = atr != null && price > 0 && (Math.abs(changePercent) > 3.5 || atr / price > 0.015 * 1.5);

    return {
      ticker,
      companyName: MOCK_COMPANIES[ticker] || ticker,
      price,
      change,
      changePercent,
      previousClose: prevClose,
      previousHigh: prevHigh,
      previousLow: prevLow,
      volume,
      avgVolume,
      atr: atr ? parseFloat(atr.toFixed(3)) : null,
      isHighVolatility,
      sparkline,
    };
  } catch {
    return getMockQuote(ticker);
  }
}

export async function getStockOHLC(ticker: string): Promise<OHLCCandle[]> {
  if (!ALPHA_VANTAGE_KEY) return getMockCandles(ticker);

  try {
    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${ALPHA_VANTAGE_KEY}`;
    const data = await fetchWithCache(url, `daily_${ticker}`);
    const series = data["Time Series (Daily)"];
    if (!series) return getMockCandles(ticker);

    return Object.keys(series)
      .sort()
      .reverse()
      .slice(0, 100)
      .reverse()
      .map(date => ({
        time: date,
        open: parseFloat(series[date]["1. open"]),
        high: parseFloat(series[date]["2. high"]),
        low: parseFloat(series[date]["3. low"]),
        close: parseFloat(series[date]["4. close"]),
        volume: parseInt(series[date]["5. volume"] || "0"),
      }));
  } catch {
    return getMockCandles(ticker);
  }
}

export async function searchStocks(q: string): Promise<{ ticker: string; companyName: string; sector: string | null }[]> {
  if (!ALPHA_VANTAGE_KEY) {
    const query = q.toUpperCase();
    return Object.entries(MOCK_COMPANIES)
      .filter(([t, n]) => t.includes(query) || n.toUpperCase().includes(query))
      .slice(0, 10)
      .map(([ticker, companyName]) => ({ ticker, companyName, sector: null }));
  }

  try {
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(q)}&apikey=${ALPHA_VANTAGE_KEY}`;
    const data = await fetchWithCache(url, `search_${q.toLowerCase()}`);
    const matches = data["bestMatches"] || [];
    return matches.slice(0, 10).map((m: any) => ({
      ticker: m["1. symbol"],
      companyName: m["2. name"],
      sector: null,
    }));
  } catch {
    return [];
  }
}

// Large pool of momentum/retail-friendly stocks — rotated every 2 weeks
const TICKER_POOL = [
  // Fintech & crypto-adjacent
  "SOFI", "HOOD", "COIN", "AFRM", "UPST", "SQ", "PYPL", "NU",
  // EV & clean energy
  "RIVN", "LCID", "XPEV", "NIO", "FSR", "CHPT", "BLNK", "PLUG", "FCEL",
  // Tech & AI
  "PLTR", "BBAI", "AI", "PATH", "SOUN", "SMCI", "IONQ", "RGTI", "QUBT",
  // Social & consumer
  "SNAP", "PINS", "RDDT", "RBLX", "U", "TTWO", "EA",
  // Biotech & pharma
  "MRNA", "BNTX", "NVAX", "SAVA", "BEAM", "EDIT", "CRSP",
  // Retail & meme-adjacent
  "GME", "AMC", "DKNG", "PENN", "CHWY", "MSTR",
  // Mobility & logistics
  "LYFT", "UBER", "BIRD", "BLDE",
  // Legacy / high-volume value
  "F", "GM", "AAL", "UAL", "DAL", "NOK", "BB",
];

// Seeded shuffle — deterministic for a given epoch so all users see the same list
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns 10 tickers that rotate automatically every 14 days
export function getDiscoverTickers(): string[] {
  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
  const epoch = Math.floor(Date.now() / TWO_WEEKS_MS);
  return seededShuffle(TICKER_POOL, epoch).slice(0, 10);
}

// Static export for backward compatibility
export const DISCOVER_TICKERS = getDiscoverTickers();
