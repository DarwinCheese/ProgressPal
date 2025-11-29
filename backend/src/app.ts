import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habits.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/habits", habitRoutes);
app.use("/auth", authRoutes);

export default app;