import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habits.routes.js";
// import entryRoutes from "./routes/entries.routes";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use("/api/habits", habitRoutes);
// app.use("/api/entries", entryRoutes);

export default app;