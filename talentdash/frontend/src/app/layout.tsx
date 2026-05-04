// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TalentDash — Compensation Intelligence",
  description:
    "India's most structured tech salary data. Level-based, comparable, decision-ready.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-50 font-body relative z-[1]">
        <Navbar />
        <main className="relative z-[1]">{children}</main>
      </body>
    </html>
  );
}
