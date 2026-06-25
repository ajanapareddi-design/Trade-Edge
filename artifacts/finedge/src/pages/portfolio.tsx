import { useState } from "react";
import { useGetMe, useGetMarketInsights, useGetPortfolioHoldings, useGetPortfolioSummary, getGetMarketInsightsQueryKey, getGetPortfolioSummaryQueryKey, getGetPortfolioHoldingsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import PaywallModal from "@/components/paywall-modal";

const CHART_COLORS = [
  "hsl(220, 100%, 56%)", // chart-1
  "hsl(161, 100%, 39%)", // chart-2
  "hsl(348, 100%, 65%)", // chart-3
  "hsl(195, 100%, 50%)", // chart-4
  "hsl(45, 100%, 50%)",  // chart-5
  "#8B5CF6", // extra color 
];

export default function PortfolioPage() {
  const { data: user, isLoading: loadingUser } = useGetMe();
  const { data: insights, isLoading: loadingInsights } = useGetMarketInsights(
    { query: { enabled: !!user?.isPro, queryKey: getGetMarketInsightsQueryKey() } }
  );
  const { data: summary, isLoading: loadingSummary } = useGetPortfolioSummary(
    { query: { enabled: !!user?.isPro, queryKey: getGetPortfolioSummaryQueryKey() } }
  );
  const { data: holdings, isLoading: loadingHoldings } = useGetPortfolioHoldings(
    { query: { enabled: !!user?.isPro, queryKey: getGetPortfolioHoldingsQueryKey() } }
  );

  const [expandedHolding, setExpandedHolding] = useState<number | null>(null);

  if (loadingUser) return <div className="p-8"><Skeleton className="h-full w-full rounded-xl" /></div>;

  if (!user?.isPro) {
    return <PaywallModal feature="Portfolio" />;
  }

  return (
    <div className="flex-1 overflow-auto bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <Button size="sm" className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Add Holding
          </Button>
        </header>

        {/* Smart Insights */}
        <div className="grid md:grid-cols-2 gap-4">
          {loadingInsights ? (
            <>
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </>
          ) : insights ? (
            <>
              <Card className="bg-[#0D2B1F]/30 border-[#00C896]/30 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#00C896] text-sm font-bold">📈 Gaining Attention</span>
                    <span className="text-xs text-muted-foreground">{insights.opportunity.ticker}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{insights.opportunity.companyName}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {insights.opportunity.summary}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#2B0D14]/30 border-[#FF4D6D]/30 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#FF4D6D] text-sm font-bold">📉 Slowing Down</span>
                    <span className="text-xs text-muted-foreground">{insights.slowdown.ticker}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{insights.slowdown.companyName}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {insights.slowdown.summary}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Allocation Pie Chart */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Allocation</h3>
            {loadingSummary ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>
            ) : summary?.holdings.length ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.holdings}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {summary.holdings.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 flex-1 w-full">
                  {summary.holdings.map((slice, index) => (
                    <div key={slice.ticker} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} 
                        />
                        <span className="font-mono text-sm">{slice.ticker}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{slice.companyName}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">${slice.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <div className="text-xs text-muted-foreground">{slice.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No holdings yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Holdings List */}
        <div>
          <h3 className="text-lg font-bold mb-4">Your Assets</h3>
          {loadingHoldings ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : holdings?.length ? (
            <div className="space-y-3">
              {holdings.map((holding) => (
                <Card 
                  key={holding.id} 
                  className={`border-border bg-card transition-all cursor-pointer ${expandedHolding === holding.id ? 'ring-1 ring-primary' : 'hover:border-primary/50'}`}
                  onClick={() => setExpandedHolding(expandedHolding === holding.id ? null : holding.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-mono font-bold text-lg">{holding.ticker}</div>
                        <div className="text-sm text-muted-foreground">{holding.companyName}</div>
                      </div>
                      
                      <div className="hidden md:block w-32 h-10">
                        {/* Sparkline placeholder */}
                        {holding.gainLoss && holding.gainLoss > 0 ? (
                          <div className="w-full h-full flex items-center">
                            <div className="w-full h-0.5 bg-chart-2" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center">
                            <div className="w-full h-0.5 bg-destructive" />
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-lg">
                          ${holding.currentPrice?.toFixed(2) || '---'}
                        </div>
                        <div className={`font-mono text-sm font-medium ${
                          !holding.gainLoss ? 'text-muted-foreground' :
                          holding.gainLoss >= 0 ? 'text-chart-2' : 'text-destructive'
                        }`}>
                          {holding.gainLoss && holding.gainLoss >= 0 ? '+' : ''}
                          ${holding.gainLoss?.toFixed(2) || '0.00'} 
                          ({holding.gainLossPercent && holding.gainLossPercent > 0 ? '+' : ''}{holding.gainLossPercent?.toFixed(2) || '0.00'}%)
                        </div>
                      </div>
                    </div>
                    
                    {expandedHolding === holding.id && (
                      <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Shares</div>
                            <div className="font-mono font-medium">{holding.shares}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Avg Cost</div>
                            <div className="font-mono font-medium">${holding.avgCost.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Total Value</div>
                            <div className="font-mono font-medium">${holding.totalValue?.toFixed(2) || '---'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Return</div>
                            <div className={`font-mono font-medium ${
                              !holding.gainLoss ? '' : holding.gainLoss >= 0 ? 'text-chart-2' : 'text-destructive'
                            }`}>
                              {holding.gainLoss && holding.gainLoss >= 0 ? '+' : ''}
                              ${holding.gainLoss?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-64 bg-background/50 rounded-lg border border-border flex items-center justify-center">
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                            Interactive Chart <ChevronDown className="w-4 h-4" />
                          </p>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm" className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white">
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-border rounded-xl bg-card">
              <p className="text-muted-foreground mb-4">You haven't added any holdings yet.</p>
              <Button>Add Your First Holding</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
