// backend/src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import salaryRoutes from "./routes/salary.routes";
import companyRoutes from "./routes/company.routes";
import compareRoutes from "./routes/compare.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(morgan("dev"));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", salaryRoutes);
app.use("/api", companyRoutes);
app.use("/api", compareRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
