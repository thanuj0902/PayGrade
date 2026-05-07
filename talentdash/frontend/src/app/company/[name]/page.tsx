import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompany } from "@/lib/api";
import SalaryTable from "@/components/SalaryTable";
import LevelBadge from "@/components/LevelBadge";
import { formatINR, titleCase } from "@/lib/format";

export default async function CompanyPage({ params }: { params: { name: string } }) {
  const companyName = decodeURIComponent(params.name);
  let result;
  try { result = await getCompany(companyName); }
  catch { notFound(); }

  const { company, total_entries, median_tc, level_stats, salaries } = result.data;
  const sortedLevels = Object.entries(level_stats as Record<string, { count: number; avg_tc: number; median_tc: number }>)
    .sort(([, a], [, b]) => b.median_tc - a.median_tc);
  const maxTC = sortedLevels[0]?.[1]?.median_tc ?? 1;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      <Link href="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: '#1D4ED8', textDecoration: 'none', fontSize: '0.82rem',
        fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 500, marginBottom: 28,
      }}>← Back to Salaries</Link>

      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700,
          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
          color: '#0F172A', letterSpacing: '-0.02em',
        }}>{titleCase(company)}</h1>
        <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: 4 }}>
          {total_entries} salary data point{total_entries !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Median Total TC', value: formatINR(median_tc), blue: true },
          { label: 'Distinct Levels', value: String(Object.keys(level_stats).length), blue: false },
          { label: 'Total Entries', value: String(total_entries), blue: false },
        ].map(({ label, value, blue }) => (
          <div key={label} style={{
            background: blue ? '#EFF6FF' : '#FFFFFF',
            border: `1px solid ${blue ? '#BFDBFE' : '#E2E8F0'}`,
            borderLeft: blue ? '3px solid #1D4ED8' : '1px solid #E2E8F0',
            borderRadius: 8, padding: '18px 22px',
          }}>
            <div style={{ fontSize: '0.65rem', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', marginBottom: 6 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: '1.4rem', color: blue ? '#1D4ED8' : '#0F172A' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {sortedLevels.length > 0 && (
        <div className="fade-up stagger-2" style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', marginBottom: 12 }}>
            Compensation by Level
          </h2>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {sortedLevels.map(([level, stats], i) => {
              const pct = maxTC > 0 ? (stats.median_tc / maxTC) * 100 : 0;
              return (
                <div key={level} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                  borderBottom: i < sortedLevels.length - 1 ? '1px solid #F1F5F9' : 'none',
                  background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                }}>
                  <div style={{ width: 90, flexShrink: 0 }}><LevelBadge level={level} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                        {stats.count} entr{stats.count !== 1 ? 'ies' : 'y'}
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: '0.88rem', color: '#1D4ED8' }}>
                        {formatINR(stats.median_tc)}{' '}
                        <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: '0.72rem' }}>median</span>
                      </span>
                    </div>
                    <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #1D4ED8, #3B82F6)', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="fade-up stagger-3">
        <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', marginBottom: 12 }}>
          All Entries
        </h2>
        <SalaryTable salaries={salaries} />
      </div>
    </div>
  );
}