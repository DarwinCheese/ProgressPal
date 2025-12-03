import { prisma } from "../prisma/client.js";
import { Router } from "express";
import { auth } from "../middleware/auth.js";

const router = Router();

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

  if (!title || title.length > 50) {
    return res
      .status(400)
      .json({ error: "Title must be 1-50 characters long" });
  }

  if (!description || description.length > 200) {
    return res
      .status(400)
      .json({ error: "Description must be 1-200 characters long" });
  }

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
    where: { id: req.params.id, userId: req.userId },
  });

  res.json({ success: true });
});

export default router;
