"use client";

import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";
import { useState } from "react";

export default function WorkspaceSwitch({
  isMobile,
  workspaces,
}: {
  isMobile: boolean;
  workspaces: WorkspaceResponseDto[];
}) {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0];

  return (
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
          {workspaces.map((workspace: WorkspaceResponseDto) => (
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
  );
}
