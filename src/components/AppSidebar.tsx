import { Link, useRouterState } from "@tanstack/react-router";
import { Building2, Brain, LayoutGrid } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { COLLEGE_SHORT } from "@/lib/categories";

const items = [
  { title: "Company Intelligence", url: "/company/intelligence", icon: Building2 },
  { title: "Skill Intelligence", url: "/company/skills", icon: Brain },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-10 items-center gap-2 px-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary font-heading text-xs font-bold text-primary-foreground">{COLLEGE_SHORT}</span>
          {!collapsed && <span className="font-heading text-sm font-semibold">Placement Hub</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.url}>
                  <SidebarMenuButton asChild isActive={path === it.url} tooltip={it.title}>
                    <Link to={it.url}><it.icon className="h-4 w-4" /><span>{it.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="All Companies">
              <Link to="/"><LayoutGrid className="h-4 w-4" /><span>All Companies</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
