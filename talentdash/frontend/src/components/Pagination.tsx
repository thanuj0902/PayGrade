"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages);

  const btn = (active: boolean, disabled = false) => ({
    padding: '6px 12px', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
    border: `1px solid ${active ? '#1D4ED8' : '#E2E8F0'}`,
    background: active ? '#1D4ED8' : '#FFFFFF',
    color: active ? 'white' : disabled ? '#CBD5E1' : '#475569',
    fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.8rem', fontWeight: 500,
    opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
      <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} style={btn(false, currentPage === 1)}>← Prev</button>
      {pages.map((p, i) => (
        <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {pages[i - 1] && p - pages[i - 1] > 1 && <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>…</span>}
          <button onClick={() => goTo(p)} style={btn(p === currentPage)}>{p}</button>
        </span>
      ))}
      <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} style={btn(false, currentPage === totalPages)}>Next →</button>
    </div>
  );
}