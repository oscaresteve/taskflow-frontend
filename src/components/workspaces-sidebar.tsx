import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import NavUser from "@/components/user-nav";
import WorkspaceSwitch from "@/components/workspace-switch";

export function WorkspacesSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <WorkspaceSwitch />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
