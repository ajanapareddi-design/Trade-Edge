import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, TrendingUp, Briefcase, User } from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetMe();

  const navItems = [
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/trade", label: "Trade", icon: TrendingUp },
    { href: "/portfolio", label: "Portfolio", icon: Briefcase },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground pb-[60px] md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary font-bold text-lg leading-none">FE</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-primary drop-shadow-[0_0_8px_rgba(30,111,255,0.5)]">
              FinEdge
            </span>
            {user?.isPro && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                PRO
              </span>
            )}
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 active-glow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-sidebar/80 backdrop-blur-lg z-50 flex items-center justify-around h-[60px] px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(30,111,255,0.5)]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
