// frontend/src/components/SalaryTable.tsx
import Link from "next/link";
import type { Salary } from "@/types/salary";
import LevelBadge from "./LevelBadge";
import { formatINR, titleCase } from "@/lib/format";

interface Props {
  salaries: Salary[];
  onSelectForCompare?: (salary: Salary) => void;
  selectedIds?: string[];
}

export default function SalaryTable({
  salaries,
  onSelectForCompare,
  selectedIds = [],
}: Props) {
  if (salaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="font-display text-xl text-ink-700">No results found</p>
        <p className="text-sm text-ink-400 mt-1">
          Try adjusting your filters or broadening your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white/60">
      <table className="salary-table w-full text-sm">
        <thead>
          <tr className="border-b border-ink-200 bg-ink-50/80">
            {onSelectForCompare && (
              <th className="px-4 py-3 text-left w-10" />
            )}
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Level</th>
            <th className="px-4 py-3 text-left hidden sm:table-cell">Location</th>
            <th className="px-4 py-3 text-right hidden md:table-cell">Exp</th>
            <th className="px-4 py-3 text-right hidden lg:table-cell">Base</th>
            <th className="px-4 py-3 text-right hidden lg:table-cell">Bonus</th>
            <th className="px-4 py-3 text-right hidden lg:table-cell">Stock</th>
            <th className="px-4 py-3 text-right">Total TC</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((s, i) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <tr
                key={s.id}
                className={`
                  border-b border-ink-100 last:border-0
                  hover:bg-gold-400/5 transition-colors
                  ${isSelected ? "bg-gold-400/10" : i % 2 === 0 ? "bg-white/40" : "bg-transparent"}
                `}
              >
                {onSelectForCompare && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectForCompare(s)}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                        ${isSelected
                          ? "border-gold-500 bg-gold-500"
                          : "border-ink-300 hover:border-gold-400"
                        }
                      `}
                      title={isSelected ? "Remove from compare" : "Add to compare"}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </td>
                )}
                <td className="px-4 py-3 font-medium text-ink-900">
                  <Link
                    href={`/company/${encodeURIComponent(s.company)}`}
                    className="hover:text-gold-600 transition-colors"
                  >
                    {titleCase(s.company)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-700">{s.role}</td>
                <td className="px-4 py-3">
                  <LevelBadge level={s.level} />
                </td>
                <td className="px-4 py-3 text-ink-500 hidden sm:table-cell">
                  {s.location}
                </td>
                <td className="px-4 py-3 text-right text-ink-500 font-mono text-xs hidden md:table-cell">
                  {s.experience_years}y
                </td>
                <td className="px-4 py-3 text-right text-ink-600 font-mono text-xs hidden lg:table-cell">
                  {formatINR(s.base_salary)}
                </td>
                <td className="px-4 py-3 text-right text-ink-500 font-mono text-xs hidden lg:table-cell">
                  {s.bonus > 0 ? formatINR(s.bonus) : "—"}
                </td>
                <td className="px-4 py-3 text-right text-ink-500 font-mono text-xs hidden lg:table-cell">
                  {s.stock > 0 ? formatINR(s.stock) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono font-semibold text-ink-900">
                    {formatINR(s.total_compensation)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
