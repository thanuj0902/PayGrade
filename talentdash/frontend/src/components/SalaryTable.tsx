"use client";
import Link from "next/link";
import type { Salary } from "@/types/salary";
import LevelBadge from "./LevelBadge";
import { formatINR, titleCase } from "@/lib/format";

interface Props {
  salaries: Salary[];
  onSelectForCompare?: (salary: Salary) => void;
  selectedIds?: string[];
}

export default function SalaryTable({ salaries, onSelectForCompare, selectedIds = [] }: Props) {
  if (salaries.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8,
      }}>
        <div style={{ fontSize: 32, marginBottom: 12, color: '#94A3B8' }}>○</div>
        <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#334155' }}>
          No results found
        </p>
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: 4 }}>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E2E8F0',
      borderRadius: 8, overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="salary-table">
          <thead>
            <tr>
              {onSelectForCompare && <th style={{ width: 48 }} />}
              <th>Company</th>
              <th>Role</th>
              <th>Level</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Exp</th>
              <th style={{ textAlign: 'right' }}>Base</th>
              <th style={{ textAlign: 'right' }}>Bonus</th>
              <th style={{ textAlign: 'right' }}>Stock</th>
              <th style={{ textAlign: 'right' }}>Total TC</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => {
              const isSelected = selectedIds.includes(s.id);
              return (
                <tr key={s.id} style={{ background: isSelected ? '#EFF6FF' : undefined }}>
                  {onSelectForCompare && (
                    <td style={{ paddingLeft: 16 }}>
                      <button onClick={() => onSelectForCompare(s)} style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `2px solid ${isSelected ? '#1D4ED8' : '#CBD5E1'}`,
                        background: isSelected ? '#1D4ED8' : 'transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', transition: 'all 0.15s', padding: 0,
                      }}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </td>
                  )}
                  <td>
                    <Link href={`/company/${encodeURIComponent(s.company)}`} style={{
                      color: '#1D4ED8', textDecoration: 'none',
                      fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                    }}>
                      {titleCase(s.company)}
                    </Link>
                  </td>
                  <td style={{ color: '#334155', fontSize: '0.82rem' }}>{s.role}</td>
                  <td><LevelBadge level={s.level} /></td>
                  <td style={{ color: '#64748B', fontSize: '0.82rem' }}>{s.location}</td>
                  <td style={{ textAlign: 'right', color: '#94A3B8', fontSize: '0.78rem', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {s.experience_years}y
                  </td>
                  <td style={{ textAlign: 'right', color: '#475569', fontSize: '0.82rem', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {formatINR(s.base_salary)}
                  </td>
                  <td style={{ textAlign: 'right', color: '#64748B', fontSize: '0.82rem', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {s.bonus > 0 ? formatINR(s.bonus) : <span style={{ color: '#CBD5E1' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'right', color: '#64748B', fontSize: '0.82rem', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {s.stock > 0 ? formatINR(s.stock) : <span style={{ color: '#CBD5E1' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600,
                      fontSize: '0.88rem', color: '#1D4ED8',
                    }}>
                      {formatINR(s.total_compensation)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}