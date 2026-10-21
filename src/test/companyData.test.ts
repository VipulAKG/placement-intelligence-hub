import { describe, expect, it } from "vitest";
import { proficiencyToBloom, scoreToCriticality, scoreToDifficulty, normalizeDashboardSkills, normalizeCompanyProfile } from "@/lib/companyData";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { buildIntelligenceSections } from "@/data/intelligenceData";

describe("company data", () => {
  it("maps proficiency to Bloom", () => {
    expect([1, 3, 5, 7, 9, 10].map(proficiencyToBloom)).toEqual(["CU", "AP", "AS", "EV", "CR", "CR"]);
  });
  it("maps scores to criticality and difficulty", () => {
    expect([7, 5, 4].map(scoreToCriticality)).toEqual(["Critical", "Important", "Baseline"]);
    expect([8, 6, 4, 3].map(scoreToDifficulty)).toEqual(["EXPERT", "ADVANCED", "PRO", "BEGINNER"]);
  });
  it("seed renders 12 skills with 10 levels and 22 sections", () => {
    const c = SEED_COMPANIES[0];
    const skills = normalizeDashboardSkills(c.skill_levels);
    expect(skills).toHaveLength(12);
    expect(skills.every((s) => s.topics.length === 10)).toBe(true);
    expect(buildIntelligenceSections(normalizeCompanyProfile(c.full_json, c.short_json))).toHaveLength(22);
  });
});
