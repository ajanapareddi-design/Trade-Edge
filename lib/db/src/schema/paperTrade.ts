import { pgTable, text, timestamp, serial, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const paperPortfolioTable = pgTable("paper_portfolio", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  cashBalance: real("cash_balance").notNull().default(50000),
  startingBalance: real("starting_balance").notNull().default(50000),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paperPositionTable = pgTable("paper_position", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  ticker: text("ticker").notNull(),
  companyName: text("company_name").notNull().default(""),
  shares: real("shares").notNull(),
  avgCost: real("avg_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paperTradeTable = pgTable("paper_trade", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  ticker: text("ticker").notNull(),
  companyName: text("company_name").notNull().default(""),
  shares: real("shares").notNull(),
  price: real("price").notNull(),
  action: text("action").notNull(),
  total: real("total").notNull(),
  portfolioValueAfter: real("portfolio_value_after"),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

export const paperPerformanceTable = pgTable("paper_performance", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  value: real("value").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertPaperTradeSchema = createInsertSchema(paperTradeTable).omit({ id: true, executedAt: true });
export type InsertPaperTrade = z.infer<typeof insertPaperTradeSchema>;
export type PaperTrade = typeof paperTradeTable.$inferSelect;
export type PaperPosition = typeof paperPositionTable.$inferSelect;
export type PaperPortfolio = typeof paperPortfolioTable.$inferSelect;
