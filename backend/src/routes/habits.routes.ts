import { Router } from "express";
import { prisma } from "../prisma/client.js";

const router = Router();

// Get all habits
router.get("/", async (req, res) => {
  const habits = await prisma.habit.findMany({ include: { entries: true } });
  res.json(habits);
});

// Create habit
router.post("/", async (req, res) => {
  const { title, description, userId } = req.body;
  const habit = await prisma.habit.create({
    data: { title, description, userId },
  });
  res.status(201).json(habit);
});

// Delete habit
router.delete("/:id", async (req, res) => {
  await prisma.habit.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;