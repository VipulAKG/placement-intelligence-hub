<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Phase 1 data lives only in src/data seed files; pages read it through the normalizers in src/lib/companyData.ts so a future database swap touches one layer.
- Selected company is restored from localStorage via CompanyContext; /company/* redirect to / when none is stored instead of showing NotFound.
