import { memo } from "react";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { isNullish, type CompanySummary } from "@/lib/companyData";
import { categoryClass } from "@/lib/categories";

const Val = ({ v }: { v: string }) =>
  isNullish(v) ? <span className="italic text-muted-foreground">not publicly available</span> : <span>{v}</span>;

export const CompanyCard = memo(function CompanyCard({ c, onSelect }: { c: CompanySummary; onSelect: (c: CompanySummary) => void }) {
  const down = c.yoyGrowthRate.trim().startsWith("-");
  return (
    <button
      type="button"
      onClick={() => onSelect(c)}
      className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <CompanyLogo name={c.shortName} logoUrl={c.logoUrl} websiteUrl={c.websiteUrl} />
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryClass[c.companyType].soft}`}>{c.companyType}</span>
      </div>
      <div>
        <h3 className="font-heading text-base font-semibold leading-tight">{c.name}</h3>
        <p className="text-sm text-muted-foreground">{c.shortName}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /><Val v={c.headquarters} /></li>
        <li className="flex items-center gap-2"><Users className="h-4 w-4" /><Val v={c.employeeSize} /></li>
        <li className={`flex items-center gap-2 ${down ? "text-destructive" : "text-standard"}`}>
          {down ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          <Val v={c.yoyGrowthRate ? `${c.yoyGrowthRate} YoY` : ""} />
        </li>
      </ul>
      <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
});
