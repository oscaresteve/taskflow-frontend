import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import UserNav from "@/components/user-nav";
import { WorkspacesNav } from "@/components/workspaces-nav";
import GlobalNav from "./global-nav";

export function GlobalSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarContent>
        <GlobalNav />
        <WorkspacesNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
