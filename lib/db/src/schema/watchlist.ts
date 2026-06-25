import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const watchlistTable = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  ticker: text("ticker").notNull(),
  companyName: text("company_name").notNull().default(""),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const insertWatchlistSchema = createInsertSchema(watchlistTable).omit({ id: true, addedAt: true });
export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type WatchlistItem = typeof watchlistTable.$inferSelect;
