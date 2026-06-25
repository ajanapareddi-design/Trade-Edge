import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import { userRouter } from "./userRoutes.js";
import { learnRouter } from "./learnRoutes.js";
import { watchlistRouter } from "./watchlistRoutes.js";
import { stockRouter } from "./stockRoutes.js";
import { paperTradeRouter } from "./paperTradeRoutes.js";
import { portfolioRouter } from "./portfolioRoutes.js";
import { stripeRouter } from "./stripeRoutes.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/user", userRouter);
router.use("/learn", learnRouter);
router.use("/watchlist", watchlistRouter);
router.use("/stocks", stockRouter);
router.use("/paper-trade", paperTradeRouter);
router.use("/portfolio", portfolioRouter);
router.use("/stripe", stripeRouter);

export default router;
