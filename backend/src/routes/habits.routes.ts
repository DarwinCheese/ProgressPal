import { prisma } from "../prisma/client.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { success } from "zod";

const router = Router();

// Check JWT and get user ID
function auth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// GET /habits
router.get("/", auth, async (req: any, res) => {
  const habits = await prisma.habit.findMany({
    where: { userId: req.userId },
  });
  res.json(habits);
});

// POST /habits
router.post("/", auth, async (req: any, res) => {
  const { title, description } = req.body;

  const habit = await prisma.habit.create({
    data: {
      title,
      description,
      userId: req.userId,
    },
  });

  res.json(habit);
});

// Delete /habits
router.delete("/:id", auth, async (req: any, res) => {
  await prisma.habit.delete({
    where: { id: req.params.id, useId: req.useId },
  });

  res.json({ success: true });
});

export default router;
