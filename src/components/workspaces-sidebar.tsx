"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import NavUser from "@/components/user-nav";
import WorkspaceSwitch from "@/components/workspace-switch";
import GlobalNav from "./global-nav";
import ProjectsNav from "./projects-nav";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { isNavActive } from "@/lib/nav";
import { Separator } from "./ui/separator";

export function WorkspacesSidebar() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const overviewHref = `/workspaces/${workspaceSlug}`;

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <WorkspaceSwitch />
      </SidebarHeader>
      <SidebarContent>
        <GlobalNav />
        <Separator />
        <SidebarGroup>
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
          </SidebarGroupContent>
        </SidebarGroup>
        <ProjectsNav />
        <SidebarGroup>
          <SidebarGroupContent>
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={`/workspaces/${workspaceSlug}/settings`} />}
                  isActive={isNavActive(pathname, `/workspaces/${workspaceSlug}/settings`)}
                >
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
