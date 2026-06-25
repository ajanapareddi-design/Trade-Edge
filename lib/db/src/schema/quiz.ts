import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quizPreferencesTable = pgTable("quiz_preferences", {
  userId: text("user_id").primaryKey(),
  strategies: text("strategies").notNull().default("[]"),
  capitalRange: text("capital_range"),
  profitTarget: text("profit_target"),
  completed: boolean("completed").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const learningStreakTable = pgTable("learning_streak", {
  userId: text("user_id").primaryKey(),
  currentStreak: text("current_streak").notNull().default("0"),
  longestStreak: text("longest_streak").notNull().default("0"),
  lastCheckinDate: text("last_checkin_date"),
  checkinDates: text("checkin_dates").notNull().default("[]"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuizPreferencesSchema = createInsertSchema(quizPreferencesTable).omit({ updatedAt: true });
export type InsertQuizPreferences = z.infer<typeof insertQuizPreferencesSchema>;
export type QuizPreferences = typeof quizPreferencesTable.$inferSelect;
export type LearningStreak = typeof learningStreakTable.$inferSelect;
