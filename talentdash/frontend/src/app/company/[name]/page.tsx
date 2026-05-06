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
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>

      <Link href="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: 'var(--muted)', textDecoration: 'none', fontSize: '0.78rem',
        fontFamily: 'DM Mono, monospace', marginBottom: 32,
      }}>
        ← back to salaries
      </Link>

      <div className="fade-up" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            letterSpacing: '-0.03em', color: 'var(--text)',
          }}>
            {titleCase(company)}
          </h1>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.75rem',
            color: 'var(--muted)', marginBottom: 6,
          }}>
            {total_entries} data point{total_entries !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Median Total TC', value: formatINR(median_tc), accent: true },
          { label: 'Distinct Levels', value: String(Object.keys(level_stats).length), accent: false },
          { label: 'Total Entries', value: String(total_entries), accent: false },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{
            background: accent
              ? 'linear-gradient(135deg, rgba(124,106,247,0.1), rgba(167,139,250,0.06))'
              : 'var(--bg2)',
            border: `1px solid ${accent ? 'rgba(124,106,247,0.3)' : 'var(--border)'}`,
            borderRadius: 12, padding: '20px 24px',
          }}>
            <div style={{
              fontSize: '0.62rem', fontFamily: 'Syne, sans-serif', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase' as const,
              color: 'var(--muted)', marginBottom: 8,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontWeight: 500,
              fontSize: '1.6rem',
              color: accent ? 'var(--accent2)' : 'var(--text)',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {sortedLevels.length > 0 && (
        <div className="fade-up stagger-2" style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '1rem', letterSpacing: '-0.01em',
            color: 'var(--text)', marginBottom: 14,
          }}>
            Compensation by Level
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sortedLevels.map(([level, stats]) => {
              const pct = maxTC > 0 ? (stats.median_tc / maxTC) * 100 : 0;
              return (
                <div key={level} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '12px 16px',
                }}>
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <LevelBadge level={level} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{
                        fontSize: '0.7rem', color: 'var(--muted)',
                        fontFamily: 'DM Mono, monospace',
                      }}>
                        {stats.count} entr{stats.count !== 1 ? 'ies' : 'y'}
                      </span>
                      <span style={{
                        fontFamily: 'DM Mono, monospace', fontWeight: 500,
                        fontSize: '0.85rem', color: 'var(--accent2)',
                      }}>
                        {formatINR(stats.median_tc)}{' '}
                        <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.7rem' }}>
                          median
                        </span>
                      </span>
                    </div>
                    <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                        borderRadius: 2,
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="fade-up stagger-3">
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '1rem', color: 'var(--text)', marginBottom: 14,
        }}>
          All Entries
        </h2>
        <SalaryTable salaries={salaries} />
      </div>
    </div>
  );
}