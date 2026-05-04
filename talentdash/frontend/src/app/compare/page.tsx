// frontend/src/app/compare/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getSalaries, getComparison } from "@/lib/api";
import type { Salary, CompareResponse } from "@/types/salary";
import SalaryTable from "@/components/SalaryTable";
import LevelBadge from "@/components/LevelBadge";
import { formatINR, formatDiff, titleCase } from "@/lib/format";

export default function ComparePage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Salary[]>([]);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSalaries({ limit: 100 })
      .then((r) => setSalaries(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (salary: Salary) => {
    setComparison(null);
    setSelected((prev) => {
      if (prev.find((s) => s.id === salary.id)) {
        return prev.filter((s) => s.id !== salary.id);
      }
      if (prev.length >= 2) {
        return [prev[1], salary];
      }
      return [...prev, salary];
    });
  };

  const handleCompare = async () => {
    if (selected.length !== 2) return;
    setComparing(true);
    setError(null);
    try {
      const result = await getComparison(selected[0].id, selected[1].id);
      setComparison(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setComparing(false);
    }
  };

  const selectedIds = selected.map((s) => s.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 fade-up">
        <h1 className="font-display text-3xl sm:text-4xl text-ink-900">
          Compare
          <span className="text-gold-500 italic"> Compensation</span>
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          Select exactly 2 rows from the table below, then click Compare.
        </p>
      </div>

      {/* Selected bar */}
      <div className="bg-white/70 border border-ink-200 rounded-xl p-4 mb-6 fade-up stagger-1">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
            Selected ({selected.length}/2)
          </span>

          {selected.length === 0 && (
            <span className="text-sm text-ink-400">
              Click the checkboxes in the table to select rows.
            </span>
          )}

          {selected.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 bg-gold-400/10 border border-gold-300 rounded-lg px-3 py-1.5"
            >
              <span className="font-medium text-ink-800 text-sm">
                {titleCase(s.company)}
              </span>
              <LevelBadge level={s.level} />
              <button
                onClick={() => toggleSelect(s)}
                className="text-ink-400 hover:text-crimson-500 ml-1 text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={handleCompare}
            disabled={selected.length !== 2 || comparing}
            className="ml-auto px-5 py-2 bg-ink-900 text-ink-50 text-sm font-medium rounded-lg hover:bg-ink-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {comparing ? "Comparing…" : "Compare →"}
          </button>
        </div>
      </div>

      {/* Comparison result */}
      {comparison && (
        <div className="mb-8 fade-up">
          <h2 className="font-display text-2xl text-ink-900 mb-4">
            Side-by-side Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Salary A */}
            <CompareCard salary={comparison.data.salary_a} label="A" />

            {/* Differences */}
            <div className="bg-ink-900 text-ink-50 rounded-xl p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-1">
                Difference (A − B)
              </p>
              {[
                { label: "Base", value: comparison.data.comparison.base_diff },
                { label: "Bonus", value: comparison.data.comparison.bonus_diff },
                { label: "Stock", value: comparison.data.comparison.stock_diff },
                { label: "Total TC", value: comparison.data.comparison.total_diff },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-ink-400">{label}</span>
                  <span
                    className={`font-mono font-semibold text-sm ${
                      value > 0
                        ? "text-emerald-400"
                        : value < 0
                        ? "text-crimson-400"
                        : "text-ink-300"
                    }`}
                  >
                    {formatDiff(value)}
                  </span>
                </div>
              ))}
              <div className="mt-2 pt-3 border-t border-ink-700">
                <p className="text-xs text-ink-400 mb-0.5">Level comparison</p>
                <p className="text-xs text-gold-400 font-medium">
                  {comparison.data.comparison.level_comparison}
                </p>
              </div>
            </div>

            {/* Salary B */}
            <CompareCard salary={comparison.data.salary_b} label="B" />
          </div>
        </div>
      )}

      {error && (
        <div className="text-crimson-500 text-sm mb-4">{error}</div>
      )}

      {/* Table */}
      <div className="fade-up stagger-2">
        <h2 className="font-display text-xl text-ink-800 mb-3">
          All Salaries
        </h2>
        {loading ? (
          <div className="text-center py-16 text-ink-400 animate-pulse text-sm">
            Loading salary data…
          </div>
        ) : (
          <SalaryTable
            salaries={salaries}
            onSelectForCompare={toggleSelect}
            selectedIds={selectedIds}
          />
        )}
      </div>
    </div>
  );
}

function CompareCard({
  salary,
  label,
}: {
  salary: Salary;
  label: string;
}) {
  return (
    <div className="bg-white/70 border border-ink-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink-400 bg-ink-100 px-2 py-0.5 rounded">
          {label}
        </span>
        <LevelBadge level={salary.level} />
      </div>
      <p className="font-display text-xl text-ink-900">{titleCase(salary.company)}</p>
      <p className="text-sm text-ink-600 mt-0.5">{salary.role}</p>
      <p className="text-xs text-ink-400 mt-0.5">{salary.location} · {salary.experience_years}y exp</p>

      <div className="mt-4 space-y-2">
        {[
          { label: "Base", value: salary.base_salary },
          { label: "Bonus", value: salary.bonus },
          { label: "Stock", value: salary.stock },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-ink-400 text-xs">{label}</span>
            <span className="font-mono text-ink-700">
              {value > 0 ? formatINR(value) : "—"}
            </span>
          </div>
        ))}
        <div className="pt-2 border-t border-ink-100 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Total TC
          </span>
          <span className="font-mono font-bold text-ink-900 text-base">
            {formatINR(salary.total_compensation)}
          </span>
        </div>
      </div>
    </div>
  );
}
