// frontend/src/types/salary.ts

export interface Salary {
  id: string;
  company: string;
  role: string;
  level: string;
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  confidence_score: number;
  created_at: string;
}

export interface SalaryListResponse {
  data: Salary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface CompanyResponse {
  data: {
    company: string;
    total_entries: number;
    median_tc: number;
    level_distribution: Record<string, number>;
    level_stats: Record<
      string,
      { count: number; avg_tc: number; median_tc: number }
    >;
    salaries: Salary[];
  };
}

export interface CompareResponse {
  data: {
    salary_a: Salary;
    salary_b: Salary;
    comparison: {
      base_diff: number;
      bonus_diff: number;
      stock_diff: number;
      total_diff: number;
      level_comparison: string;
    };
  };
}

export interface SalaryFilters {
  company?: string;
  role?: string;
  level?: string;
  location?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
