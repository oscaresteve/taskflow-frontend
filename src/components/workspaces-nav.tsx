"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MoreVertical, Orbit, Plus, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getActiveWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateWorkspaceDialog } from "@/components/create-workspace-dialog";
import {
  SidebarGroup,
  SidebarMenuAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";

export function WorkspacesNav() {
  const { data: workspaces, isLoading, isError } = useQuery(getActiveWorkspacesQuery());
  const [createOpen, setCreateOpen] = useState(false);
  const activeWorkspaces = workspaces?.data ?? [];

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
          <CollapsibleTrigger
            render={<SidebarMenuButton className="group/orbit" />}
          >
            <span className="relative size-4 shrink-0">
              <Orbit className="absolute inset-0 size-4 opacity-100 transition-opacity group-hover/orbit:opacity-0" />
              <ChevronDown className="absolute inset-0 size-4 opacity-0 transition-all group-hover/orbit:opacity-100 group-data-open/collapsible:rotate-180" />
            </span>
            Workspaces
          </CollapsibleTrigger>

          <SidebarMenuAction onClick={() => setCreateOpen(true)} title="New workspace" className="right-7">
            <Plus />
            <span className="sr-only">New workspace</span>
          </SidebarMenuAction>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuAction title="More options">
                  <MoreVertical />
                  <span className="sr-only">More options</span>
                </SidebarMenuAction>
              }
            />
            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuItem render={<Link href="/workspaces" />} className="gap-2">
                  <Settings />
                  Manage workspaces
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <CollapsibleContent>
            <SidebarMenuSub>
              {isError ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    Failed to load workspaces
                  </div>
                </SidebarMenuSubItem>
              ) : isLoading || !workspaces ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <div className="flex h-7 items-center gap-2 rounded-md px-2">
                      <Skeleton className="size-4 rounded-md" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuSubItem>
                ))
              ) : activeWorkspaces.length === 0 ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">No workspaces yet</div>
                </SidebarMenuSubItem>
              ) : (
                activeWorkspaces.map((workspace) => (
                  <SidebarMenuSubItem key={workspace.id}>
                    <SidebarMenuSubButton render={<Link href={`/workspaces/${workspace.slug}`} />}>
                      <Avatar size="sm">
                        <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
                        <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
                      </Avatar>
                      {workspace.name}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </SidebarGroup>
  );
}
