import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { SEED_COMPANIES, type SeedCompany } from "@/data/seedCompanies";

export const STORAGE_KEY = "selected-company";
export interface SelectedCompany { companyId: number; companyName: string; logoUrl: string }

interface Ctx {
  selected: SelectedCompany | null;
  company: SeedCompany | null;
  ready: boolean;
  selectCompany: (c: SelectedCompany) => void;
  clear: () => void;
}

const CompanyContext = createContext<Ctx | null>(null);

export function readStoredCompany(): SelectedCompany | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SelectedCompany;
    return SEED_COMPANIES.some((c) => c.company_id === parsed.companyId) ? parsed : null;
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompany | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSelected(readStoredCompany());
    setReady(true);
  }, []);

  const selectCompany = useCallback((c: SelectedCompany) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    setSelected(c);
  }, []);
  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSelected(null);
  }, []);

  const company = selected ? SEED_COMPANIES.find((c) => c.company_id === selected.companyId) ?? null : null;

  return (
    <CompanyContext.Provider value={{ selected, company, ready, selectCompany, clear }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
