import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanySummary, type CompanySummary, type CompanyType } from "@/lib/companyData";
import { CATEGORIES, categoryClass, COLLEGE_NAME, COLLEGE_SHORT } from "@/lib/categories";
import { CompanyCard } from "@/components/CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/context/CompanyContext";

const TITLE = `${COLLEGE_NAME} Companies Research & Placement Analytics Portal`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: "Research recruiting companies and the skills they expect — your strategic edge for campus placements." },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Your strategic edge for campus placements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<"All" | CompanyType>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 250); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 200); return () => clearTimeout(t); }, [query]);

  const companies = useMemo(() => SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id)), []);
  const searched = useMemo(
    () => companies.filter((c) => !debounced || `${c.name} ${c.shortName} ${c.headquarters}`.toLowerCase().includes(debounced)),
    [companies, debounced],
  );
  const counts = useMemo(() => {
    const m: Record<string, number> = { All: searched.length };
    for (const k of CATEGORIES) m[k] = searched.filter((c) => c.companyType === k).length;
    return m;
  }, [searched]);
  const visible = filter === "All" ? searched : searched.filter((c) => c.companyType === filter);

  const onSelect = useCallback((c: CompanySummary) => {
    selectCompany({ companyId: c.companyId, companyName: c.shortName, logoUrl: c.logoUrl });
    navigate({ to: "/company/intelligence" });
  }, [selectCompany, navigate]);

  const reset = () => { setQuery(""); setFilter("All"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <span className="inline-flex rounded-full border bg-secondary px-3 py-1 text-[11px] font-semibold tracking-widest text-muted-foreground">
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{TITLE}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Your strategic edge for campus placements</p>
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies by name or location"
              aria-label="Search companies"
              className="h-11 w-full rounded-lg border bg-card pl-9 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
          {(["All", ...CATEGORIES] as const).map((k) => {
            const active = filter === k;
            const cls = k === "All" ? (active ? "bg-foreground text-background border-foreground" : "") : active ? categoryClass[k].solid : categoryClass[k].soft + " border-transparent";
            return (
              <button key={k} onClick={() => setFilter(k)} className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${cls}`}>
                {k}<span className="rounded-full bg-background/30 px-1.5 text-xs">{counts[k]}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="font-heading text-lg font-semibold">No companies match</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another search or category.</p>
            <Button className="mt-4" variant="outline" onClick={reset}>Reset filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((c) => <CompanyCard key={c.companyId} c={c} onSelect={onSelect} />)}
          </div>
        )}
      </main>
    </div>
  );
}
