import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="w-24 h-24 bg-chart-2/20 rounded-full flex items-center justify-center mx-auto border border-chart-2/30 mb-8">
          <CheckCircle className="w-12 h-12 text-chart-2" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
          Welcome to Striple Edge Pro!
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Your payment was successful. You now have full access to the Day Trading Hub, Paper Trading simulator, and Smart Portfolio Insights.
        </p>
        
        <div className="pt-8">
          <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold active-glow h-14 text-lg">
            <Link href="/trade">
              Start Trading <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
