"use client";

import { workspacesQuery } from "@/lib/queries/workspaces.queries";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import WorkspaceSwitch from "@/components/workspace-switch";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export default function AppSidebarHeader({ isMobile }: { isMobile: boolean }) {
  const { data: workspaces, isLoading } = useQuery(workspacesQuery);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isLoading || !workspaces ? (
          <SidebarMenuButton size="lg" disabled className="cursor-default">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        ) : (
          <WorkspaceSwitch isMobile={isMobile} workspaces={workspaces.data} />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
