import { useState } from "react";
import { workspacesQuery } from "@/lib/queries/workspaces.queries";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";
import type { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

export default function AppSidebarHeader({ isMobile }: { isMobile: boolean }) {
  const { data: workspaces, isLoading } = useQuery(workspacesQuery);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  if (isLoading || !workspaces) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled className="cursor-default">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const activeWorkspace =
    workspaces.data.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces.data[0];

  if (!activeWorkspace) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={activeWorkspace.logoUrl ?? undefined} alt={activeWorkspace.name} />
              <AvatarFallback className="rounded-lg">{getInitials(activeWorkspace.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeWorkspace.name}</span>
              <span className="truncate text-xs">{activeWorkspace.slug}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
              {workspaces.data.map((workspace: WorkspaceResponseDto) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setActiveWorkspaceId(workspace.id)}
                  className="gap-2 p-2"
                >
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
                    <AvatarFallback className="rounded-md text-xs">{getInitials(workspace.name)}</AvatarFallback>
                  </Avatar>
                  {workspace.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
