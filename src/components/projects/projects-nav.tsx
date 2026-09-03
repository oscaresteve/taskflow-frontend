"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronDown, FolderKanban, MoreVertical, Plus, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProjectsQuery } from "@/lib/queries/project.queries";
import { isNavActive } from "@/lib/nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
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
} from "@/components/ui/dropdown-menu";

export default function ProjectsNav() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: projects, isLoading, isError } = useQuery(getProjectsQuery(workspaceSlug));
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
          <CollapsibleTrigger render={<SidebarMenuButton className="group/folder" />}>
            <span className="relative size-4 shrink-0">
              <FolderKanban className="absolute inset-0 size-4 opacity-100 transition-opacity group-hover/folder:opacity-0" />
              <ChevronDown className="absolute inset-0 size-4 opacity-0 transition-all group-hover/folder:opacity-100 group-data-open/collapsible:rotate-180" />
            </span>
            Projects
          </CollapsibleTrigger>

          <SidebarMenuAction onClick={() => setCreateOpen(true)} title="New project" className="right-7">
            <Plus />
            <span className="sr-only">New project</span>
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
                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                <DropdownMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects`} />} className="gap-2">
                  <Settings />
                  Manage projects
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <CollapsibleContent>
            <SidebarMenuSub>
              {isError ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    Failed to load projects
                  </div>
                </SidebarMenuSubItem>
              ) : isLoading || !projects ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <div className="flex h-7 items-center gap-2 rounded-md px-2">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuSubItem>
                ))
              ) : projects.data.length === 0 ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">No projects yet</div>
                </SidebarMenuSubItem>
              ) : (
                projects.data.map((project) => {
                  const href = `/workspaces/${workspaceSlug}/projects/${project.slug}`;
                  return (
                    <SidebarMenuSubItem key={project.id}>
                      <SidebarMenuSubButton isActive={isNavActive(pathname, href)} render={<Link href={href} />}>
                        {project.name}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>

      <CreateProjectDialog workspaceSlug={workspaceSlug} open={createOpen} onOpenChange={setCreateOpen} />
    </SidebarGroup>
  );
}
