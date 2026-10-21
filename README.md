# JSS University Companies Research & Placement Analytics Portal

(a.k.a. JSS University Placement Intelligence Hub) — COLLEGE_NAME used: **JSS University** (short tag **JSS**).

- **Phase 1 is UI-only.** All data comes from `src/data/seedCompanies.ts` (Accenture reference record) and `src/data/skillTopics.ts`. No database, no backend.
- **Fully public.** There is no login, auth, or protected route. Every page is reachable directly.
- Selected company is persisted in `localStorage["selected-company"]` and restored on reload.
- **Phase 2** will swap the seed for database rows. Normalizers in `src/lib/companyData.ts` already accept the raw `short_json`, `full_json` and `skill_levels` shapes, so only the data source changes.
- Optional env: `VITE_LOGO_DEV_PUBLISHABLE_KEY` (Logo.dev). Falls back to seed `logo_url`, then an initial letter.
- Routing uses TanStack Router (file routes): `/`, `/company` → `/company/intelligence`, `/company/skills`.
