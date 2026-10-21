// Pure normalizers. Inputs are raw JSON shapes (short_json / full_json / skill_levels)
// so Phase 2 can pipe database rows in unchanged.
import { SKILL_TOPICS } from "@/data/skillTopics";

export type CompanyType = "Super Dream" | "Dream" | "Standard" | "Regular";
export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";
export type Bloom = "CU" | "AP" | "AS" | "EV" | "CR";
export type Criticality = "Critical" | "Important" | "Baseline";

export interface CompanySummary {
  companyId: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: CompanyType;
  incorporationYear: string;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string;
  officeLocations: string;
  yoyGrowthRate: string;
  websiteUrl: string;
}

export type CompanyProfile = CompanySummary & { fields: Record<string, string> };

export interface DashboardSkill {
  id: number;
  name: string;
  level: number;
  proficiency: string;
  difficulty: Difficulty;
  bloom: Bloom;
  criticality: Criticality;
  topics: { level_number: number; topic: string }[];
}

export const asString = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(asString).join("; ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v).trim();
};

export const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

export const splitItems = (v: string): string[] =>
  v
    .split(/\n|;|•|\u2022|\.(?=\s+[A-Z])/)
    .map((s) => s.replace(/^[-*\s]+/, "").trim())
    .filter(Boolean);

export const titleCaseFromCode = (code: string): string =>
  code
    .split("_")
    .map((w) => (w.length <= 3 && /^(tam|sam|som|ceo|esg|cac|ltv|ai|ml)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

export const scoreToDifficulty = (s: number): Difficulty =>
  s >= 8 ? "EXPERT" : s >= 6 ? "ADVANCED" : s >= 4 ? "PRO" : "BEGINNER";

export const proficiencyToBloom = (s: number): Bloom =>
  s <= 2 ? "CU" : s <= 4 ? "AP" : s <= 6 ? "AS" : s <= 8 ? "EV" : "CR";

export const scoreToCriticality = (s: number): Criticality =>
  s >= 7 ? "Critical" : s >= 5 ? "Important" : "Baseline";

const NULLISH = new Set(["na", "n/a", "none", "-", "null", "undefined", ""]);
export const isNullish = (v: unknown) => NULLISH.has(asString(v).toLowerCase());

// Fields that must never be shown anywhere in the portal.
const BLOCKED = /ctc|stipend|selection_ratio/i;

const toType = (v: string): CompanyType => {
  const t = v.toLowerCase().replace(/[\s_-]/g, "");
  if (t === "superdream") return "Super Dream";
  if (t === "dream") return "Dream";
  if (t === "standard") return "Standard";
  return "Regular";
};

export function normalizeCompanySummary(short_json: unknown, companyId = 0): CompanySummary {
  const r = asRecord(short_json);
  return {
    companyId,
    name: asString(r.name),
    shortName: asString(r.short_name) || asString(r.name),
    logoUrl: asString(r.logo_url),
    category: asString(r.category),
    companyType: toType(asString(r.company_type)),
    incorporationYear: asString(r.incorporation_year),
    employeeSize: asString(r.employee_size),
    headquarters: asString(r.headquarters_address),
    operatingCountries: asString(r.operating_countries),
    officeLocations: asString(r.office_locations),
    yoyGrowthRate: asString(r.yoy_growth_rate),
    websiteUrl: asString(r.website_url),
  };
}

export function normalizeCompanyProfile(full_json: unknown, short_json: unknown, companyId = 0): CompanyProfile {
  const full = asRecord(full_json);
  const summary = normalizeCompanySummary({ ...asRecord(short_json), ...full, logo_url: asRecord(short_json).logo_url ?? full.logo_url, company_type: asRecord(short_json).company_type ?? full.company_type }, companyId);
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries({ ...asRecord(short_json), ...full })) {
    if (!BLOCKED.test(k)) fields[k] = asString(v);
  }
  return { ...summary, fields };
}

export function normalizeDashboardSkills(skillLevels: unknown[]): DashboardSkill[] {
  return (skillLevels ?? [])
    .map((raw) => {
      const r = asRecord(raw);
      const id = Number(r.skill_set_id);
      const level = Number(r.required_level) || 0;
      const topics = (SKILL_TOPICS[id] ?? []).map((topic, i) => ({ level_number: i + 1, topic }));
      return {
        id,
        name: asString(r.skill_set_name),
        level,
        proficiency: asString(r.required_proficiency),
        difficulty: scoreToDifficulty(level),
        bloom: proficiencyToBloom(level),
        criticality: scoreToCriticality(level),
        topics,
      };
    })
    .sort((a, b) => b.level - a.level);
}
