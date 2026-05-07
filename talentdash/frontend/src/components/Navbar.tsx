"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav style={{
      position: 'sticky', top: 3, zIndex: 50,
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6,
              background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 13,
              fontFamily: 'IBM Plex Sans, sans-serif',
              boxShadow: '0 2px 8px rgba(29,78,216,0.3)',
            }}>T</div>
            <div>
              <div style={{
                fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700,
                fontSize: '0.95rem', color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1,
              }}>TalentDash</div>
              <div style={{
                fontSize: '0.6rem', color: '#64748B', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: 'IBM Plex Mono, monospace',
                lineHeight: 1, marginTop: 2,
              }}>Compensation Intel</div>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: 2 }}>
            {[{ href: '/', label: 'Salaries' }, { href: '/compare', label: 'Compare' }].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                textDecoration: 'none', padding: '6px 16px', borderRadius: 6,
                fontSize: '0.82rem', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 500,
                color: pathname === href ? '#1D4ED8' : '#64748B',
                background: pathname === href ? '#DBEAFE' : 'transparent',
                borderBottom: pathname === href ? '2px solid #1D4ED8' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </nav>
  );
}