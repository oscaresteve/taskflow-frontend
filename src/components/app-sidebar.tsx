"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import AppSidebarFooter from "@/components/app-sidebar-footer";
import AppSidebarHeader from "@/components/app-sidebar-header";

export function AppSidebar() {
  const { isMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <AppSidebarHeader isMobile={isMobile} />
      </SidebarHeader>
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
