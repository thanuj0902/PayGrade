// frontend/src/components/LevelBadge.tsx
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
    ? [...result.data].sort((a, b) => a.total_compensation - b.total_compensation)
      [Math.floor(result.data.length / 2)]?.total_compensation ?? 0
    : 0;
 
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
 
      {/* Hero */}
      <div className="fade-up" style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)',
          borderRadius: 20, padding: '4px 12px', marginBottom: 20,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
          <span style={{ fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', color: 'var(--accent2)', letterSpacing: '0.08em' }}>
            LIVE DATA · INDIA TECH
          </span>
        </div>
 
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          lineHeight: 1.1, letterSpacing: '-0.03em',
          color: 'var(--text)', marginBottom: 12,
        }}>
          Know Your <span style={{
            background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Worth</span>
        </h1>
 
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: 480, lineHeight: 1.6, fontFamily: 'DM Mono, monospace' }}>
          Level-standardized compensation data for India's tech industry.
          Filter by L3/L4/L5, SDE1/SDE2 — not just job titles.
        </p>
      </div>
 
      {/* Stats */}
      {result && (
        <div className="fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Entries', value: result.meta.total.toLocaleString(), accent: false },
            { label: 'Median TC', value: medianTC > 0 ? formatINR(medianTC) : '—', accent: true },
            { label: 'Current Page', value: `${result.meta.page} / ${result.meta.total_pages}`, accent: false },
            { label: 'Showing', value: `${result.data.length} entries`, accent: false },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{
              background: 'var(--bg2)', border: `1px solid ${accent ? 'rgba(124,106,247,0.3)' : 'var(--border)'}`,
              borderRadius: 10, padding: '16px 18px',
              background: accent ? 'linear-gradient(135deg, rgba(124,106,247,0.08), rgba(167,139,250,0.05))' : 'var(--bg2)',
            }}>
              <div style={{ fontSize: '0.62rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: '1.2rem', color: accent ? 'var(--accent2)' : 'var(--text)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      )}
 
      {/* Filters */}
      <div className="fade-up stagger-2" style={{ marginBottom: 16 }}>
        <Suspense fallback={null}>
          <SalaryFilters />
        </Suspense>
      </div>
 
      {/* Table */}
      <div className="fade-up stagger-3">
        {error ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12,
          }}>
            <p style={{ color: 'var(--red)', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>{error}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 8, fontFamily: 'DM Mono, monospace' }}>
              Make sure backend is running at localhost:4000
            </p>
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