import type { CompanyType } from "./companyData";

export const CATEGORIES: CompanyType[] = ["Super Dream", "Dream", "Standard", "Regular"];

export const categoryClass: Record<CompanyType, { soft: string; solid: string }> = {
  "Super Dream": { soft: "bg-super-dream/10 text-super-dream", solid: "bg-super-dream text-white border-super-dream" },
  Dream: { soft: "bg-dream/10 text-dream", solid: "bg-dream text-white border-dream" },
  Standard: { soft: "bg-standard/10 text-standard", solid: "bg-standard text-white border-standard" },
  Regular: { soft: "bg-regular/10 text-regular", solid: "bg-regular text-white border-regular" },
};

export const COLLEGE_NAME = "JSS University";
export const COLLEGE_SHORT = "JSS";
