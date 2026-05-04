// backend/src/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { normalizeCompany, normalizeLevel, computeTC } from "./utils/normalize";

const prisma = new PrismaClient();

const entries = [
  // Google
  { company: "Google", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 3, base_salary: 3200000, bonus: 600000, stock: 1200000, confidence_score: 0.95 },
  { company: "Google", role: "Software Engineer", level: "L5", location: "Bangalore", experience_years: 6, base_salary: 5000000, bonus: 1000000, stock: 2500000, confidence_score: 0.95 },
  { company: "Google", role: "Software Engineer", level: "L6", location: "Hyderabad", experience_years: 9, base_salary: 7500000, bonus: 1800000, stock: 4000000, confidence_score: 0.9 },
  { company: "Google", role: "Data Scientist", level: "L5", location: "Bangalore", experience_years: 5, base_salary: 4800000, bonus: 900000, stock: 2200000, confidence_score: 0.88 },
  // Meta
  { company: "Meta", role: "Software Engineer", level: "E4", location: "Bangalore", experience_years: 2, base_salary: 3000000, bonus: 500000, stock: 1500000, confidence_score: 0.92 },
  { company: "Meta", role: "Software Engineer", level: "E5", location: "Bangalore", experience_years: 5, base_salary: 4800000, bonus: 900000, stock: 2800000, confidence_score: 0.9 },
  // Microsoft
  { company: "Microsoft", role: "Software Engineer", level: "SDE2", location: "Hyderabad", experience_years: 4, base_salary: 2800000, bonus: 400000, stock: 900000, confidence_score: 0.93 },
  { company: "Microsoft", role: "Senior Software Engineer", level: "SDE3", location: "Hyderabad", experience_years: 7, base_salary: 4200000, bonus: 700000, stock: 1600000, confidence_score: 0.91 },
  { company: "Microsoft", role: "Software Engineer", level: "SDE1", location: "Bangalore", experience_years: 1, base_salary: 1800000, bonus: 200000, stock: 400000, confidence_score: 0.9 },
  // Amazon
  { company: "Amazon", role: "SDE II", level: "SDE2", location: "Bangalore", experience_years: 4, base_salary: 2600000, bonus: 0, stock: 1800000, confidence_score: 0.87 },
  { company: "Amazon", role: "SDE I", level: "SDE1", location: "Chennai", experience_years: 1, base_salary: 1600000, bonus: 0, stock: 800000, confidence_score: 0.86 },
  { company: "Amazon", role: "SDE III", level: "SDE3", location: "Bangalore", experience_years: 8, base_salary: 4000000, bonus: 0, stock: 3500000, confidence_score: 0.89 },
  // Flipkart
  { company: "Flipkart", role: "Software Engineer", level: "SDE2", location: "Bangalore", experience_years: 3, base_salary: 2200000, bonus: 300000, stock: 600000, confidence_score: 0.85 },
  { company: "Flipkart", role: "Senior Engineer", level: "Senior Engineer", location: "Bangalore", experience_years: 6, base_salary: 3400000, bonus: 500000, stock: 1200000, confidence_score: 0.84 },
  // Swiggy
  { company: "Swiggy", role: "Software Engineer", level: "SDE2", location: "Bangalore", experience_years: 3, base_salary: 2000000, bonus: 250000, stock: 500000, confidence_score: 0.8 },
  // Razorpay
  { company: "Razorpay", role: "Software Engineer", level: "SDE2", location: "Bangalore", experience_years: 3, base_salary: 2400000, bonus: 350000, stock: 700000, confidence_score: 0.82 },
  { company: "Razorpay", role: "Senior Engineer", level: "Senior Engineer", location: "Bangalore", experience_years: 6, base_salary: 3600000, bonus: 600000, stock: 1500000, confidence_score: 0.83 },
  // Atlassian
  { company: "Atlassian", role: "Software Engineer", level: "L4", location: "Bangalore", experience_years: 4, base_salary: 3800000, bonus: 700000, stock: 1800000, confidence_score: 0.91 },
  // Salesforce
  { company: "Salesforce", role: "Software Engineer", level: "L4", location: "Hyderabad", experience_years: 3, base_salary: 3000000, bonus: 500000, stock: 1000000, confidence_score: 0.88 },
  // Zomato
  { company: "Zomato", role: "Software Engineer", level: "SDE2", location: "Gurugram", experience_years: 3, base_salary: 1900000, bonus: 200000, stock: 400000, confidence_score: 0.78 },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.salary.deleteMany();
  console.log("   Cleared existing records");

  for (const entry of entries) {
    const company = normalizeCompany(entry.company);
    const level = normalizeLevel(entry.level) ?? entry.level.toLowerCase();
    const total = computeTC(entry.base_salary, entry.bonus, entry.stock);

    await prisma.salary.create({
      data: {
        company,
        role: entry.role,
        level,
        location: entry.location,
        experience_years: entry.experience_years,
        base_salary: entry.base_salary,
        bonus: entry.bonus,
        stock: entry.stock,
        total_compensation: total,
        confidence_score: entry.confidence_score,
      },
    });
  }

  console.log(`✅ Seeded ${entries.length} salary entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
