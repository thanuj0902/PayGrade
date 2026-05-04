// frontend/src/app/company/[name]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompany } from "@/lib/api";
import SalaryTable from "@/components/SalaryTable";
import LevelBadge from "@/components/LevelBadge";
import { formatINR, titleCase } from "@/lib/format";

interface Props {
  params: { name: string };
}

export default async function CompanyPage({ params }: Props) {
  const companyName = decodeURIComponent(params.name);

  let result;
  try {
    result = await getCompany(companyName);
  } catch {
    notFound();
  }

  const { company, total_entries, median_tc, level_distribution, level_stats, salaries } =
    result.data;

  const sortedLevels = Object.entries(level_stats).sort(
    ([, a], [, b]) => b.median_tc - a.median_tc
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800 mb-6 transition-colors"
      >
        ← All salaries
      </Link>

      {/* Header */}
      <div className="mb-8 fade-up">
        <h1 className="font-display text-3xl sm:text-4xl text-ink-900">
          {titleCase(company)}
        </h1>
        <p className="text-ink-500 text-sm mt-1">
          {total_entries} data point{total_entries !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 fade-up stagger-1">
        <div className="bg-white/70 border border-ink-200 rounded-xl px-5 py-4">
          <div className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">
            Median Total TC
          </div>
          <div className="font-mono font-bold text-2xl text-ink-900 mt-1">
            {formatINR(median_tc)}
          </div>
        </div>
        <div className="bg-white/70 border border-ink-200 rounded-xl px-5 py-4">
          <div className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">
            Distinct Levels
          </div>
          <div className="font-mono font-bold text-2xl text-ink-900 mt-1">
            {Object.keys(level_distribution).length}
          </div>
        </div>
        <div className="bg-white/70 border border-ink-200 rounded-xl px-5 py-4">
          <div className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">
            Total Entries
          </div>
          <div className="font-mono font-bold text-2xl text-ink-900 mt-1">
            {total_entries}
          </div>
        </div>
      </div>

      {/* Level breakdown */}
      {sortedLevels.length > 0 && (
        <div className="mb-8 fade-up stagger-2">
          <h2 className="font-display text-xl text-ink-800 mb-3">
            Compensation by Level
          </h2>
          <div className="grid gap-2">
            {sortedLevels.map(([level, stats]) => {
              const maxTC = sortedLevels[0][1].median_tc;
              const pct = maxTC > 0 ? (stats.median_tc / maxTC) * 100 : 0;
              return (
                <div
                  key={level}
                  className="flex items-center gap-4 bg-white/60 border border-ink-200 rounded-xl px-4 py-3"
                >
                  <div className="w-24 flex-shrink-0">
                    <LevelBadge level={level} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-ink-400">
                        {stats.count} entr{stats.count !== 1 ? "ies" : "y"}
                      </span>
                      <span className="font-mono font-semibold text-sm text-ink-900">
                        {formatINR(stats.median_tc)}{" "}
                        <span className="text-ink-400 font-normal text-xs">median</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Salary list */}
      <div className="fade-up stagger-3">
        <h2 className="font-display text-xl text-ink-800 mb-3">All Entries</h2>
        <SalaryTable salaries={salaries} />
      </div>
    </div>
  );
}
