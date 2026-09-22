"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ICONS } from "@/lib/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getProjectsInfiniteQuery } from "@/lib/queries/project.queries";
import { useToggleProjectFavorite } from "@/hooks/use-toggle-project-favorite";
import { useProjectRole } from "@/hooks/use-project-role";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";
import { isNavActive } from "@/lib/nav";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectActionsMenu } from "@/components/projects/project-actions-menu";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";
import {
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
import { ActionsMenuContent, ActionsMenuItem, ActionsMenuLabel } from "@/components/common/actions-menu";
import { EmptyInline } from "@/components/common/empty-inline";
import { ColorDot } from "../ui/color-dot";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_PAGE_SIZE = 5;

function ProjectNavItem({
  project,
  workspaceSlug,
  isActive,
}: {
  project: ProjectResponseDto;
  workspaceSlug: string;
  isActive: boolean;
}) {
  const { role } = useProjectRole(workspaceSlug, project.slug);
  const canManage = isProjectManager(role);
  const href = `/workspaces/${workspaceSlug}/projects/${project.slug}`;

  return (
    <SidebarMenuSubItem>
      <Tooltip>
        <TooltipTrigger
          render={
            <SidebarMenuSubButton
              isActive={isActive}
              render={<Link href={href} />}
              className="has-[[data-project-actions]:hover]:bg-transparent"
            />
          }
        >
          <ColorDot color={project.color}></ColorDot>
          <span className="truncate">{project.name}</span>
          <span
            data-project-actions
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            className="ml-auto shrink-0"
          >
            <ProjectActionsMenu
              workspaceSlug={workspaceSlug}
              project={project}
              canManage={canManage}
              triggerRender={<Button variant="ghost" size="icon-xs" className="text-muted-foreground" />}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="inline-end">{project.name}</TooltipContent>
      </Tooltip>
    </SidebarMenuSubItem>
  );
}

function ProjectFavoriteMenuItem({ workspaceSlug, project }: { workspaceSlug: string; project: ProjectResponseDto }) {
  const router = useRouter();
  const toggleFavorite = useToggleProjectFavorite(workspaceSlug, project.slug);

  return (
    <Tooltip>
      <TooltipTrigger
        render={<DropdownMenuItem onClick={() => router.push(`/workspaces/${workspaceSlug}/projects/${project.slug}`)} />}
      >
        <ColorDot color={project.color}></ColorDot>
        <span className="truncate">{project.name}</span>
        <span onClick={(event) => event.stopPropagation()} className="ml-auto shrink-0">
          <FavoriteToggle isFavorite={project.isFavorite} onToggle={() => toggleFavorite.mutate(!project.isFavorite)} />
        </span>
      </TooltipTrigger>

      <TooltipContent side="inline-end">{project.name}</TooltipContent>
    </Tooltip>
  );
}

function ProjectsFavoritesNav({ workspaceSlug }: { workspaceSlug: string }) {
  const t = useTranslations("layout");
  const { data } = useInfiniteQuery(
    getProjectsInfiniteQuery({ workspaceSlug, limit: NAV_PAGE_SIZE, isFavorite: true }),
  );
  const favorites = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton />}>
            <ICONS.favorite className="size-4 shrink-0" />
            {t("projectsNav.favorites")}
            <ICONS.chevronRight className="ml-auto size-4 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="min-w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("projectsNav.favorites")}</DropdownMenuLabel>
              {favorites.length === 0 ? (
                <EmptyInline icon={ICONS.favorite} label={t("projectsNav.noFavorites")} className="h-9 px-2" />
              ) : (
                favorites.map((project) => (
                  <ProjectFavoriteMenuItem key={project.id} workspaceSlug={workspaceSlug} project={project} />
                ))
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

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
  const t = useTranslations("layout");

  return (
    <>
      <ProjectsFavoritesNav workspaceSlug={workspaceSlug} />

      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
          <CollapsibleTrigger render={<SidebarMenuButton className="group/folder" />}>
            <span className="relative size-4 shrink-0">
              <ICONS.project className="absolute inset-0 size-4 opacity-100 transition-opacity group-hover/folder:opacity-0" />
              <ICONS.expand className="absolute inset-0 size-4 opacity-0 transition-all group-hover/folder:opacity-100 group-data-open/collapsible:rotate-180" />
            </span>
            {t("projectsNav.title")}
          </CollapsibleTrigger>

          {isWorkspaceManager(myRole) && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <SidebarMenuAction
                    onClick={() => setCreateOpen(true)}
                    className="right-7"
                    aria-label={t("projectsNav.newProject")}
                  />
                }
              >
                <ICONS.addNew />
              </TooltipTrigger>
              <TooltipContent>{t("projectsNav.newProject")}</TooltipContent>
            </Tooltip>
          )}

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger render={<SidebarMenuAction aria-label={t("projectsNav.moreOptions")} />} />
                }
              >
                <ICONS.moreOptions />
              </TooltipTrigger>
              <TooltipContent>{t("projectsNav.moreOptions")}</TooltipContent>
            </Tooltip>
            <ActionsMenuContent align="start">
              <DropdownMenuGroup>
                <ActionsMenuLabel>{t("projectsNav.title")}</ActionsMenuLabel>
                <ActionsMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects`} />}>
                  <ICONS.settings />
                  {t("projectsNav.manageProjects")}
                </ActionsMenuItem>
              </DropdownMenuGroup>
            </ActionsMenuContent>
          </DropdownMenu>

          <CollapsibleContent>
            <SidebarMenuSub>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t("projectsNav.searchPlaceholder")}
                size="sm"
              />
              {isError ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    {t("projectsNav.failedToLoad")}
                  </div>
                </SidebarMenuSubItem>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <div className="flex h-7 items-center gap-2 rounded-md px-2">
                      <Skeleton className="size-4 rounded-md" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuSubItem>
                ))
              ) : projects.length === 0 ? (
                <SidebarMenuSubItem>
                  <EmptyInline
                    icon={ICONS.project}
                    label={debouncedSearch ? t("projectsNav.noneFound") : t("projectsNav.noneYet")}
                    className="h-7 px-2"
                  />
                </SidebarMenuSubItem>
              ) : (
                <>
                  {projects.map((project) => {
                    const href = `/workspaces/${workspaceSlug}/projects/${project.slug}`;
                    return (
                      <ProjectNavItem
                        key={project.id}
                        project={project}
                        workspaceSlug={workspaceSlug}
                        isActive={isNavActive(pathname, href)}
                      />
                    );
                  })}
                  {hasNextPage && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => !isFetchingNextPage && fetchNextPage()}
                        aria-disabled={isFetchingNextPage}
                        className="text-muted-foreground cursor-pointer"
                      >
                        {isFetchingNextPage
                          ? t("projectsNav.loading")
                          : t("projectsNav.remaining", { count: remaining })}
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
    </>
  );
}
