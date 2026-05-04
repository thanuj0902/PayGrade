// frontend/src/components/SalaryFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const LEVELS = [
  "L3", "L4", "L5", "L6", "L7", "L8",
  "SDE1", "SDE2", "SDE3",
  "Junior Engineer", "Engineer", "Senior Engineer",
  "Staff Engineer", "Principal Engineer",
];

export default function SalaryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset to page 1 on filter change
      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearAll = () => {
    startTransition(() => {
      router.push("/");
    });
  };

  const hasFilters =
    get("company") || get("role") || get("level") || get("location");

  return (
    <div className="bg-white/60 border border-ink-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
          Filters
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-crimson-500 hover:text-crimson-600 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Company */}
        <div>
          <label className="block text-[11px] font-medium text-ink-500 mb-1 uppercase tracking-wider">
            Company
          </label>
          <input
            type="text"
            placeholder="e.g. Google"
            value={get("company")}
            onChange={(e) => updateFilter("company", e.target.value)}
            className="w-full text-sm border border-ink-200 rounded-lg px-3 py-2 bg-white/80 text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-[11px] font-medium text-ink-500 mb-1 uppercase tracking-wider">
            Role
          </label>
          <input
            type="text"
            placeholder="e.g. Software Engineer"
            value={get("role")}
            onChange={(e) => updateFilter("role", e.target.value)}
            className="w-full text-sm border border-ink-200 rounded-lg px-3 py-2 bg-white/80 text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-[11px] font-medium text-ink-500 mb-1 uppercase tracking-wider">
            Level
          </label>
          <select
            value={get("level")}
            onChange={(e) => updateFilter("level", e.target.value)}
            className="w-full text-sm border border-ink-200 rounded-lg px-3 py-2 bg-white/80 text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
          >
            <option value="">All levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l.toLowerCase()}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-[11px] font-medium text-ink-500 mb-1 uppercase tracking-wider">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Bangalore"
            value={get("location")}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full text-sm border border-ink-200 rounded-lg px-3 py-2 bg-white/80 text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
          />
        </div>
      </div>

      {isPending && (
        <div className="mt-2 text-xs text-ink-400 animate-pulse">
          Updating results…
        </div>
      )}
    </div>
  );
}
