"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronDown, FolderKanban, MoreVertical, Plus, Settings } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getProjectsInfiniteQuery } from "@/lib/queries/project.queries";
import { isNavActive } from "@/lib/nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { SearchInput } from "@/components/common/search-input";
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
import { ColorDot } from "../ui/color-dot";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";

const NAV_PAGE_SIZE = 5;

export default function ProjectsNav() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getProjectsInfiniteQuery({ workspaceSlug, limit: NAV_PAGE_SIZE, search: debouncedSearch }),
  );
  const [createOpen, setCreateOpen] = useState(false);
  const projects = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - projects.length : 0;
  const { role: myRole } = useWorkspaceRole(workspaceSlug);

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

          {isWorkspaceManager(myRole) && (
            <SidebarMenuAction onClick={() => setCreateOpen(true)} title="New project" className="right-7">
              <Plus />
              <span className="sr-only">New project</span>
            </SidebarMenuAction>
          )}

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
              <SearchInput value={search} onChange={setSearch} placeholder="Search projects" size="sm" />
              {isError ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    Failed to load projects
                  </div>
                </SidebarMenuSubItem>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <div className="flex h-7 items-center gap-2 rounded-md px-2">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuSubItem>
                ))
              ) : projects.length === 0 ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    {debouncedSearch ? "No projects found" : "No projects yet"}
                  </div>
                </SidebarMenuSubItem>
              ) : (
                <>
                  {projects.map((project) => {
                    const href = `/workspaces/${workspaceSlug}/projects/${project.slug}`;
                    return (
                      <SidebarMenuSubItem key={project.id}>
                        <SidebarMenuSubButton isActive={isNavActive(pathname, href)} render={<Link href={href} />}>
                          <ColorDot color={project.color}></ColorDot>
                          {project.name}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                  {hasNextPage && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => !isFetchingNextPage && fetchNextPage()}
                        aria-disabled={isFetchingNextPage}
                        className="text-muted-foreground cursor-pointer"
                      >
                        {isFetchingNextPage ? "Loading…" : `${remaining} more`}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                </>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>

      <CreateProjectDialog workspaceSlug={workspaceSlug} open={createOpen} onOpenChange={setCreateOpen} />
    </SidebarGroup>
  );
}
