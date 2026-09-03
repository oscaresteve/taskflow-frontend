"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserNav from "@/components/layout/user-nav";
import { WorkspacesNav } from "@/components/layout/workspaces-nav";
import GlobalNav from "./global-nav";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import TaskflowLogo from "./taskflow-logo";

export function GlobalSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/home" />}>
              <TaskflowLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <GlobalNav />
        <Separator />
        <WorkspacesNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
