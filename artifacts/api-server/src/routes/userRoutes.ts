import { Router } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { db } from "../db.js";
import { usersTable, quizPreferencesTable, learningStreakTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.use(clerkMiddleware());

async function ensureUser(clerkUserId: string, email?: string): Promise<void> {
  const existing = await db.select().from(usersTable).where(eq(usersTable.id, clerkUserId)).limit(1);
  if (!existing.length) {
    await db.insert(usersTable).values({
      id: clerkUserId,
      email: email || "",
      isPro: false,
    });
  }
}

router.get("/me", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  await ensureUser(auth.userId, auth.sessionClaims?.email as string | undefined);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, auth.userId)).limit(1);
  if (!user) return void res.status(404).json({ error: "User not found" });

  res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    isPro: user.isPro,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    createdAt: user.createdAt.toISOString(),
  });
});

router.patch("/me", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const { displayName } = req.body;
  await db.update(usersTable)
    .set({ displayName: displayName || null, updatedAt: new Date() })
    .where(eq(usersTable.id, auth.userId));

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, auth.userId)).limit(1);
  res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    isPro: user.isPro,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    createdAt: user.createdAt.toISOString(),
  });
});

router.get("/quiz", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const [prefs] = await db.select().from(quizPreferencesTable).where(eq(quizPreferencesTable.userId, auth.userId)).limit(1);
  if (!prefs) {
    return void res.json({ userId: auth.userId, strategies: [], capitalRange: null, profitTarget: null, completed: false });
  }

  res.json({
    userId: prefs.userId,
    strategies: JSON.parse(prefs.strategies),
    capitalRange: prefs.capitalRange,
    profitTarget: prefs.profitTarget,
    completed: prefs.completed,
  });
});

router.post("/quiz", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const { strategies, capitalRange, profitTarget } = req.body;

  await db.insert(quizPreferencesTable).values({
    userId: auth.userId,
    strategies: JSON.stringify(strategies || []),
    capitalRange: capitalRange || null,
    profitTarget: profitTarget || null,
    completed: true,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: quizPreferencesTable.userId,
    set: {
      strategies: JSON.stringify(strategies || []),
      capitalRange: capitalRange || null,
      profitTarget: profitTarget || null,
      completed: true,
      updatedAt: new Date(),
    },
  });

  const [prefs] = await db.select().from(quizPreferencesTable).where(eq(quizPreferencesTable.userId, auth.userId)).limit(1);
  res.json({
    userId: prefs.userId,
    strategies: JSON.parse(prefs.strategies),
    capitalRange: prefs.capitalRange,
    profitTarget: prefs.profitTarget,
    completed: prefs.completed,
  });
});

router.get("/streak", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const [streak] = await db.select().from(learningStreakTable).where(eq(learningStreakTable.userId, auth.userId)).limit(1);
  if (!streak) {
    return void res.json({ currentStreak: 0, longestStreak: 0, lastCheckinDate: null, checkinDates: [] });
  }

  res.json({
    currentStreak: parseInt(streak.currentStreak),
    longestStreak: parseInt(streak.longestStreak),
    lastCheckinDate: streak.lastCheckinDate,
    checkinDates: JSON.parse(streak.checkinDates),
  });
});

router.post("/streak", async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) return void res.status(401).json({ error: "Unauthorized" });

  const today = new Date().toISOString().split("T")[0];

  const [existing] = await db.select().from(learningStreakTable).where(eq(learningStreakTable.userId, auth.userId)).limit(1);

  if (!existing) {
    await db.insert(learningStreakTable).values({
      userId: auth.userId,
      currentStreak: "1",
      longestStreak: "1",
      lastCheckinDate: today,
      checkinDates: JSON.stringify([today]),
      updatedAt: new Date(),
    });
  } else {
    const checkinDates: string[] = JSON.parse(existing.checkinDates);
    if (checkinDates.includes(today)) {
      return void res.json({
        currentStreak: parseInt(existing.currentStreak),
        longestStreak: parseInt(existing.longestStreak),
        lastCheckinDate: existing.lastCheckinDate,
        checkinDates,
      });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = existing.lastCheckinDate === yesterdayStr
      ? parseInt(existing.currentStreak) + 1
      : 1;

    const newLongest = Math.max(parseInt(existing.longestStreak), newStreak);
    checkinDates.push(today);

    await db.update(learningStreakTable).set({
      currentStreak: String(newStreak),
      longestStreak: String(newLongest),
      lastCheckinDate: today,
      checkinDates: JSON.stringify(checkinDates.slice(-90)),
      updatedAt: new Date(),
    }).where(eq(learningStreakTable.userId, auth.userId));

    const [updated] = await db.select().from(learningStreakTable).where(eq(learningStreakTable.userId, auth.userId)).limit(1);
    return void res.json({
      currentStreak: parseInt(updated.currentStreak),
      longestStreak: parseInt(updated.longestStreak),
      lastCheckinDate: updated.lastCheckinDate,
      checkinDates: JSON.parse(updated.checkinDates),
    });
  }

  const [created] = await db.select().from(learningStreakTable).where(eq(learningStreakTable.userId, auth.userId)).limit(1);
  res.json({
    currentStreak: parseInt(created.currentStreak),
    longestStreak: parseInt(created.longestStreak),
    lastCheckinDate: created.lastCheckinDate,
    checkinDates: JSON.parse(created.checkinDates),
  });
});

export { router as userRouter, ensureUser };
