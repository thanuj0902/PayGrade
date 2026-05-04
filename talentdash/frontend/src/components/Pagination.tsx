// frontend/src/components/Pagination.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-2 text-ink-400 text-sm">…</span>
            )}
            <button
              onClick={() => goTo(p)}
              className={clsx(
                "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                p === currentPage
                  ? "border-ink-900 bg-ink-900 text-ink-50"
                  : "border-ink-200 text-ink-600 hover:bg-ink-100"
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  );
}
