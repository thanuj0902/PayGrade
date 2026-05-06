// frontend/src/components/Navbar.tsx
"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
 
export default function Navbar() {
  const pathname = usePathname();
 
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white',
              fontFamily: 'Syne, sans-serif',
            }}>T</div>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.02em',
            }}>
              Talent<span style={{ color: 'var(--accent)' }}>Dash</span>
            </span>
            <span style={{
              fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em',
              textTransform: 'uppercase', fontFamily: 'DM Mono, monospace',
              marginTop: 1,
            }}>beta</span>
          </Link>
 
          {/* Nav */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { href: '/', label: 'Salaries' },
              { href: '/compare', label: 'Compare' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: '0.78rem',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: pathname === href ? 'white' : 'var(--muted)',
                background: pathname === href ? 'var(--bg3)' : 'transparent',
                border: `1px solid ${pathname === href ? 'var(--border2)' : 'transparent'}`,
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
