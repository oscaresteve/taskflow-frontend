import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import NavUser from "@/components/user-nav";
import WorkspaceSwitch from "@/components/workspace-switch";
import GlobalNav from "./global-nav";
import ProjectsNav from "./projects-nav";

export function WorkspacesSidebar() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <WorkspaceSwitch />
      </SidebarHeader>
      <SidebarContent>
        <GlobalNav />
        <ProjectsNav />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
