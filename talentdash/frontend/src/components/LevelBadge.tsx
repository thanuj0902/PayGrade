// frontend/src/components/LevelBadge.tsx
import clsx from "clsx";

const LEVEL_COLORS: Record<string, string> = {
  l3: "bg-blue-100 text-blue-800 border-blue-200",
  l4: "bg-indigo-100 text-indigo-800 border-indigo-200",
  l5: "bg-violet-100 text-violet-800 border-violet-200",
  l6: "bg-purple-100 text-purple-800 border-purple-200",
  l7: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  l8: "bg-pink-100 text-pink-800 border-pink-200",
  sde1: "bg-sky-100 text-sky-800 border-sky-200",
  sde2: "bg-teal-100 text-teal-800 border-teal-200",
  sde3: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "junior engineer": "bg-green-100 text-green-800 border-green-200",
  engineer: "bg-lime-100 text-lime-800 border-lime-200",
  "senior engineer": "bg-amber-100 text-amber-800 border-amber-200",
  "staff engineer": "bg-orange-100 text-orange-800 border-orange-200",
  "principal engineer": "bg-red-100 text-red-800 border-red-200",
};

export default function LevelBadge({ level }: { level: string }) {
  const colorClass =
    LEVEL_COLORS[level.toLowerCase()] ?? "bg-ink-100 text-ink-700 border-ink-200";

  return (
    <span
      className={clsx(
        "level-badge inline-flex items-center px-2 py-0.5 rounded border",
        colorClass
      )}
    >
      {level.toUpperCase()}
    </span>
  );
}
