// frontend/src/lib/api.ts
import type {
  SalaryFilters,
  SalaryListResponse,
  CompanyResponse,
  CompareResponse,
} from "@/types/salary";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getSalaries(
  filters: SalaryFilters = {}
): Promise<SalaryListResponse> {
  const params = new URLSearchParams();
  if (filters.company) params.set("company", filters.company);
  if (filters.role) params.set("role", filters.role);
  if (filters.level) params.set("level", filters.level);
  if (filters.location) params.set("location", filters.location);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const qs = params.toString();
  return fetcher<SalaryListResponse>(`/salaries${qs ? `?${qs}` : ""}`);
}

export async function getCompany(name: string): Promise<CompanyResponse> {
  return fetcher<CompanyResponse>(`/company/${encodeURIComponent(name)}`);
}

export async function getCompanies(): Promise<{ data: string[] }> {
  return fetcher<{ data: string[] }>("/companies");
}

export async function getComparison(
  id1: string,
  id2: string
): Promise<CompareResponse> {
  return fetcher<CompareResponse>(
    `/compare?salaryId1=${id1}&salaryId2=${id2}`
  );
}
