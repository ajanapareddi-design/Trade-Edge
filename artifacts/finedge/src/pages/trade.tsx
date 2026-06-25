import { useState, useEffect, useRef } from "react";
import { 
  useGetMe, 
  useGetQuizPreferences, 
  useSaveQuizPreferences,
  useDiscoverStocks,
  useGetStockOHLC,
  useGetWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useGetPaperPortfolio,
  useGetPaperPositions,
  useExecutePaperTrade,
  useGetPaperPerformance,
  useSearchStocks,
  getGetStockOHLCQueryKey,
  getSearchStocksQueryKey,
  getGetQuizPreferencesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Search, TrendingUp, AlertTriangle, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaywallModal from "@/components/paywall-modal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- Components ---

function LightweightChart({ ticker, data, prevHigh, prevLow }: { ticker: string, data: any[], prevHigh?: number, prevLow?: number }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 120,
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00C896',
      downColor: '#FF4D6D',
      borderVisible: false,
      wickUpColor: '#00C896',
      wickDownColor: '#FF4D6D',
    });

    if (data && data.length > 0) {
      candlestickSeries.setData(data.map(d => ({
        time: (new Date(d.time).getTime() / 1000) as any,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      })));
    }

    if (prevHigh) {
      candlestickSeries.createPriceLine({
        price: prevHigh,
        color: '#1E6FFF',
        lineWidth: 2,
        lineStyle: 2, // Dashed
        axisLabelVisible: true,
        title: 'Prev High',
      });
    }

    if (prevLow) {
      candlestickSeries.createPriceLine({
        price: prevLow,
        color: '#FF4D6D',
        lineWidth: 2,
        lineStyle: 2, // Dashed
        axisLabelVisible: true,
        title: 'Prev Low',
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, prevHigh, prevLow]);

  return <div ref={chartContainerRef} className="w-full h-[120px]" />;
}

function DiscoverTab() {
  const { data: stocks, isLoading } = useDiscoverStocks();
  
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full border border-border rounded-xl bg-card overflow-hidden">
        <AccordionItem value="strategy-guide" className="border-b-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">Strategy Guide</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-background border border-border">
                <h4 className="font-bold mb-2">Support & Resistance</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Trading price bounces between established floors (support) and ceilings (resistance).
                </p>
                <div className="text-xs font-mono text-secondary bg-secondary/10 p-2 rounded">
                  Tip: Wait for confirmation of bounce before entry.
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border">
                <h4 className="font-bold mb-2">VWAP Trading</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Using Volume Weighted Average Price as a dynamic support/resistance level.
                </p>
                <div className="text-xs font-mono text-secondary bg-secondary/10 p-2 rounded">
                  Tip: Price above VWAP = Bullish bias.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))
        ) : stocks?.map((stock) => (
          <Card key={stock.ticker} className="border-border bg-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-mono text-xl font-bold">{stock.ticker}</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-[150px]">{stock.companyName}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-lg">${stock.price.toFixed(2)}</div>
                  <div className={`font-mono text-sm font-medium ${stock.changePercent >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <LightweightChart 
                ticker={stock.ticker} 
                data={stock.candles || []} 
                prevHigh={stock.previousHigh} 
                prevLow={stock.previousLow} 
              />
              
              {stock.isHighVolatility && (
                <div className="mt-3 flex items-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded-md border border-yellow-500/20">
                  <AlertTriangle className="w-4 h-4" />
                  High volatility detected yesterday — trade with extra caution
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WatchlistTab() {
  const { data: watchlist, isLoading } = useGetWatchlist();
  const removeMutation = useRemoveFromWatchlist();
  const addMutation = useAddToWatchlist();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isLoading: searchLoading } = useSearchStocks(
    { q: searchQuery },
    { query: { enabled: searchQuery.length > 1, queryKey: getSearchStocksQueryKey({ q: searchQuery }) } }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Watchlist</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground">
              + Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Stocks</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Symbol or company name..." 
                  className="pl-9 bg-background border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {searchLoading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">Searching...</div>
                ) : searchResults?.map((result) => (
                  <div key={result.ticker} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border">
                    <div>
                      <div className="font-mono font-bold">{result.ticker}</div>
                      <div className="text-xs text-muted-foreground">{result.companyName}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8"
                      onClick={() => {
                        addMutation.mutate(
                          { data: { ticker: result.ticker, companyName: result.companyName } },
                          { onSuccess: () => toast({ title: `Added ${result.ticker} to watchlist` }) }
                        );
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : watchlist?.length === 0 ? (
          <div className="p-8 text-center border border-border rounded-xl bg-card">
            <p className="text-muted-foreground mb-4">Your watchlist is empty.</p>
          </div>
        ) : watchlist?.map((item) => (
          <Card key={item.id} className="border-border bg-card group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg">{item.ticker}</span>
                  {item.quote?.isHighVolatility && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="text-sm text-muted-foreground">{item.companyName}</div>
              </div>
              
              <div className="hidden md:block w-32 h-10 mx-4">
                {item.quote?.sparkline && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={item.quote.sparkline.map((val, i) => ({ val, i }))}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke={item.quote.changePercent >= 0 ? '#00C896' : '#FF4D6D'} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="text-right flex-1 md:flex-none">
                <div className="font-mono font-bold text-lg">${item.quote?.price?.toFixed(2) || '---'}</div>
                <div className={`font-mono text-sm font-medium ${!item.quote ? '' : item.quote.changePercent >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                  {item.quote && item.quote.changePercent >= 0 ? '+' : ''}{item.quote?.changePercent?.toFixed(2) || '0.00'}%
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  removeMutation.mutate(
                    { ticker: item.ticker },
                    { onSuccess: () => toast({ title: `Removed ${item.ticker}` }) }
                  );
                }}
              >
                &times;
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PaperTradeTab() {
  const { data: portfolio, isLoading: portLoading } = useGetPaperPortfolio();
  const { data: positions, isLoading: posLoading } = useGetPaperPositions();
  const { data: performance, isLoading: perfLoading } = useGetPaperPerformance();
  const executeTrade = useExecutePaperTrade();
  const { toast } = useToast();
  
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [tradeShares, setTradeShares] = useState<string>("1");

  const handleTrade = (action: "buy" | "sell") => {
    if (!selectedTicker) return;
    executeTrade.mutate(
      { data: { ticker: selectedTicker, shares: Number(tradeShares), action } },
      { 
        onSuccess: (res) => {
          toast({ title: "Trade executed", description: `${action.toUpperCase()} ${tradeShares} shares of ${selectedTicker}` });
          setSelectedTicker(null);
        },
        onError: (err: any) => {
          toast({ title: "Trade failed", description: err.message || "An error occurred", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {portLoading ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : portfolio ? (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Portfolio Value</div>
                <div className="text-3xl font-mono font-bold">${portfolio.totalValue.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Buying Power</div>
                <div className="text-xl font-mono font-medium">${portfolio.cashBalance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Unrealized P&L</div>
                <div className={`text-xl font-mono font-medium ${portfolio.unrealizedPnl >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                  {portfolio.unrealizedPnl >= 0 ? '+' : ''}${portfolio.unrealizedPnl.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="h-48 border border-border rounded-xl bg-card p-4">
        {perfLoading ? (
          <Skeleton className="w-full h-full" />
        ) : performance ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performance}>
              <YAxis domain={['auto', 'auto']} hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#1E6FFF" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">No performance data</div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Open Positions</h3>
        <div className="space-y-3">
          {posLoading ? (
            <Skeleton className="h-20 w-full rounded-xl" />
          ) : positions?.length === 0 ? (
             <div className="p-8 text-center border border-border rounded-xl bg-card">
              <p className="text-muted-foreground">No open positions. Use the search below to start trading.</p>
            </div>
          ) : positions?.map((pos) => (
            <Card 
              key={pos.id} 
              className={`border-border bg-card cursor-pointer transition-all ${selectedTicker === pos.ticker ? 'ring-1 ring-primary' : 'hover:border-primary/50'}`}
              onClick={() => setSelectedTicker(pos.ticker === selectedTicker ? null : pos.ticker)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-mono font-bold text-lg">{pos.ticker}</div>
                    <div className="text-sm text-muted-foreground">{pos.shares} shares @ ${pos.avgCost.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg">${pos.currentPrice.toFixed(2)}</div>
                    <div className={`font-mono text-sm font-medium ${pos.unrealizedPnl >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                      {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} 
                      ({pos.unrealizedPnlPercent >= 0 ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                
                {selectedTicker === pos.ticker && (
                  <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
                    <div className="flex gap-4 items-center">
                      <Input 
                        type="number" 
                        min="1" 
                        value={tradeShares} 
                        onChange={(e) => setTradeShares(e.target.value)}
                        className="w-24 bg-background border-border"
                      />
                      <span className="text-sm text-muted-foreground">shares</span>
                      <div className="flex-1" />
                      <Button 
                        onClick={(e) => { e.stopPropagation(); handleTrade("buy"); }}
                        className="bg-chart-2 hover:bg-chart-2/90 text-white w-24"
                        disabled={executeTrade.isPending}
                      >
                        BUY
                      </Button>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); handleTrade("sell"); }}
                        className="bg-destructive hover:bg-destructive/90 text-white w-24"
                        disabled={executeTrade.isPending}
                      >
                        SELL
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function TradePage() {
  const { data: user, isLoading: loadingUser } = useGetMe();
  const { data: quizPrefs, isLoading: loadingQuiz } = useGetQuizPreferences({
    query: { enabled: !!user?.isPro, queryKey: getGetQuizPreferencesQueryKey() }
  });
  const saveQuiz = useSaveQuizPreferences();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState({ strategies: [] as string[], capital: "", profit: "" });

  useEffect(() => {
    if (quizPrefs && !quizPrefs.completed) {
      setShowQuiz(true);
    }
  }, [quizPrefs]);

  if (loadingUser) return <div className="p-8"><Skeleton className="h-full w-full rounded-xl" /></div>;

  if (!user?.isPro) {
    return <PaywallModal feature="Day Trading Hub" />;
  }

  if (showQuiz) {
    return (
      <div className="flex-1 bg-background p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Customize Your Trading Hub</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold">What trading strategies do you use? (Select all that apply)</h3>
              <div className="flex flex-wrap gap-2">
                {["CRT", "Support & Resistance", "VWAP Trading", "Moving Average Crossovers", "Gap & Go", "Breakout Trading"].map(strat => (
                  <Badge 
                    key={strat}
                    variant={quizState.strategies.includes(strat) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => {
                      setQuizState(prev => ({
                        ...prev,
                        strategies: prev.strategies.includes(strat) 
                          ? prev.strategies.filter(s => s !== strat)
                          : [...prev.strategies, strat]
                      }))
                    }}
                  >
                    {strat}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold">How much capital per trade?</h3>
              <div className="flex flex-wrap gap-2">
                {["Under $100", "$100–$250", "$250–$500", "$500–$1,000", "$1,000+"].map(cap => (
                  <Badge 
                    key={cap}
                    variant={quizState.capital === cap ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => setQuizState(prev => ({ ...prev, capital: cap }))}
                  >
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold">Target profit per trade?</h3>
              <div className="flex flex-wrap gap-2">
                {["$5–$15", "$15–$30", "$30–$75", "$75–$150", "$150+"].map(prof => (
                  <Badge 
                    key={prof}
                    variant={quizState.profit === prof ? "default" : "outline"}
                    className="cursor-pointer text-sm py-1.5 px-3"
                    onClick={() => setQuizState(prev => ({ ...prev, profit: prof }))}
                  >
                    {prof}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold active-glow"
              disabled={saveQuiz.isPending || quizState.strategies.length === 0 || !quizState.capital || !quizState.profit}
              onClick={() => {
                saveQuiz.mutate(
                  { data: { strategies: quizState.strategies, capitalRange: quizState.capital, profitTarget: quizState.profit } },
                  { onSuccess: () => setShowQuiz(false) }
                );
              }}
            >
              {saveQuiz.isPending ? "Saving..." : "Complete Setup"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Day Trading Hub</h1>
        </header>

        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-card border border-border">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="paper">Paper Trade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            <DiscoverTab />
          </TabsContent>
          <TabsContent value="watchlist">
            <WatchlistTab />
          </TabsContent>
          <TabsContent value="paper">
            <PaperTradeTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
