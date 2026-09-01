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
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <div className="flex items-center">
          <CollapsibleTrigger
            nativeButton={false}
            render={<SidebarGroupLabel className="group/orbit flex-1 gap-2 cursor-pointer" />}
          >
            <span className="relative size-4 shrink-0">
              <Orbit className="absolute inset-0 size-4 opacity-100 transition-opacity group-hover/orbit:opacity-0" />
              <ChevronDown className="absolute inset-0 size-4 opacity-0 transition-all group-hover/orbit:opacity-100 group-data-open/collapsible:rotate-180" />
            </span>
            Workspaces
          </CollapsibleTrigger>

          <div className="flex items-center gap-0.5">
            <SidebarGroupAction
              onClick={() => setCreateOpen(true)}
              title="New workspace"
              className="static top-auto right-auto"
            >
              <Plus />
              <span className="sr-only">New workspace</span>
            </SidebarGroupAction>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarGroupAction title="More options" className="static top-auto right-auto">
                    <MoreVertical />
                    <span className="sr-only">More options</span>
                  </SidebarGroupAction>
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
          </div>
        </div>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {isError ? (
                <SidebarMenuItem>
                  <div className="flex h-8 items-center px-2 text-muted-foreground text-sm">
                    Failed to load workspaces
                  </div>
                </SidebarMenuItem>
              ) : isLoading || !workspaces ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <div className="flex h-8 items-center gap-2 rounded-md px-2">
                      <Skeleton className="size-4 rounded-md" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                activeWorkspaces.map((workspace) => (
                  <SidebarMenuItem key={workspace.id}>
                    <SidebarMenuButton render={<Link href={`/workspaces/${workspace.slug}`} />}>
                      <Avatar size="sm">
                        <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
                        <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
                      </Avatar>
                      {workspace.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </Collapsible>
  );
}
