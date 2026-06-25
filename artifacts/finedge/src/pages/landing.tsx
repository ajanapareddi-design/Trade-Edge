import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BookOpen, Briefcase, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <header className="container mx-auto px-4 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 shadow-[0_0_10px_rgba(30,111,255,0.25)]">
            <span className="text-primary font-bold text-base leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>SE</span>
          </div>
          <span className="text-xl font-bold text-primary drop-shadow-[0_0_10px_rgba(30,111,255,0.5)]" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}>
            Striple Edge
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden flex-1 flex flex-col justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Next-gen trading companion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>
              Trade like a pro.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary" style={{ fontStyle: "italic" }}>
                Learn like a beginner.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A Bloomberg terminal meets modern mobile app. Data-dense, futuristic, precise. Master financial markets with real-time data and paper trading.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground active-glow">
                <Link href="/sign-up">
                  Start Trading for Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card/30 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Daily Financial Lessons</h3>
                <p className="text-muted-foreground">Bite-sized, plain-English explanations of complex financial concepts. Build your streak.</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Paper Trading</h3>
                <p className="text-muted-foreground">Practice day trading strategies with a $50k virtual portfolio. Real market data, zero risk.</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-6 border border-chart-2/20">
                  <Briefcase className="w-6 h-6 text-chart-2" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Portfolio Insights</h3>
                <p className="text-muted-foreground">AI-driven market insights and alerts on your holdings to keep you ahead of the curve.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} FinEdge. All rights reserved.</p>
      </footer>
    </div>
  );
}
