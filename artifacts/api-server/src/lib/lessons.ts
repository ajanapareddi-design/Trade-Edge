export interface Lesson {
  id: number;
  title: string;
  explanation: string;
  whyItMatters: string;
  howItWorks: string[];
  tag: string;
  category: string;
  dayIndex: number;
}

export const LESSONS: Lesson[] = [
  {
    id: 1, dayIndex: 1, title: "What is a Stock?", tag: "#Basics", category: "Fundamentals",
    explanation: "A stock is a fractional ownership stake in a company. When you buy a share of Apple, you literally own a tiny piece of Apple's business — including a claim on its future earnings and assets.",
    whyItMatters: "Stocks have historically returned ~10% annually, outpacing inflation. Understanding stocks is the foundation of all investing.",
    howItWorks: ["Companies sell shares to raise money for growth", "Share price moves based on supply and demand", "As a shareholder, you benefit when the company grows", "Stocks are traded on exchanges like NYSE and NASDAQ"],
  },
  {
    id: 2, dayIndex: 2, title: "Market Cap Explained", tag: "#Basics", category: "Fundamentals",
    explanation: "Market capitalization is the total dollar value of a company's outstanding shares. It's calculated by multiplying the current share price by the total number of shares outstanding.",
    whyItMatters: "Market cap tells you the size of a company and helps compare companies in the same industry. Large-cap stocks are generally more stable; small-cap stocks carry more risk and reward.",
    howItWorks: ["Market Cap = Share Price × Shares Outstanding", "Large-cap: $10B+, Mid-cap: $2B–$10B, Small-cap: <$2B", "Larger companies tend to be more stable but grow more slowly", "Small-cap stocks can 10x but can also go to zero"],
  },
  {
    id: 3, dayIndex: 3, title: "Support & Resistance", tag: "#DayTrading", category: "Technical Analysis",
    explanation: "Support is a price level where a stock tends to stop falling and bounce back up. Resistance is a price level where it tends to stop rising and pull back. These zones represent areas of concentrated buying and selling interest.",
    whyItMatters: "Understanding support and resistance lets you identify low-risk entry points and smart profit targets. Professional traders use these levels to time their entries and exits.",
    howItWorks: ["Support forms where buyers overwhelm sellers repeatedly", "Resistance forms where sellers overwhelm buyers repeatedly", "Broken resistance becomes new support (role reversal)", "The more times a level holds, the stronger it becomes"],
  },
  {
    id: 4, dayIndex: 4, title: "What is ATR?", tag: "#RiskManagement", category: "Technical Analysis",
    explanation: "Average True Range (ATR) measures how much a stock moves on average each day. A stock with an ATR of $0.50 typically moves 50 cents per day, while a stock with an ATR of $5 moves about $5.",
    whyItMatters: "ATR helps you size your position correctly and set stop losses at the right distance. A stop set too tight gets hit by normal noise; ATR gives you the proper range to work with.",
    howItWorks: ["ATR = average of True Range over 14 periods", "True Range = max of (H-L), (H-prev C), (prev C-L)", "Higher ATR = more volatile = wider stops needed", "Risk 1% of account per trade based on ATR distance"],
  },
  {
    id: 5, dayIndex: 5, title: "VWAP Trading", tag: "#DayTrading", category: "Technical Analysis",
    explanation: "Volume Weighted Average Price (VWAP) is the average price a stock has traded at throughout the day, weighted by volume. It's a critical benchmark for institutional traders and day traders alike.",
    whyItMatters: "VWAP separates bullish price action from bearish price action. Stocks trading above VWAP are considered strong; below VWAP is bearish. Many traders use VWAP bounces as entry signals.",
    howItWorks: ["VWAP resets at the start of each trading day", "Price above VWAP = bulls in control", "Price below VWAP = bears in control", "VWAP acts as both support and resistance throughout the day"],
  },
  {
    id: 6, dayIndex: 6, title: "Gap & Go Strategy", tag: "#DayTrading", category: "Trading Strategies",
    explanation: "The Gap & Go strategy capitalizes on stocks that open significantly higher or lower than the previous close. Traders buy the gap-up on pullbacks or short the gap-down, expecting the momentum to continue.",
    whyItMatters: "Gaps concentrate retail and institutional attention on a single stock, creating explosive volume and directional moves. The first hour of trading on a gap day can produce massive gains.",
    howItWorks: ["Screen for stocks gapping up 5%+ in premarket", "Wait for initial consolidation after open", "Buy the first pullback to VWAP or support level", "Set stop below the low of the consolidation candle"],
  },
  {
    id: 7, dayIndex: 7, title: "CRT: Candle Range Theory", tag: "#DayTrading", category: "Trading Strategies",
    explanation: "Candle Range Theory (CRT) is an ICT-derived concept where traders identify the range of a specific candle (the high and low), wait for a 'sweep' of one side, then take a trade in the opposite direction targeting the other side.",
    whyItMatters: "CRT works because large institutions need liquidity to fill their orders. They push price into obvious levels to trigger stop losses, collect liquidity, then reverse. Understanding this gives you an edge.",
    howItWorks: ["Identify a key candle's high and low as the range", "Wait for price to break (sweep) one side of the range", "Look for a rapid reversal showing institutional rejection", "Enter in the reversal direction, target the opposite side"],
  },
  {
    id: 8, dayIndex: 8, title: "Risk/Reward Ratio", tag: "#RiskManagement", category: "Risk Management",
    explanation: "Risk/reward ratio compares how much you stand to lose versus how much you stand to gain on a trade. A 1:3 risk/reward means you risk $1 to make $3. Even with only 40% winning trades, a consistent 1:3 ratio produces profits.",
    whyItMatters: "Most beginners focus on win rate. Professionals focus on risk/reward. You can lose more trades than you win and still be profitable if your winners are significantly larger than your losers.",
    howItWorks: ["Calculate potential loss (entry price - stop loss)", "Calculate potential gain (target price - entry price)", "Divide potential gain by potential loss", "Only take trades with 1:2 minimum risk/reward"],
  },
  {
    id: 9, dayIndex: 9, title: "Moving Average Crossovers", tag: "#TechnicalAnalysis", category: "Technical Analysis",
    explanation: "A moving average crossover occurs when a shorter-period MA crosses above or below a longer-period MA. The 9/20 EMA crossover and the golden/death cross (50/200 MA) are two of the most widely watched signals in trading.",
    whyItMatters: "Moving average crossovers provide objective, emotion-free signals. When the 9 EMA crosses above the 20 EMA, institutional momentum is shifting bullish — this is a high-probability entry setup.",
    howItWorks: ["9 EMA crossing above 20 EMA = bullish momentum shift", "50 MA crossing above 200 MA = Golden Cross (macro bullish)", "50 MA crossing below 200 MA = Death Cross (macro bearish)", "Use crossovers to confirm trend, not predict them"],
  },
  {
    id: 10, dayIndex: 10, title: "Diversification", tag: "#Portfolio", category: "Portfolio Management",
    explanation: "Diversification is spreading your investments across different assets, sectors, and geographies to reduce risk. The logic: when one investment falls, others may rise, smoothing your overall returns.",
    whyItMatters: "Concentration risk destroys portfolios. Putting all your money in one stock that goes to zero wipes you out. Diversification doesn't maximize gains, but it dramatically reduces catastrophic loss.",
    howItWorks: ["Hold stocks across multiple sectors (tech, health, energy)", "Include different asset classes (stocks, bonds, REITs)", "Consider geographic diversification (US, international)", "Review correlations — diversification fails when all assets fall together"],
  },
  {
    id: 11, dayIndex: 11, title: "P/E Ratio", tag: "#Fundamentals", category: "Fundamental Analysis",
    explanation: "The Price-to-Earnings ratio tells you how much investors are paying per dollar of a company's earnings. A P/E of 20 means investors pay $20 for every $1 of annual profit. The S&P 500's average P/E is historically around 15-20.",
    whyItMatters: "P/E helps identify whether a stock is cheap or expensive relative to its earnings. A high P/E means investors expect fast growth; a low P/E may signal undervaluation or weak business prospects.",
    howItWorks: ["P/E = Stock Price ÷ Earnings Per Share (EPS)", "Compare P/E to sector peers, not the whole market", "Forward P/E uses estimated future earnings", "P/E alone is never sufficient — pair with revenue growth and margins"],
  },
  {
    id: 12, dayIndex: 12, title: "Short Selling", tag: "#Advanced", category: "Advanced Strategies",
    explanation: "Short selling is borrowing shares you don't own, selling them at the current price, and hoping to buy them back later at a lower price. You profit when the stock falls. The risk: losses are theoretically unlimited.",
    whyItMatters: "Short selling allows profits in bear markets and provides hedging for long positions. It also keeps markets efficient by allowing negative information to be priced in quickly.",
    howItWorks: ["Borrow shares from your broker (margin account required)", "Sell borrowed shares at current market price", "Wait for price to decline, then buy shares back lower", "Return borrowed shares to broker, pocket the difference"],
  },
  {
    id: 13, dayIndex: 13, title: "Options Basics", tag: "#Options", category: "Derivatives",
    explanation: "An option is a contract giving you the right (but not obligation) to buy or sell 100 shares at a set price before a specific date. Calls profit when price rises; puts profit when price falls.",
    whyItMatters: "Options provide leverage — control $10,000 worth of stock for a fraction of the price. They're used for speculation, income generation, and hedging. Most options expire worthless; understand the odds before trading them.",
    howItWorks: ["Call option = right to buy at strike price", "Put option = right to sell at strike price", "Premium = what you pay for the option contract", "Each contract controls 100 shares of the underlying"],
  },
  {
    id: 14, dayIndex: 14, title: "Earnings Reports", tag: "#Fundamentals", category: "Fundamental Analysis",
    explanation: "Every quarter, public companies release earnings reports detailing revenue, profit, expenses, and outlook. These reports are the single most important scheduled event for a stock's price movement.",
    whyItMatters: "Stocks can move 10-30% on earnings day. Understanding what the market expects vs. what the company delivers is critical. 'Beating estimates' doesn't always mean the stock goes up — sometimes it has to beat by a lot.",
    howItWorks: ["EPS (Earnings Per Share) is the headline number", "Revenue beat/miss matters more than EPS for growth stocks", "Guidance (future outlook) often matters more than current results", "IV (implied volatility) spikes before earnings then collapses after"],
  },
  {
    id: 15, dayIndex: 15, title: "Compound Interest", tag: "#Fundamentals", category: "Personal Finance",
    explanation: "Compound interest means earning returns not just on your original investment, but also on your accumulated gains. $10,000 invested at 10% annually becomes $67,000 in 20 years without adding a single dollar.",
    whyItMatters: "Compounding is why starting early is more valuable than investing more later. Time is the most powerful variable in wealth building, not the amount invested.",
    howItWorks: ["Start with $10,000 at 10% annual return", "Year 1: $11,000. Year 5: $16,105. Year 10: $25,937", "Year 20: $67,275. Year 30: $174,494", "Every decade roughly doubles your compounding power"],
  },
  {
    id: 16, dayIndex: 16, title: "Dollar-Cost Averaging", tag: "#Strategy", category: "Investment Strategy",
    explanation: "Dollar-cost averaging (DCA) means investing a fixed dollar amount at regular intervals regardless of price. When prices are high you buy fewer shares; when prices are low you buy more, automatically.",
    whyItMatters: "DCA removes the impossible task of timing the market perfectly. It smooths out the average cost of your investment over time and removes the emotional paralysis of waiting for the 'right' time.",
    howItWorks: ["Decide on a fixed amount (e.g., $200/week)", "Invest automatically regardless of market conditions", "Low prices = more shares purchased, high prices = fewer shares", "Over time, average cost is lower than random lump-sum timing"],
  },
  {
    id: 17, dayIndex: 17, title: "Candlestick Patterns", tag: "#TechnicalAnalysis", category: "Technical Analysis",
    explanation: "Candlesticks display four price points for a period: open, high, low, and close. Green (bullish) candles close higher than they open. Red (bearish) candles close lower. Patterns made of multiple candles signal reversals or continuations.",
    whyItMatters: "Candlestick patterns are the language of price action. Recognizing an engulfing candle, a doji, or a hammer at a key level can dramatically improve trade timing.",
    howItWorks: ["Doji = open and close nearly equal → indecision", "Hammer = small body, long lower wick → bullish reversal signal", "Engulfing = one candle completely contains the prior candle → strong reversal", "Pin bar = long wick rejecting a key level → institutional footprint"],
  },
  {
    id: 18, dayIndex: 18, title: "Momentum Trading", tag: "#DayTrading", category: "Trading Strategies",
    explanation: "Momentum trading means buying what is going up and selling (or shorting) what is going down, with the expectation that trends continue. Momentum traders ride the wave rather than trying to pick tops and bottoms.",
    whyItMatters: "Markets trend more than they mean-revert in the short term. Momentum is one of the most documented market anomalies in academic finance — it works across time periods and asset classes.",
    howItWorks: ["Scan for stocks with highest % gains in premarket", "Wait for the first red candle to form after a strong open", "Enter on the second green candle (confirmation of continuation)", "Exit when the momentum stalls — watch volume drop-off"],
  },
  {
    id: 19, dayIndex: 19, title: "Smart Money Concepts (ICT)", tag: "#Advanced", category: "Advanced Strategies",
    explanation: "Smart Money Concepts (popularized by ICT) describe how large institutional traders — banks, hedge funds — move markets. Key concepts include order blocks, fair value gaps, liquidity sweeps, and optimal trade entries.",
    whyItMatters: "Retail traders consistently lose because they trade at predictable levels. Understanding how institutions hunt retail stop losses and then reverse gives you an edge over conventional technical analysis.",
    howItWorks: ["Order blocks = institutional buy/sell zones on higher timeframes", "Fair Value Gaps = imbalances price tends to return to fill", "Liquidity = buy stops above highs, sell stops below lows", "Institutions sweep liquidity before reversing — trade the reversal, not the sweep"],
  },
  {
    id: 20, dayIndex: 20, title: "Portfolio Rebalancing", tag: "#Portfolio", category: "Portfolio Management",
    explanation: "Portfolio rebalancing means periodically adjusting your holdings back to your target allocation. If stocks rise from 70% to 85% of your portfolio, you sell some stocks and buy bonds to restore the 70/30 balance.",
    whyItMatters: "Rebalancing enforces 'buy low, sell high' automatically. It prevents any single position from dominating your portfolio due to strong gains, which would increase your concentration risk.",
    howItWorks: ["Set target allocation (e.g., 70% stocks, 30% bonds)", "Review quarterly or when any asset class drifts 5%+ from target", "Sell overperformers, buy underperformers to restore balance", "Rebalancing is a form of systematic profit-taking"],
  },
  {
    id: 21, dayIndex: 21, title: "What is an ETF?", tag: "#Basics", category: "Fundamentals",
    explanation: "An Exchange-Traded Fund (ETF) is a basket of securities that trades on an exchange like a stock. SPY holds all 500 S&P 500 companies in a single share. QQQ holds the top 100 NASDAQ stocks.",
    whyItMatters: "ETFs give instant diversification at low cost. Most actively managed funds underperform the S&P 500 long-term. Owning SPY costs 0.09%/year; most mutual funds cost 1%+, which compresses long-term returns significantly.",
    howItWorks: ["ETFs track an index, sector, commodity, or strategy", "You buy and sell ETFs like individual stocks throughout the day", "Expense ratios (fees) are far lower than mutual funds", "Popular ETFs: SPY (S&P500), QQQ (NASDAQ), VTI (total market)"],
  },
  {
    id: 22, dayIndex: 22, title: "Breakout Trading", tag: "#DayTrading", category: "Trading Strategies",
    explanation: "Breakout trading means entering a position when price breaks through a key resistance level with high volume, expecting the momentum to continue in the breakout direction.",
    whyItMatters: "Breakouts represent the market 'making a decision' after a period of consolidation. They are high-probability setups because institutions accumulate positions during consolidation, then trigger the move when their buying is complete.",
    howItWorks: ["Identify a stock consolidating in a tight range", "Mark the resistance (top of range) clearly", "Wait for a high-volume candle closing above resistance", "Enter on a retest of the broken resistance level as new support"],
  },
  {
    id: 23, dayIndex: 23, title: "Fibonacci Retracements", tag: "#TechnicalAnalysis", category: "Technical Analysis",
    explanation: "Fibonacci retracements use ratios derived from the Fibonacci sequence (23.6%, 38.2%, 50%, 61.8%) to identify potential support and resistance levels after a significant price move.",
    whyItMatters: "Fibonacci levels work because enough traders watch them that they become self-fulfilling. The 61.8% level (the 'golden ratio') is particularly powerful — institutional traders often set limit orders there.",
    howItWorks: ["Draw from swing low to swing high on an uptrend", "Key levels: 38.2%, 50%, 61.8% retracement of the move", "61.8% is the strongest — often where trends resume", "Combine with other confluence (support, VWAP) for higher probability"],
  },
  {
    id: 24, dayIndex: 24, title: "Level 2 Quotes", tag: "#DayTrading", category: "Market Mechanics",
    explanation: "Level 2 quotes show the full order book — all pending buy and sell orders at every price level, along with which market maker or ECN is placing them. They reveal the depth and strength of supply and demand.",
    whyItMatters: "Level 2 lets you see where big players are positioned before price gets there. A massive ask (sell wall) at $10.00 telegraphs resistance. A huge bid (buy wall) at $9.50 telegraphs support.",
    howItWorks: ["Bid side = pending buy orders (green)", "Ask side = pending sell orders (red)", "Large blocks from specific market makers signal institutional interest", "Watch for bid/ask stacking to signal direction before price moves"],
  },
  {
    id: 25, dayIndex: 25, title: "The PDT Rule", tag: "#DayTrading", category: "Market Mechanics",
    explanation: "The Pattern Day Trader (PDT) rule requires accounts under $25,000 to have at least $25,000 in equity before executing 4+ day trades within a 5-day rolling window in a margin account.",
    whyItMatters: "The PDT rule is the #1 obstacle for new traders with small accounts. Understanding it helps you plan how many trades you can make per week, and whether to use a cash account as an alternative.",
    howItWorks: ["Applies only to margin accounts, not cash accounts", "< $25K account can make max 3 day trades per 5-day window", "A cash account has no PDT restriction but requires T+2 settlement", "Workaround: trade in a cash account or fund account above $25K"],
  },
  {
    id: 26, dayIndex: 26, title: "Stop Loss Orders", tag: "#RiskManagement", category: "Risk Management",
    explanation: "A stop loss is a preset order to automatically sell a position when it hits a specified price, limiting your loss. If you buy at $10 and set a stop at $9.50, you automatically exit with a 5% loss if the stock falls to $9.50.",
    whyItMatters: "Stop losses are non-negotiable for traders. Without them, one bad trade can wipe out months of gains. Never let a loss turn into a catastrophic loss because you refused to exit.",
    howItWorks: ["Hard stop: limit/market order triggered at a set price", "Mental stop: you commit to exit manually at a level (less reliable)", "ATR-based stops: set stop 1.5-2x ATR below entry", "Never move your stop to give a losing trade more room"],
  },
  {
    id: 27, dayIndex: 27, title: "Volume Analysis", tag: "#TechnicalAnalysis", category: "Technical Analysis",
    explanation: "Volume is the number of shares traded in a given period. It's the fuel behind price moves. A price breakout on high volume is significantly more reliable than one on low volume.",
    whyItMatters: "Volume confirms or denies price action. Breakouts without volume are frequently false. Volume spikes at key levels reveal institutional activity — the big money that actually moves prices.",
    howItWorks: ["High volume + rising price = bullish confirmation", "High volume + falling price = bearish confirmation", "Low volume + rising price = weak move, potential trap", "Volume precedes price — watch for unusual volume before big moves"],
  },
  {
    id: 28, dayIndex: 28, title: "Pre-Market Trading", tag: "#DayTrading", category: "Market Mechanics",
    explanation: "Pre-market trading occurs from 4am to 9:30am EST before the regular market session. Volume is lower and spreads are wider, but pre-market moves often telegraph the day's direction.",
    whyItMatters: "Earnings releases, news events, and economic data hit during pre-market. The gap (difference between yesterday's close and today's open) forms during this time. Reading pre-market action is essential for day traders.",
    howItWorks: ["Scan for stocks with large pre-market moves (5%+)", "High pre-market volume confirms institutional interest", "Gaps up with strong volume tend to run; weak volume gaps often fill", "Pre-market highs and lows become key intraday levels"],
  },
];

export function getTodayLesson(): Lesson {
  const dayOfYear = getDayOfYear(new Date());
  const idx = (dayOfYear - 1) % LESSONS.length;
  return LESSONS[idx];
}

export function getUpcomingLessons(count = 5): { id: number; title: string; tag: string; dayIndex: number }[] {
  const dayOfYear = getDayOfYear(new Date());
  const results = [];
  for (let i = 1; i <= count; i++) {
    const idx = ((dayOfYear - 1 + i) % LESSONS.length);
    const l = LESSONS[idx];
    results.push({ id: l.id, title: l.title, tag: l.tag, dayIndex: l.dayIndex });
  }
  return results;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
