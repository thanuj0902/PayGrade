// frontend/src/app/page.tsx
import { Suspense } from "react";
import { getSalaries } from "@/lib/api";
import SalaryFilters from "@/components/SalaryFilters";
import SalaryTable from "@/components/SalaryTable";
import Pagination from "@/components/Pagination";
import { formatINR } from "@/lib/format";

interface SearchParams {
  company?: string;
  role?: string;
  level?: string;
  location?: string;
  sort?: string;
  order?: string;
  page?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page ?? "1", 10);

  let result;
  let error: string | null = null;

  try {
    result = await getSalaries({
      company: searchParams.company,
      role: searchParams.role,
      level: searchParams.level,
      location: searchParams.location,
      sort: searchParams.sort || "total_compensation",
      order: (searchParams.order as "asc" | "desc") || "desc",
      page,
      limit: 20,
    });
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero header */}
      <div className="mb-8 fade-up">
        <h1 className="font-display text-3xl sm:text-4xl text-ink-900 leading-tight">
          Compensation Intelligence
          <span className="block text-gold-500 italic">for India's tech industry</span>
        </h1>
        <p className="mt-2 text-ink-500 text-sm sm:text-base max-w-xl">
          Level-standardized salary data. Structured, comparable, and
          decision-ready — the way compensation data should be.
        </p>
      </div>

      {/* Stats strip */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 fade-up stagger-1">
          {[
            { label: "Total entries", value: result.meta.total.toLocaleString() },
            {
              label: "Median TC shown",
              value: result.data.length > 0
                ? formatINR(
                    [...result.data]
                      .sort((a, b) => a.total_compensation - b.total_compensation)
                      [Math.floor(result.data.length / 2)]?.total_compensation ?? 0
                  )
                : "—",
            },
            { label: "Page", value: `${result.meta.page} / ${result.meta.total_pages}` },
            { label: "Per page", value: "20 entries" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/60 border border-ink-200 rounded-xl px-4 py-3"
            >
              <div className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">
                {label}
              </div>
              <div className="font-mono font-semibold text-ink-900 text-lg mt-0.5">
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 fade-up stagger-2">
        <Suspense fallback={null}>
          <SalaryFilters />
        </Suspense>
      </div>

      {/* Table */}
      <div className="fade-up stagger-3">
        {error ? (
          <div className="text-center py-16">
            <p className="text-crimson-500 font-medium">{error}</p>
            <p className="text-ink-400 text-sm mt-1">
              Make sure the backend is running at{" "}
              <code className="font-mono">localhost:4000</code>
            </p>
          </div>
        ) : (
          <>
            <SalaryTable salaries={result?.data ?? []} />
            <Suspense fallback={null}>
              <Pagination
                currentPage={result?.meta.page ?? 1}
                totalPages={result?.meta.total_pages ?? 1}
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
