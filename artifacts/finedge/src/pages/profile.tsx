import { useGetMe, useGetSubscription, useCreateCheckoutSession, useCreatePortalSession } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClerk } from "@clerk/react";
import { LogOut, Settings, CreditCard, Shield, Zap } from "lucide-react";

export default function ProfilePage() {
  const { data: user, isLoading: loadingUser } = useGetMe();
  const { data: subscription, isLoading: loadingSub } = useGetSubscription();
  const createCheckoutSession = useCreateCheckoutSession();
  const createPortalSession = useCreatePortalSession();
  const { signOut } = useClerk();

  const handleUpgrade = () => {
    createCheckoutSession.mutate(
      { data: { priceId: "default_pro" } },
      {
        onSuccess: (res) => {
          if (res.url) window.location.href = res.url;
        }
      }
    );
  };

  const handleManage = () => {
    createPortalSession.mutate(
      undefined,
      {
        onSuccess: (res) => {
          if (res.url) window.location.href = res.url;
        }
      }
    );
  };

  if (loadingUser) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

        <Card className="border-border bg-card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 w-full" />
          <CardContent className="pt-0 relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-10 mb-4">
              <div className="w-20 h-20 rounded-xl bg-card border-4 border-background flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user?.displayName || "User"}
                  </h2>
                  {user?.isPro && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" className="mb-2">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your plan and billing</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSub ? (
              <Skeleton className="h-20 w-full" />
            ) : user?.isPro ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div>
                  <div className="font-bold text-primary flex items-center gap-2">
                    FinEdge Pro <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Your subscription is active. 
                    {subscription?.currentPeriodEnd && ` Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleManage}
                  disabled={createPortalSession.isPending}
                >
                  {createPortalSession.isPending ? "Loading..." : "Manage Billing"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-xl border border-border bg-muted/30">
                <div>
                  <div className="font-bold text-foreground">Free Plan</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Upgrade to access the Day Trading Hub, Paper Trading, and Smart Insights.
                  </div>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground font-bold active-glow"
                  onClick={handleUpgrade}
                  disabled={createCheckoutSession.isPending}
                >
                  {createCheckoutSession.isPending ? "Loading..." : "Upgrade to Pro - $7.99/mo"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <div className="font-medium">Trading Quiz</div>
                <div className="text-sm text-muted-foreground">Update your trading strategy preferences</div>
              </div>
              <Button variant="outline" size="sm">Retake Quiz</Button>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Manage market alerts and insights</div>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button 
            variant="destructive" 
            className="w-full sm:w-auto bg-transparent border border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
