import { Router } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { db } from "../db.js";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
router.use(clerkMiddleware());

async function getStripe() {
  const { getUncachableStripeClient } = await import("../stripeClient.js");
  return getUncachableStripeClient();
}

const REPLIT_DOMAINS = (process.env.REPLIT_DOMAINS || "localhost:3000").split(",")[0];
const APP_URL = `https://${REPLIT_DOMAINS}`;

router.get("/subscription", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, auth.userId)).limit(1);
    if (!user || !user.stripeSubscriptionId) {
      return void res.json({ isPro: user?.isPro || false, status: null, currentPeriodEnd: null, priceId: null });
    }

    const stripe = await getStripe();
    const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

    const isPro = ["active", "trialing"].includes(sub.status);
    if (isPro !== user.isPro) {
      await db.update(usersTable).set({ isPro, updatedAt: new Date() }).where(eq(usersTable.id, auth.userId));
    }

    res.json({
      isPro,
      status: sub.status,
      currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(),
      priceId: sub.items.data[0]?.price?.id || null,
    });
  } catch (err) {
    req.log.warn(err, "Stripe not configured — returning fallback");
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, auth.userId)).limit(1);
    res.json({ isPro: user?.isPro || false, status: null, currentPeriodEnd: null, priceId: null });
  }
});

router.post("/checkout", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const { priceId } = req.body;
  if (!priceId) return void res.status(400).json({ error: "priceId required" });

  try {
    const stripe = await getStripe();
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, auth.userId)).limit(1);

    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email || "",
        metadata: { clerkUserId: auth.userId },
      });
      customerId = customer.id;
      await db.update(usersTable).set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(usersTable.id, auth.userId));
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/checkout/success`,
      cancel_url: `${APP_URL}/profile`,
      metadata: { clerkUserId: auth.userId },
    });

    res.json({ url: session.url! });
  } catch (err) {
    req.log.error(err, "Failed to create checkout session");
    res.status(500).json({ error: "Stripe not configured. Please connect Stripe in the Integrations tab." });
  }
});

router.post("/portal", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  try {
    const stripe = await getStripe();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, auth.userId)).limit(1);

    if (!user?.stripeCustomerId) {
      return void res.status(400).json({ error: "No Stripe customer found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${APP_URL}/profile`,
    });

    res.json({ url: session.url });
  } catch (err) {
    req.log.error(err, "Failed to create portal session");
    res.status(500).json({ error: "Stripe not configured" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const stripe = await getStripe();
    const products = await stripe.products.list({ active: true, expand: ["data.default_price"] });

    const withPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({ product: product.id, active: true });
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          prices: prices.data.map(p => ({
            id: p.id,
            unitAmount: p.unit_amount || 799,
            currency: p.currency,
            interval: (p.recurring as any)?.interval || null,
          })),
        };
      })
    );

    res.json(withPrices);
  } catch (err) {
    req.log.warn(err, "Stripe not configured — returning hardcoded product");
    res.json([{
      id: "prod_finedge_pro",
      name: "FinEdge Pro",
      description: "Unlock Trade, Portfolio, Paper Trading, Watchlist & Smart Insights",
      prices: [{ id: "price_finedge_monthly", unitAmount: 799, currency: "usd", interval: "month" }],
    }]);
  }
});

export { router as stripeRouter };
