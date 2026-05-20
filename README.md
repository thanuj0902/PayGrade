# PayGrade — Compensation Intelligence for India's Tech Industry

A level-based compensation intelligence platform inspired by levels.fyi, purpose-built for India's tech industry. Collect, compare, and analyze salary data across companies, roles, and experience levels.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Express, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

## Features

- **Salary Ingestion** — Submit anonymized salary data with company, role, level, location, and compensation breakdown
- **Salary Explorer** — Browse salaries with filters by company, role, level, and location
- **Company Profiles** — View salary distribution, median TC, and level breakdown per company
- **Side-by-Side Comparison** — Compare two salary entries across all compensation components
- **Standardized Levels** — Maps Google-style, Amazon/SDE, title-based, and PM level bands to a canonical system
- **Duplicate Detection** — Smart deduplication prevents identical entries at ingest time
- **Server-side Total Compensation** — TC always computed as base + bonus + stock server-side

## Project Structure

```
talentdash/
├── backend/          # Express + TypeScript API
│   ├── prisma/       # Database schema & migrations
│   └── src/          # Routes, middleware, utils, seed
├── frontend/         # Next.js 14 + Tailwind
│   └── src/          # Pages, components, lib, types
└── README.md         # Detailed setup & API reference
```

## Quick Start

```bash
cd talentdash

# Backend
cd backend
npm install
cp .env.example .env   # Set DATABASE_URL
npm run db:generate && npm run db:migrate && npm run db:seed
npm run dev            # API at http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local   # Set NEXT_PUBLIC_API_URL
npm run dev                   # App at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ingest-salary` | Submit salary data point |
| GET | `/api/salaries` | List salaries (filterable) |
| GET | `/api/company/:name` | Company salary profile |
| GET | `/api/companies` | List all companies |
| GET | `/api/compare` | Compare two salary entries |

## Deployment

- **Backend** → Railway, Render, or Fly.io
- **Frontend** → Vercel (set `NEXT_PUBLIC_API_URL`)
- **Database** → Neon, Supabase, or Railway Postgres

---

> Detailed setup instructions, API reference, and architecture decisions are in [`talentdash/README.md`](talentdash/README.md).
