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
import { LayoutDashboard, LucideIcon, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { isNavActive } from "@/lib/nav";

type NavigationItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

const workspaceNavigation: NavigationItem[] = [
  {
    name: "New project",
    icon: Plus,
    href: "new-project",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "settings",
  },
];

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
        <SidebarSeparator />
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
              {workspaceNavigation.map((nav) => {
                const Icon = nav.icon;
                const href = `/workspaces/${workspaceSlug}/${nav.href}`;
                const isActive = isNavActive(pathname, href);
                return (
                  <SidebarMenuItem key={nav.href}>
                    <SidebarMenuButton render={<Link href={href} />} isActive={isActive}>
                      <Icon />
                      {nav.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
