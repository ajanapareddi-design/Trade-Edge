import { pgTable, text, timestamp, serial, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioHoldingTable = pgTable("portfolio_holding", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  ticker: text("ticker").notNull(),
  companyName: text("company_name").notNull().default(""),
  shares: real("shares").notNull(),
  avgCost: real("avg_cost").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPortfolioHoldingSchema = createInsertSchema(portfolioHoldingTable).omit({ id: true, addedAt: true, updatedAt: true });
export type InsertPortfolioHolding = z.infer<typeof insertPortfolioHoldingSchema>;
export type PortfolioHolding = typeof portfolioHoldingTable.$inferSelect;
