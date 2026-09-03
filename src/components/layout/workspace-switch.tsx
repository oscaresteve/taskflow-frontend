"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getActiveWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { ChevronsUpDown, Plus, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export default function WorkspaceSwitch() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspaces, isLoading } = useQuery(getActiveWorkspacesQuery());
  const [createOpen, setCreateOpen] = useState(false);
  const activeWorkspaces = workspaces?.data ?? [];

  if (isLoading || activeWorkspaces.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled className="cursor-default">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // The layout already guarantees workspaceSlug is valid (404s otherwise), so this lookup can't miss.
  const activeWorkspace = activeWorkspaces.find((workspace) => workspace.slug === workspaceSlug) ?? activeWorkspaces[0];

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
            <Avatar>
              <AvatarImage src={activeWorkspace.logoUrl ?? undefined} alt={activeWorkspace.name} />
              <AvatarFallback>{getInitials(activeWorkspace.name)}</AvatarFallback>
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
              {activeWorkspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => router.push(`/workspaces/${workspace.slug}`)}
                  className="gap-2 p-2"
                >
                  <Avatar size="sm">
                    <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
                    <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
                  </Avatar>
                  {workspace.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCreateOpen(true)} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              Create workspace
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/workspaces" />} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Settings className="size-4" />
              </div>
              Manage workspaces
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </SidebarMenu>
  );
}
