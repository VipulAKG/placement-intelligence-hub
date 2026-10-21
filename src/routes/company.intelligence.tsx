import { createFileRoute } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Linkedin, Globe, PlayCircle, Star } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { normalizeCompanyProfile, isNullish, splitItems, type CompanyProfile } from "@/lib/companyData";
import { buildIntelligenceSections, type IntelSection } from "@/data/intelligenceData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: "Company Intelligence · JSS Placement Intelligence Hub" },
      { name: "description", content: "22-section research profile of a recruiting company for JSS University placements." },
      { property: "og:title", content: "Company Intelligence · JSS Placement Intelligence Hub" },
      { property: "og:description", content: "Deep company research for campus placement preparation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CompanyIntelligence,
});

const NA = () => <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">Not Available</span>;
const isUrl = (v: string) => /^https?:\/\//i.test(v);

function renderValue(key: string, v?: string) {
  if (!v || isNullish(v)) return <NA />;
  if (isUrl(v)) {
    const video = /youtube|vimeo|video/i.test(key + v);
    return (
      <a href={v} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 break-all text-primary hover:underline">
        {video ? <PlayCircle className="h-4 w-4 shrink-0" /> : <ExternalLink className="h-4 w-4 shrink-0" />}{v.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    );
  }
  const rating = v.match(/^(\d(?:\.\d)?)\s*\/\s*5$/);
  if (rating) {
    const n = parseFloat(rating[1] ?? "0");
    return (
      <span className="inline-flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(n) ? "fill-regular text-regular" : "text-border"}`} />)}
        <span className="ml-1 font-medium">{v}</span>
      </span>
    );
  }
  if (v.length > 140 && !v.includes(";")) return <p className="leading-relaxed">{v}</p>;
  if (v.includes(";") || (v.includes(",") && v.length < 120 && v.split(",").every((p) => p.trim().length < 40))) {
    const items = v.includes(";") ? splitItems(v) : v.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length > 1) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {items.map((it, i) => <span key={i} className="rounded-md border bg-secondary/60 px-2 py-0.5 text-xs">{it}</span>)}
        </div>
      );
    }
  }
  return <span>{v}</span>;
}

const FieldRow = ({ label, k, value }: { label: string; k: string; value?: string | undefined }) => (
  <div className="flex flex-col gap-1 border-b py-3 last:border-0 sm:flex-row sm:gap-4">
    <dt className="text-sm text-muted-foreground sm:w-1/3">{label}</dt>
    <dd className="text-sm sm:w-2/3">{renderValue(k, value)}</dd>
  </div>
);

const SectionCard = memo(function SectionCard({ s, idx }: { s: IntelSection; idx: number }) {
  const count = s.fields.filter((f) => f.value && !isNullish(f.value)).length;
  return (
    <section id={`sec-${idx}`} data-idx={idx} className="scroll-mt-32 rounded-xl border bg-card p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground"><s.icon className="h-4 w-4" /></span>
        <h2 className="font-heading text-lg font-semibold">{s.title}</h2>
        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{count}/{s.fields.length}</span>
      </div>
      <dl>{s.fields.map((f) => <FieldRow key={f.key} k={f.key} label={f.label} value={f.value} />)}</dl>
    </section>
  );
});

function CompanyIntelligence() {
  const { company } = useCompany();
  const profile: CompanyProfile | null = useMemo(
    () => (company ? normalizeCompanyProfile(company.full_json, company.short_json, company.company_id) : null),
    [company],
  );
  const sections = useMemo(() => buildIntelligenceSections(profile ?? undefined), [profile]);
  const [active, setActive] = useState(0);
  const isScrollingRef = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(Number((vis.target as HTMLElement).dataset["idx"]));
      },
      { rootMargin: "-130px 0px -60% 0px" },
    );
    document.querySelectorAll("section[data-idx]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  useEffect(() => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    const bar = tabsRef.current;
    if (tab && bar) bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const scrollToSection = useCallback((idx: number) => {
    isScrollingRef.current = true;
    setActive(idx);
    document.getElementById(`sec-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, []);

  if (!profile) return null;
  const linkedin = profile.fields["linkedin_url"];

  return (
    <div>
      <div className="sticky top-0 z-20 border-b bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <CompanyLogo name={profile.shortName} logoUrl={profile.logoUrl} websiteUrl={profile.websiteUrl} className="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-base font-semibold sm:text-lg">{profile.name}</h1>
            <span className="inline-flex rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{profile.category || "Industry"}</span>
          </div>
          <div className="flex gap-2">
            {profile.websiteUrl && <Button asChild variant="outline" size="sm"><a href={profile.websiteUrl} target="_blank" rel="noreferrer"><Globe className="h-4 w-4" /><span className="hidden sm:inline">Website</span></a></Button>}
            {linkedin && !isNullish(linkedin) && <Button asChild variant="outline" size="sm"><a href={linkedin} target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4" /><span className="hidden sm:inline">LinkedIn</span></a></Button>}
          </div>
        </div>
        <div ref={tabsRef} className="no-scrollbar flex gap-1 overflow-x-auto border-t px-2 py-2">
          {sections.map((s, i) => (
            <button key={s.id} data-tab={i} onClick={() => scrollToSection(i)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active === i ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
              {s.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        {sections.map((s, i) => <SectionCard key={s.id} s={s} idx={i} />)}
      </div>
    </div>
  );
}
