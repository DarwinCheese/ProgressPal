import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const router = Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if email already exists
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Check if name already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Name already in use" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
      },
    });

    res.status(201).json({
      message: "User registered",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
