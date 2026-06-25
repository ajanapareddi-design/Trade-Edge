import { useCreateCheckoutSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Check, Lock } from "lucide-react";

interface PaywallModalProps {
  feature: string;
}

export default function PaywallModal({ feature }: PaywallModalProps) {
  const createCheckoutSession = useCreateCheckoutSession();

  const handleSubscribe = () => {
    createCheckoutSession.mutate(
      { data: { priceId: "default_pro" } },
      {
        onSuccess: (res) => {
          if (res.url) window.location.href = res.url;
        }
      }
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Abstract background shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 relative z-10 shadow-2xl shadow-primary/5 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">Upgrade to Pro</h2>
        <p className="text-muted-foreground mb-8">
          Unlock the {feature} and take your trading to the professional level.
        </p>
        
        <div className="bg-background rounded-xl p-6 text-left mb-8 border border-border">
          <div className="font-bold text-xl mb-4 border-b border-border pb-4">
            $7.99 <span className="text-sm text-muted-foreground font-normal">/ month</span>
          </div>
          <ul className="space-y-3">
            {[
              "Real-time Day Trading Hub",
              "Advanced charting and screeners",
              "Paper trading simulator ($50k)",
              "Smart portfolio insights & alerts"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-chart-2 shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-lg active-glow"
          onClick={handleSubscribe}
          disabled={createCheckoutSession.isPending}
        >
          {createCheckoutSession.isPending ? "Loading..." : "Subscribe Now"}
        </Button>
      </div>
    </div>
  );
}
