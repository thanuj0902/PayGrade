// backend/src/routes/salary.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import { prisma } from "../lib/prisma";
import {
  normalizeCompany,
  normalizeLevel,
  parsePositiveNumber,
  computeTC,
  VALID_LEVELS,
} from "../utils/normalize";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// ── POST /api/ingest-salary ───────────────────────────────────────────────────
const ingestValidators = [
  body("company").isString().notEmpty().withMessage("company is required"),
  body("role").isString().notEmpty().withMessage("role is required"),
  body("level")
    .isString()
    .notEmpty()
    .withMessage("level is required")
    .custom((val) => {
      if (!normalizeLevel(val)) {
        throw new Error(
          `Invalid level. Must be one of: ${VALID_LEVELS.join(", ")}`
        );
      }
      return true;
    }),
  body("location").isString().notEmpty().withMessage("location is required"),
  body("experience_years")
    .isInt({ min: 0, max: 50 })
    .withMessage("experience_years must be an integer 0–50"),
  body("base_salary")
    .isFloat({ min: 0 })
    .withMessage("base_salary must be a positive number"),
  body("bonus")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("bonus must be a positive number"),
  body("stock")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("stock must be a positive number"),
  body("confidence_score")
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage("confidence_score must be between 0 and 1"),
];

router.post(
  "/ingest-salary",
  ingestValidators,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const {
        company,
        role,
        level,
        location,
        experience_years,
        base_salary,
        bonus = 0,
        stock = 0,
        confidence_score = 1.0,
      } = req.body;

      // Parse & validate numbers
      const base = parsePositiveNumber(base_salary);
      const bonusVal = parsePositiveNumber(bonus) ?? 0;
      const stockVal = parsePositiveNumber(stock) ?? 0;

      if (base === null) {
        throw new AppError(422, "Invalid base_salary");
      }

      // Normalize
      const normalizedCompany = normalizeCompany(String(company));
      const normalizedLevel = normalizeLevel(String(level))!;
      const total = computeTC(base, bonusVal, stockVal);

      // Deduplicate: same company + role + level + experience + base within 1%
      const existing = await prisma.salary.findFirst({
        where: {
          company: normalizedCompany,
          role: String(role).trim(),
          level: normalizedLevel,
          experience_years: parseInt(String(experience_years), 10),
          base_salary: { gte: base * 0.99, lte: base * 1.01 },
        },
      });

      if (existing) {
        return res.status(409).json({
          error: "Duplicate entry detected",
          existing_id: existing.id,
        });
      }

      const salary = await prisma.salary.create({
        data: {
          company: normalizedCompany,
          role: String(role).trim(),
          level: normalizedLevel,
          location: String(location).trim(),
          experience_years: parseInt(String(experience_years), 10),
          base_salary: base,
          bonus: bonusVal,
          stock: stockVal,
          total_compensation: total,
          confidence_score: parseFloat(String(confidence_score)),
        },
      });

      return res.status(201).json({ data: salary });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/salaries ─────────────────────────────────────────────────────────
const listValidators = [
  query("company").optional().isString(),
  query("role").optional().isString(),
  query("level").optional().isString(),
  query("location").optional().isString(),
  query("sort")
    .optional()
    .isIn(["total_compensation", "base_salary", "experience_years", "created_at"])
    .withMessage("Invalid sort field"),
  query("order").optional().isIn(["asc", "desc"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

router.get(
  "/salaries",
  listValidators,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const {
        company,
        role,
        level,
        location,
        sort = "total_compensation",
        order = "desc",
        page = "1",
        limit = "50",
      } = req.query as Record<string, string>;

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build filters
      const where: Record<string, unknown> = {};
      if (company) where.company = { contains: normalizeCompany(company) };
      if (role) where.role = { contains: role.trim(), mode: "insensitive" };
      if (level) {
        const norm = normalizeLevel(level);
        if (norm) where.level = norm;
      }
      if (location)
        where.location = { contains: location.trim(), mode: "insensitive" };

      const [total, salaries] = await Promise.all([
        prisma.salary.count({ where }),
        prisma.salary.findMany({
          where,
          orderBy: { [sort]: order as "asc" | "desc" },
          skip,
          take: limitNum,
        }),
      ]);

      return res.json({
        data: salaries,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          total_pages: Math.ceil(total / limitNum),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
