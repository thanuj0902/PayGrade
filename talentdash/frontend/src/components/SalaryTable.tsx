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
        justifyContent: 'center', padding: '80px 20px', textAlign: 'center',
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12,
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>◈</div>
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
          No results found
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 6 }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden',
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
                <tr key={s.id} style={{
                  background: isSelected ? 'rgba(124,106,247,0.06)' : 'transparent',
                }}>
                  {onSelectForCompare && (
                    <td style={{ paddingLeft: 16 }}>
                      <button
                        onClick={() => onSelectForCompare(s)}
                        style={{
                          width: 18, height: 18, borderRadius: 4,
                          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border2)'}`,
                          background: isSelected ? 'var(--accent)' : 'transparent',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s', padding: 0,
                        }}
                      >
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
                      color: 'var(--text)', textDecoration: 'none',
                      fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.82rem',
                    }}>
                      {titleCase(s.company)}
                    </Link>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{s.role}</td>
                  <td><LevelBadge level={s.level} /></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{s.location}</td>
                  <td style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '0.75rem' }}>
                    {s.experience_years}y
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '0.78rem' }}>
                    {formatINR(s.base_salary)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '0.78rem' }}>
                    {s.bonus > 0 ? formatINR(s.bonus) : <span style={{ color: 'var(--border2)' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '0.78rem' }}>
                    {s.stock > 0 ? formatINR(s.stock) : <span style={{ color: 'var(--border2)' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'DM Mono, monospace', fontWeight: 500,
                      fontSize: '0.85rem', color: 'var(--accent2)',
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