import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habits.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { auth } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);

app.use(auth); // Everything beneath is protected
app.use("/api/habits", habitRoutes);
// app.use entries needs to be added soon

export default app;
