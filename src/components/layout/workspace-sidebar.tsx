"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavUser from "@/components/layout/user-nav";
import WorkspaceSwitch from "@/components/layout/workspace-switch";
import { AppNav } from "./app-nav";
import GlobalNav from "./global-nav";
import ProjectsNav from "@/components/layout/projects-nav";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { isNavActive } from "@/lib/nav";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { Separator } from "../ui/separator";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const overviewHref = `/workspaces/${workspaceSlug}`;
  const { role: myRole } = useWorkspaceRole(workspaceSlug);

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitch />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Global</SidebarGroupLabel>
          <SidebarGroupContent>
            <GlobalNav />
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {/* Exact match, not isNavActive: every workspace subpage's pathname starts
                    with overviewHref, so a prefix match would keep this active everywhere. */}
                <SidebarMenuButton render={<Link href={overviewHref} />} isActive={pathname === overviewHref}>
                  <LayoutDashboard />
                  Overview
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            {/* Own SidebarGroup (a div), so it sits between the two <ul>s instead of nesting inside one. */}
            <ProjectsNav />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={`/workspaces/${workspaceSlug}/members`} />}
                  isActive={isNavActive(pathname, `/workspaces/${workspaceSlug}/members`)}
                >
                  <Users />
                  Members
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isWorkspaceManager(myRole) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href={`/workspaces/${workspaceSlug}/settings`} />}
                    isActive={isNavActive(pathname, `/workspaces/${workspaceSlug}/settings`)}
                  >
                    <Settings />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <AppNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
