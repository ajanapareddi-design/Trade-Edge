import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors());

// Clerk FAPI proxy — must be BEFORE express.json()
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// Stripe webhook — raw body required, must be BEFORE express.json()
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) { res.status(400).send("Missing stripe-signature header"); return; }

  try {
    const { WebhookHandlers } = await import("./webhookHandlers.js");
    await WebhookHandlers.processWebhook(req.body as Buffer, sig as string);
    res.json({ received: true });
  } catch (err: any) {
    logger.warn({ err }, "Stripe webhook error");
    res.status(400).send(`Webhook error: ${err?.message}`);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
