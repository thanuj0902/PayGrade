import { Suspense } from "react";
import { getSalaries } from "@/lib/api";
import SalaryFilters from "@/components/SalaryFilters";
import SalaryTable from "@/components/SalaryTable";
import Pagination from "@/components/Pagination";
import { formatINR } from "@/lib/format";

interface SearchParams {
  company?: string; role?: string; level?: string;
  location?: string; sort?: string; order?: string; page?: string;
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page ?? "1", 10);
  let result; let error: string | null = null;
  try {
    result = await getSalaries({
      company: searchParams.company, role: searchParams.role,
      level: searchParams.level, location: searchParams.location,
      sort: searchParams.sort || "total_compensation",
      order: (searchParams.order as "asc" | "desc") || "desc",
      page, limit: 20,
    });
  } catch (e) { error = (e as Error).message; }

  const medianTC = result && result.data.length > 0
    ? [...result.data].sort((a, b) => a.total_compensation - b.total_compensation)[Math.floor(result.data.length / 2)]?.total_compensation ?? 0
    : 0;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{
          background: '#DBEAFE', color: '#1D4ED8', fontSize: '0.68rem',
          fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 10,
        }}>
          India Tech · Live Data
        </div>
        <h1 style={{
          fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700,
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8,
        }}>
          Compensation Intelligence
          <span style={{ color: '#1D4ED8' }}> for India Tech</span>
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: 520, lineHeight: 1.6 }}>
          Level-standardized salary data — L3/L4/L5, SDE1/SDE2 — not just job titles.
          Compare, filter, and make informed career decisions.
        </p>
      </div>

      {result && (
        <div className="fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Entries', value: result.meta.total.toLocaleString(), blue: false },
            { label: 'Median Total TC', value: medianTC > 0 ? formatINR(medianTC) : '—', blue: true },
            { label: 'Page', value: `${result.meta.page} of ${result.meta.total_pages}`, blue: false },
            { label: 'Showing', value: `${result.data.length} results`, blue: false },
          ].map(({ label, value, blue }) => (
            <div key={label} style={{
              background: blue ? '#EFF6FF' : '#FFFFFF',
              border: `1px solid ${blue ? '#BFDBFE' : '#E2E8F0'}`,
              borderLeft: blue ? '3px solid #1D4ED8' : '1px solid #E2E8F0',
              borderRadius: 8, padding: '14px 18px',
            }}>
              <div style={{ fontSize: '0.65rem', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: '1.15rem', color: blue ? '#1D4ED8' : '#0F172A' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fade-up stagger-2" style={{ marginBottom: 14 }}>
        <Suspense fallback={null}><SalaryFilters /></Suspense>
      </div>

      <div className="fade-up stagger-3">
        {error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', border: '1px solid #FEE2E2', borderRadius: 8 }}>
            <p style={{ color: '#DC2626', fontSize: '0.85rem' }}>{error}</p>
            <p style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: 6 }}>Make sure backend is running at localhost:4000</p>
          </div>
        ) : (
          <>
            <SalaryTable salaries={result?.data ?? []} />
            <Suspense fallback={null}>
              <Pagination currentPage={result?.meta.page ?? 1} totalPages={result?.meta.total_pages ?? 1} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}