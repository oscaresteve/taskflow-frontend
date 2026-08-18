"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function WorkspacesNav() {
  const { data: workspaces, isLoading, isError } = useQuery(getWorkspacesQuery());

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger nativeButton={false} render={<SidebarGroupLabel className="cursor-pointer" />}>
          Workspaces
          <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
        </CollapsibleTrigger>
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
                workspaces.data.map((workspace) => (
                  <SidebarMenuItem key={workspace.id}>
                    <SidebarMenuButton render={<Link href={`/workspaces/${workspace.slug}`} />}>
                      <Avatar size="sm">
                        <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
                        <AvatarFallback>
                          {getInitials(workspace.name)}
                        </AvatarFallback>
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
    </Collapsible>
  );
}
