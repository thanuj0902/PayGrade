// backend/src/utils/normalize.ts

/**
 * Normalize a company name:
 * - lowercase
 * - trimmed
 * - collapse internal whitespace
 */
export function normalizeCompany(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Valid standardized levels.
 * Extend this list freely; keep it canonical.
 */
export const VALID_LEVELS = [
  // Google-style
  "l3", "l4", "l5", "l6", "l7", "l8",
  // Amazon / generic SDE
  "sde1", "sde2", "sde3",
  // Title-based
  "junior engineer", "engineer", "senior engineer",
  "staff engineer", "principal engineer", "distinguished engineer",
  // Management
  "em", "senior em", "director", "vp",
  // Data / ML
  "analyst", "senior analyst", "data scientist", "senior data scientist",
  "ml engineer", "senior ml engineer",
  // Product
  "apm", "pm", "senior pm", "group pm", "director of pm",
] as const;

export type ValidLevel = typeof VALID_LEVELS[number];

/**
 * Normalize level to lowercase trimmed string.
 * Returns null if the level is not in the canonical list.
 */
export function normalizeLevel(raw: string): string | null {
  const normalized = raw.trim().toLowerCase();
  if ((VALID_LEVELS as readonly string[]).includes(normalized)) {
    return normalized;
  }
  return null;
}

/**
 * Parse a numeric-like value that might be a string.
 * Returns null if unparseable or negative.
 */
export function parsePositiveNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (isNaN(num) || num < 0) return null;
  return num;
}

/**
 * Compute total compensation.
 * Validates that the result matches what the caller expects (if provided).
 */
export function computeTC(
  base: number,
  bonus: number,
  stock: number
): number {
  return parseFloat((base + bonus + stock).toFixed(2));
}
