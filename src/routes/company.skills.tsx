import { createFileRoute } from "@tanstack/react-router";
import { memo, useMemo, useState } from "react";
import { ChevronDown, Lock, CheckCircle2, Target } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { normalizeDashboardSkills, type Bloom, type Criticality, type DashboardSkill } from "@/lib/companyData";
import { CompanyLogo } from "@/components/CompanyLogo";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: "Skill Intelligence · JSS Placement Intelligence Hub" },
      { name: "description", content: "Skills a recruiter expects, with Bloom levels and a 10-level learning roadmap." },
      { property: "og:title", content: "Skill Intelligence · JSS Placement Intelligence Hub" },
      { property: "og:description", content: "Know exactly which skills to build and how deep to go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SkillIntelligence,
});

const BLOOM: Record<Bloom, { label: string; badge: string; bar: string; tint: string }> = {
  CU: { label: "Comprehend & Understand", badge: "bg-bloom-cu text-primary-foreground", bar: "bg-bloom-cu", tint: "bg-bloom-cu/10 text-bloom-cu" },
  AP: { label: "Apply", badge: "bg-bloom-ap text-primary-foreground", bar: "bg-bloom-ap", tint: "bg-bloom-ap/10 text-bloom-ap" },
  AS: { label: "Analyse & Synthesise", badge: "bg-bloom-as text-primary-foreground", bar: "bg-bloom-as", tint: "bg-bloom-as/10 text-bloom-as" },
  EV: { label: "Evaluate", badge: "bg-bloom-ev text-primary-foreground", bar: "bg-bloom-ev", tint: "bg-bloom-ev/10 text-bloom-ev" },
  CR: { label: "Create", badge: "bg-bloom-cr text-primary-foreground", bar: "bg-bloom-cr", tint: "bg-bloom-cr/10 text-bloom-cr" },
};
const CRIT: Record<Criticality, { desc: string; cls: string }> = {
  Critical: { desc: "Score 7+ · must master", cls: "text-expert" },
  Important: { desc: "Score 5–6 · strong working knowledge", cls: "text-advanced" },
  Baseline: { desc: "Score below 5 · fundamentals suffice", cls: "text-beginner" },
};

const SkillCard = memo(function SkillCard({ s }: { s: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const b = BLOOM[s.bloom];
  return (
    <div className="rounded-xl border bg-card">
      <button onClick={() => setOpen((o) => !o)} className="w-full p-4 text-left" aria-expanded={open}>
        <div className="flex items-center gap-2">
          <h3 className="flex-1 font-heading text-base font-semibold">{s.name}</h3>
          <span className={`rounded px-2 py-0.5 text-xs font-bold ${b.badge}`}>{s.bloom}</span>
          <span className="text-sm font-semibold">{s.level}/10</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className={`h-full rounded-full ${b.bar}`} style={{ width: `${s.level * 10}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={`font-medium ${CRIT[s.criticality].cls}`}>{s.criticality} · {s.proficiency}</span>
          <span className="flex items-center gap-1 text-muted-foreground">Roadmap <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} /></span>
        </div>
      </button>
      {open && (
        <ol className="border-t px-4 py-3">
          {s.topics.map((t) => {
            const locked = t.level_number > s.level;
            const target = t.level_number === s.level;
            return (
              <li key={t.level_number} className={`flex items-start gap-3 py-1.5 text-sm ${locked ? "text-muted-foreground/60" : ""}`}>
                <span className="w-6 shrink-0 text-xs font-semibold tabular-nums">L{t.level_number}</span>
                {locked ? <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : target ? <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> : <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-standard" />}
                <span className="flex-1">{t.topic}</span>
                {locked && <span className="shrink-0 text-xs italic">Beyond scope</span>}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
});

function SkillIntelligence() {
  const { company, selected } = useCompany();
  const skills = useMemo(() => normalizeDashboardSkills(company?.skill_levels ?? []), [company]);
  if (!company || !selected) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4">
      <header className="flex items-center gap-3 border-b pb-4">
        <CompanyLogo name={selected.companyName} logoUrl={selected.logoUrl} websiteUrl={company.short_json.website_url} />
        <div>
          <h1 className="font-heading text-xl font-semibold sm:text-2xl">{selected.companyName} Skill Intelligence</h1>
          <p className="text-sm text-muted-foreground">{skills.length} skills · tap a skill to open its 10-level roadmap</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(Object.keys(BLOOM) as Bloom[]).map((k) => (
          <div key={k} className={`rounded-lg p-2.5 ${BLOOM[k].tint}`}>
            <div className="text-sm font-bold">{k}</div>
            <div className="text-xs">{BLOOM[k].label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {(Object.keys(CRIT) as Criticality[]).map((k) => (
          <div key={k} className="rounded-lg border bg-card p-3">
            <div className={`font-heading text-sm font-semibold ${CRIT[k].cls}`}>{k}</div>
            <div className="text-xs text-muted-foreground">{CRIT[k].desc}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {skills.map((s) => <SkillCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}
