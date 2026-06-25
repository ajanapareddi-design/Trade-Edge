import { Router } from "express";
import { getTodayLesson, getUpcomingLessons, LESSONS } from "../lib/lessons.js";

const router = Router();

router.get("/today", (req, res) => {
  res.json(getTodayLesson());
});

router.get("/upcoming", (req, res) => {
  res.json(getUpcomingLessons(5));
});

router.get("/concepts", (req, res) => {
  res.json(LESSONS.map(l => ({ id: l.id, title: l.title, tag: l.tag, dayIndex: l.dayIndex })));
});

export { router as learnRouter };
