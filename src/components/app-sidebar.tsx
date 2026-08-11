"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import AppSidebarFooter from "./app-sidebar-footer";

export function AppSidebar() {
  const { isMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter isMobile={isMobile} />
      </SidebarFooter>
    </Sidebar>
  );
}
