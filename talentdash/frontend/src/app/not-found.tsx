// frontend/src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-6xl font-mono font-bold text-ink-200 mb-4">404</p>
      <h1 className="font-display text-2xl text-ink-800 mb-2">
        Page not found
      </h1>
      <p className="text-ink-500 text-sm mb-6">
        This page doesn't exist or the company has no data yet.
      </p>
      <Link
        href="/"
        className="px-5 py-2 bg-ink-900 text-ink-50 text-sm font-medium rounded-lg hover:bg-ink-700 transition-colors"
      >
        Back to salaries
      </Link>
    </div>
  );
}
