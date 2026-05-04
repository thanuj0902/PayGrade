// frontend/src/lib/format.ts

/**
 * Format a number as Indian rupees (₹).
 * Values ≥ 10L shown as "₹12.5L", ≥ 1Cr as "₹1.2Cr".
 */
export function formatINR(value: number): string {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  }
  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Format a diff value with +/- prefix.
 */
export function formatDiff(value: number): string {
  const formatted = formatINR(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `−${formatted}`;
  return "Equal";
}

/**
 * Capitalize first letter of each word.
 */
export function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Level display — uppercase + styled
 */
export function formatLevel(level: string): string {
  return level.toUpperCase();
}

/**
 * Confidence score → label
 */
export function confidenceLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 0.9) return { label: "High", color: "text-emerald-600" };
  if (score >= 0.75) return { label: "Medium", color: "text-gold-600" };
  return { label: "Low", color: "text-crimson-500" };
}
