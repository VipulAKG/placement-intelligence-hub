import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: AppLayout,
});

function AppLayout() {
  const { selected, ready } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !selected) navigate({ to: "/", replace: true });
  }, [ready, selected, navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-12 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <nav className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Companies</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="truncate font-medium text-foreground">{selected?.companyName ?? "…"}</span>
            </nav>
          </header>
          <main className="min-w-0 flex-1">
            {ready && selected ? <Outlet /> : <div className="p-6 text-sm text-muted-foreground">Loading company…</div>}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
