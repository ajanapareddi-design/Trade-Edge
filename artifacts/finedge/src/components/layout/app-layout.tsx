import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";

function LearnIcon({ active }: { active: boolean }) {
  const c = active ? "#1E6FFF" : "#6B7A99";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="10" height="20" rx="1.5" fill={active ? "#1E3A5F" : "#1A2236"} stroke={c} strokeWidth="1.5"/>
      <rect x="14" y="3" width="10" height="20" rx="1.5" fill={active ? "#1E3A5F" : "#1A2236"} stroke={c} strokeWidth="1.5"/>
      <line x1="4.5" y1="8" x2="9.5" y2="8" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4.5" y1="11" x2="9.5" y2="11" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4.5" y1="14" x2="7.5" y2="14" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16.5" y1="8" x2="21.5" y2="8" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16.5" y1="11" x2="21.5" y2="11" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16.5" y1="14" x2="19.5" y2="14" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M12 4 L13 23 L14 4" fill={c} opacity="0.6"/>
    </svg>
  );
}

function TradeIcon({ active }: { active: boolean }) {
  const c = active ? "#1E6FFF" : "#6B7A99";
  const up = active ? "#00C896" : "#4A6B5A";
  const dn = active ? "#FF4D6D" : "#6B4A52";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grid lines */}
      <line x1="2" y1="20" x2="24" y2="20" stroke={c} strokeWidth="0.8" opacity="0.3"/>
      <line x1="2" y1="14" x2="24" y2="14" stroke={c} strokeWidth="0.8" opacity="0.3"/>
      <line x1="2" y1="8" x2="24" y2="8" stroke={c} strokeWidth="0.8" opacity="0.3"/>
      {/* Candle 1 - up */}
      <line x1="5" y1="6" x2="5" y2="17" stroke={up} strokeWidth="1.2"/>
      <rect x="3" y="9" width="4" height="6" rx="0.5" fill={up}/>
      {/* Candle 2 - down */}
      <line x1="11" y1="8" x2="11" y2="19" stroke={dn} strokeWidth="1.2"/>
      <rect x="9" y="11" width="4" height="7" rx="0.5" fill={dn}/>
      {/* Candle 3 - up */}
      <line x1="17" y1="5" x2="17" y2="15" stroke={up} strokeWidth="1.2"/>
      <rect x="15" y="7" width="4" height="6" rx="0.5" fill={up}/>
      {/* Candle 4 - up */}
      <line x1="23" y1="4" x2="23" y2="13" stroke={up} strokeWidth="1.2"/>
      <rect x="21" y="6" width="4" height="5" rx="0.5" fill={up}/>
      {/* Trend line */}
      <path d="M5 13 L11 15 L17 10 L23 8" stroke={c} strokeWidth="1" strokeDasharray="2 1.5" opacity="0.7"/>
    </svg>
  );
}

function PortfolioIcon({ active }: { active: boolean }) {
  const c = active ? "#1E6FFF" : "#6B7A99";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pie chart segments */}
      <path d="M13 13 L13 3 A10 10 0 0 1 22.6 18 Z" fill={active ? "#1E6FFF" : "#1A3050"} stroke={active ? "#1E6FFF" : "#4A5A70"} strokeWidth="0.5"/>
      <path d="M13 13 L22.6 18 A10 10 0 0 1 6 20.6 Z" fill={active ? "#00C2FF" : "#1A3540"} stroke={active ? "#00C2FF" : "#3A5060"} strokeWidth="0.5"/>
      <path d="M13 13 L6 20.6 A10 10 0 0 1 3.9 8.5 Z" fill={active ? "#00C896" : "#1A3530"} stroke={active ? "#00C896" : "#3A5550"} strokeWidth="0.5"/>
      <path d="M13 13 L3.9 8.5 A10 10 0 0 1 13 3 Z" fill={active ? "#FFD700" : "#3A3520"} stroke={active ? "#FFD700" : "#5A5030"} strokeWidth="0.5"/>
      {/* Center hole */}
      <circle cx="13" cy="13" r="4.5" fill="hsl(224 28% 8%)" stroke={c} strokeWidth="1"/>
      <circle cx="13" cy="13" r="1.5" fill={c}/>
      {/* Portfolio case bar at top */}
      <rect x="9" y="2" width="8" height="2.5" rx="1" fill={c} opacity="0.7"/>
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const c = active ? "#1E6FFF" : "#6B7A99";
  const fill = active ? "#1E3A5F" : "#1A2236";
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="13" cy="8.5" r="4.5" fill={fill} stroke={c} strokeWidth="1.5"/>
      {/* Shoulders/collar */}
      <path d="M3 23 C3 17 6 14 10 13.5 L13 15 L16 13.5 C20 14 23 17 23 23 Z" fill={fill} stroke={c} strokeWidth="1.5"/>
      {/* Collar detail */}
      <path d="M10 13.5 L13 16.5 L16 13.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Tie */}
      <path d="M13 16.5 L11.5 19 L13 21 L14.5 19 Z" fill={c} opacity="0.8"/>
      {/* Shirt lines */}
      <line x1="9" y1="17" x2="9" y2="21" stroke={c} strokeWidth="0.8" opacity="0.4"/>
      <line x1="17" y1="17" x2="17" y2="21" stroke={c} strokeWidth="0.8" opacity="0.4"/>
    </svg>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetMe();

  const navItems = [
    { href: "/learn", label: "Learn", Icon: LearnIcon },
    { href: "/trade", label: "Trade", Icon: TradeIcon },
    { href: "/portfolio", label: "Portfolio", Icon: PortfolioIcon },
    { href: "/profile", label: "Profile", Icon: ProfileIcon },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground pb-[68px] md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="p-6 pb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 shadow-[0_0_10px_rgba(30,111,255,0.25)]">
              <span className="text-primary font-bold text-base leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>SE</span>
            </div>
            <span className="text-xl font-bold text-primary drop-shadow-[0_0_10px_rgba(30,111,255,0.5)]" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}>
              Striple Edge
            </span>
            {user?.isPro && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                PRO
              </span>
            )}
          </Link>
        </div>

        <div className="px-3 py-2 mx-3 mb-2">
          <div className="h-px bg-border opacity-50" />
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-primary/10 border border-primary/25 active-glow"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
                }`}
              >
                <Icon active={isActive} />
                <span className={`font-medium text-[15px] ${isActive ? "text-primary" : "text-muted-foreground"}`} style={{ fontFamily: "'Lora', serif" }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-[11px] text-muted-foreground opacity-50 text-center" style={{ fontFamily: "'Lora', serif" }}>
            Striple Edge © 2025
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-sidebar/90 backdrop-blur-xl z-50 flex items-center justify-around h-[68px] px-1">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-primary/10" : ""}`}>
                <Icon active={isActive} />
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? "text-primary" : "text-muted-foreground"}`} style={{ fontFamily: "'Lora', serif" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
