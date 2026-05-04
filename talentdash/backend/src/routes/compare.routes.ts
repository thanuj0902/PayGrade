// backend/src/routes/compare.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import { query, validationResult } from "express-validator";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// ── GET /api/compare?salaryId1=xxx&salaryId2=yyy ──────────────────────────────
router.get(
  "/compare",
  [
    query("salaryId1").isString().notEmpty().withMessage("salaryId1 is required"),
    query("salaryId2").isString().notEmpty().withMessage("salaryId2 is required"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { salaryId1, salaryId2 } = req.query as {
        salaryId1: string;
        salaryId2: string;
      };

      if (salaryId1 === salaryId2) {
        throw new AppError(400, "salaryId1 and salaryId2 must be different");
      }

      const [a, b] = await Promise.all([
        prisma.salary.findUnique({ where: { id: salaryId1 } }),
        prisma.salary.findUnique({ where: { id: salaryId2 } }),
      ]);

      if (!a) throw new AppError(404, `Salary not found: ${salaryId1}`);
      if (!b) throw new AppError(404, `Salary not found: ${salaryId2}`);

      // Determine level ordering for "difference"
      const LEVEL_ORDER: Record<string, number> = {
        l3: 1, sde1: 1, "junior engineer": 1,
        l4: 2, sde2: 2, engineer: 2,
        l5: 3, sde3: 3, "senior engineer": 3,
        l6: 4, "staff engineer": 4,
        l7: 5, "principal engineer": 5,
        l8: 6, "distinguished engineer": 6,
      };

      const levelA = LEVEL_ORDER[a.level] ?? 0;
      const levelB = LEVEL_ORDER[b.level] ?? 0;
      const levelDiff =
        levelA === levelB
          ? "same level"
          : levelA > levelB
          ? `${a.company}/${a.level} is higher`
          : `${b.company}/${b.level} is higher`;

      const diff = (x: number, y: number) =>
        parseFloat((x - y).toFixed(2));

      return res.json({
        data: {
          salary_a: a,
          salary_b: b,
          comparison: {
            base_diff: diff(a.base_salary, b.base_salary),
            bonus_diff: diff(a.bonus, b.bonus),
            stock_diff: diff(a.stock, b.stock),
            total_diff: diff(a.total_compensation, b.total_compensation),
            level_comparison: levelDiff,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
