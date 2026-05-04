# TalentDash — Compensation Intelligence System

A production-grade, level-based compensation intelligence platform inspired by levels.fyi — built for India's tech industry.

## Architecture

```
talentdash/
├── prisma/           # Shared Prisma schema
│   └── schema.prisma
├── backend/          # Express + TypeScript API
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── lib/prisma.ts
│       ├── routes/
│       │   ├── salary.routes.ts    # POST /ingest-salary, GET /salaries
│       │   ├── company.routes.ts   # GET /company/:name, GET /companies
│       │   └── compare.routes.ts   # GET /compare
│       ├── middleware/errorHandler.ts
│       ├── utils/normalize.ts
│       └── seed.ts
└── frontend/         # Next.js 14 + Tailwind
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx             # Salary table + filters
        │   ├── company/[name]/      # Company page
        │   └── compare/             # Compare page
        ├── components/
        │   ├── Navbar.tsx
        │   ├── SalaryFilters.tsx
        │   ├── SalaryTable.tsx
        │   ├── LevelBadge.tsx
        │   └── Pagination.tsx
        ├── lib/
        │   ├── api.ts
        │   └── format.ts
        └── types/salary.ts
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local or hosted)
- pnpm / npm / yarn

---

## 1. Database setup

```bash
# Create a Postgres database
createdb talentdash

# Or with psql:
psql -c "CREATE DATABASE talentdash;"
```

---

## 2. Backend setup

```bash
cd backend

# Install dependencies
npm install

# Copy env and fill in your DATABASE_URL
cp .env.example .env

# Move the prisma schema to backend root (prisma looks for it here)
# OR set the schema path in package.json
cp ../prisma/schema.prisma ./prisma/schema.prisma

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# Start dev server
npm run dev
# API now running at http://localhost:4000
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `PORT` | `4000` | API port |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | `development` | Environment |

---

## 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Copy env
cp .env.example .env.local

# Start dev server
npm run dev
# Frontend now at http://localhost:3000
```

---

## 4. API Reference

### POST /api/ingest-salary

Ingest a new salary data point.

**Body:**
```json
{
  "company": "Google",
  "role": "Software Engineer",
  "level": "L5",
  "location": "Bangalore",
  "experience_years": 6,
  "base_salary": 5000000,
  "bonus": 1000000,
  "stock": 2500000,
  "confidence_score": 0.95
}
```

**Responses:**
- `201` — Created
- `409` — Duplicate entry detected
- `422` — Validation error

---

### GET /api/salaries

**Query params:** `company`, `role`, `level`, `location`, `sort`, `order`, `page`, `limit`

```
GET /api/salaries?level=l5&location=bangalore&sort=total_compensation&order=desc
```

---

### GET /api/company/:company

Returns all salaries + median TC + level breakdown for a company.

```
GET /api/company/google
```

---

### GET /api/companies

Returns list of all distinct companies.

---

### GET /api/compare

Compare two salary entries side-by-side.

```
GET /api/compare?salaryId1=abc123&salaryId2=def456
```

---

## 5. Standardized Levels

| Band | Values |
|---|---|
| Google-style | L3, L4, L5, L6, L7, L8 |
| Amazon/SDE | SDE1, SDE2, SDE3 |
| Title-based | Junior Engineer, Engineer, Senior Engineer, Staff Engineer, Principal Engineer |
| Data/ML | Analyst, Data Scientist, ML Engineer, + Senior variants |
| PM | APM, PM, Senior PM, Group PM, Director of PM |

---

## 6. Key design decisions

**Company normalization:** All company names are stored lowercase + trimmed. "Google", "GOOGLE", "google " all become `google`.

**Deduplication:** The ingest endpoint rejects entries where company + role + level + experience + base salary (±1%) all match an existing record.

**Total compensation:** Always recomputed server-side as `base + bonus + stock`. Never trusted from client input.

**Level validation:** Levels must match the canonical list in `utils/normalize.ts`. Invalid levels are rejected at ingest time.

---

## 7. Production deployment

**Backend** → Deploy to Railway, Render, or Fly.io. Set `DATABASE_URL` to your hosted Postgres.

**Frontend** → Deploy to Vercel. Set `NEXT_PUBLIC_API_URL` to your backend URL.

**Database** → Neon, Supabase, or Railway Postgres work well.
