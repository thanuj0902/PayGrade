// frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Salaries" },
  { href: "/compare", label: "Compare" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-ink-50/90 backdrop-blur-sm border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl text-ink-900 tracking-tight">
              Talent
              <span className="text-gold-500">Dash</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-ink-400 mt-1">
              Compensation Intel
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-ink-900 text-ink-50"
                    : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
