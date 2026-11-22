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
} from "@/components/ui/sidebar";
import UserNav from "@/components/layout/user-nav";
import { AppNav } from "./app-nav";
import GlobalNav from "./global-nav";
import { WorkspacesNav } from "./workspaces-nav";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import TaskflowLogo from "./taskflow-logo";
import { useTranslations } from "next-intl";

export function GlobalSidebar() {
  const t = useTranslations("layout");

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/my-space" />} tooltip={t("globalNav.mySpace")}>
              <TaskflowLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <GlobalNav />
            <WorkspacesNav />
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
