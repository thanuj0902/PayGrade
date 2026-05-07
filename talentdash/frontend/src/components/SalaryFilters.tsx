"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const LEVELS = ["L3","L4","L5","L6","L7","L8","SDE1","SDE2","SDE3","Junior Engineer","Engineer","Senior Engineer","Staff Engineer","Principal Engineer"];

export default function SalaryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const get = (key: string) => searchParams.get(key) ?? "";

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    params.set("page", "1");
    startTransition(() => router.push(`/?${params.toString()}`));
  }, [router, searchParams]);

  const hasFilters = get("company") || get("role") || get("level") || get("location");

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E2E8F0',
      borderRadius: 8, padding: '16px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{
          fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600,
          fontSize: '0.72rem', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#64748B',
        }}>Filter</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isPending && <span style={{ fontSize: '0.72rem', color: '#2563EB', fontFamily: 'IBM Plex Mono, monospace' }}>loading…</span>}
          {hasFilters && (
            <button onClick={() => startTransition(() => router.push("/"))} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.75rem', color: '#DC2626',
              fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 500,
            }}>Clear all</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { key: 'company', placeholder: 'e.g. Google', label: 'Company' },
          { key: 'role', placeholder: 'e.g. Software Engineer', label: 'Role' },
          { key: 'location', placeholder: 'e.g. Bangalore', label: 'Location' },
        ].map(({ key, placeholder, label }) => (
          <div key={key}>
            <label style={{
              display: 'block', fontSize: '0.7rem',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontWeight: 600, color: '#475569', marginBottom: 5,
            }}>{label}</label>
            <input type="text" placeholder={placeholder}
              value={get(key)} onChange={(e) => updateFilter(key, e.target.value)}
              className="field" />
          </div>
        ))}
        <div>
          <label style={{
            display: 'block', fontSize: '0.7rem',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontWeight: 600, color: '#475569', marginBottom: 5,
          }}>Level</label>
          <select value={get("level")} onChange={(e) => updateFilter("level", e.target.value)} className="field">
            <option value="">All levels</option>
            {LEVELS.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}