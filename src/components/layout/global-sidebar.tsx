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
import UserNav from "@/components/layout/user-nav";
import { AppNav } from "./app-nav";
import GlobalNav from "./global-nav";
import { WorkspacesNav } from "./workspaces-nav";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import TaskflowLogo from "./taskflow-logo";

export function GlobalSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/home" />}>
              <TaskflowLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
        {/* No SidebarGroupLabel: WorkspacesNav's own collapsible trigger already reads "Workspaces". */}
        <SidebarGroup>
          <SidebarGroupContent>
            <WorkspacesNav />
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
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
