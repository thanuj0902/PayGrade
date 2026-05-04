// backend/src/routes/company.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { normalizeCompany } from "../utils/normalize";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// ── GET /api/company/:company ─────────────────────────────────────────────────
router.get(
  "/company/:company",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyParam = req.params.company;
      if (!companyParam || companyParam.trim() === "") {
        throw new AppError(400, "Company name is required");
      }

      const normalizedCompany = normalizeCompany(companyParam);

      const salaries = await prisma.salary.findMany({
        where: { company: normalizedCompany },
        orderBy: { total_compensation: "desc" },
      });

      if (salaries.length === 0) {
        throw new AppError(404, `No data found for company: ${companyParam}`);
      }

      // Compute median total compensation
      const sorted = [...salaries].sort(
        (a, b) => a.total_compensation - b.total_compensation
      );
      const mid = Math.floor(sorted.length / 2);
      const median_tc =
        sorted.length % 2 === 0
          ? (sorted[mid - 1].total_compensation + sorted[mid].total_compensation) / 2
          : sorted[mid].total_compensation;

      // Level distribution
      const levelDistribution: Record<string, number> = {};
      for (const s of salaries) {
        levelDistribution[s.level] = (levelDistribution[s.level] ?? 0) + 1;
      }

      // Average TC per level
      const levelStats: Record<
        string,
        { count: number; avg_tc: number; median_tc: number }
      > = {};
      const byLevel: Record<string, number[]> = {};
      for (const s of salaries) {
        (byLevel[s.level] = byLevel[s.level] ?? []).push(s.total_compensation);
      }
      for (const [lvl, tcs] of Object.entries(byLevel)) {
        const sortedTcs = [...tcs].sort((a, b) => a - b);
        const m = Math.floor(sortedTcs.length / 2);
        levelStats[lvl] = {
          count: tcs.length,
          avg_tc: parseFloat(
            (tcs.reduce((a, b) => a + b, 0) / tcs.length).toFixed(2)
          ),
          median_tc:
            sortedTcs.length % 2 === 0
              ? (sortedTcs[m - 1] + sortedTcs[m]) / 2
              : sortedTcs[m],
        };
      }

      return res.json({
        data: {
          company: normalizedCompany,
          total_entries: salaries.length,
          median_tc: parseFloat(median_tc.toFixed(2)),
          level_distribution: levelDistribution,
          level_stats: levelStats,
          salaries,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/companies ────────────────────────────────────────────────────────
// Returns list of all distinct companies (useful for search/autocomplete)
router.get(
  "/companies",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const companies = await prisma.salary.findMany({
        select: { company: true },
        distinct: ["company"],
        orderBy: { company: "asc" },
      });

      return res.json({ data: companies.map((c) => c.company) });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
