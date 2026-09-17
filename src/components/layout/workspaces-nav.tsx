"use client";

import { useState } from "react";
import Link from "next/link";
import { ICONS } from "@/lib/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getWorkspacesInfiniteQuery } from "@/lib/queries/workspace.queries";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import {
  SidebarMenu,
  SidebarMenuAction,
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
import { SearchInput } from "../common/search-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

const NAV_PAGE_SIZE = 5;

export function WorkspacesNav() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getWorkspacesInfiniteQuery({ limit: NAV_PAGE_SIZE, search: debouncedSearch }),
  );
  const [createOpen, setCreateOpen] = useState(false);
  const activeWorkspaces = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - activeWorkspaces.length : 0;
  const t = useTranslations("layout");

  return (
    <>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
          <CollapsibleTrigger render={<SidebarMenuButton className="group/orbit" />}>
            <span className="relative size-4 shrink-0">
              <ICONS.workspace className="absolute inset-0 size-4 opacity-100 transition-opacity group-hover/orbit:opacity-0" />
              <ICONS.expand className="absolute inset-0 size-4 opacity-0 transition-all group-hover/orbit:opacity-100 group-data-open/collapsible:rotate-180" />
            </span>
            {t("workspacesNav.title")}
          </CollapsibleTrigger>

          <Tooltip>
            <TooltipTrigger
              render={
                <SidebarMenuAction
                  onClick={() => setCreateOpen(true)}
                  className="right-7"
                  aria-label={t("workspacesNav.newWorkspace")}
                />
              }
            >
              <ICONS.addNew />
            </TooltipTrigger>
            <TooltipContent>{t("workspacesNav.newWorkspace")}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger
                    render={<SidebarMenuAction aria-label={t("workspacesNav.moreOptions")} />}
                  />
                }
              >
                <ICONS.moreOptions />
              </TooltipTrigger>
              <TooltipContent>{t("workspacesNav.moreOptions")}</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t("workspacesNav.title")}</DropdownMenuLabel>
                <DropdownMenuItem render={<Link href="/workspaces" />} className="gap-2">
                  <ICONS.settings />
                  {t("workspacesNav.manageWorkspaces")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <CollapsibleContent>
            <SidebarMenuSub>
              <SearchInput value={search} onChange={setSearch} placeholder={t("workspacesNav.searchPlaceholder")} size="sm" />
              {isError ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    {t("workspacesNav.failedToLoad")}
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
              ) : activeWorkspaces.length === 0 ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    {debouncedSearch ? t("workspacesNav.noneFound") : t("workspacesNav.noneYet")}
                  </div>
                </SidebarMenuSubItem>
              ) : (
                <>
                  {activeWorkspaces.map((workspace) => (
                    <SidebarMenuSubItem key={workspace.id}>
                      <SidebarMenuSubButton render={<Link href={`/workspaces/${workspace.slug}`} />}>
                        <Avatar size="sm">
                          <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
                          <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
                        </Avatar>
                        {workspace.name}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  {hasNextPage && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => !isFetchingNextPage && fetchNextPage()}
                        aria-disabled={isFetchingNextPage}
                        className="text-muted-foreground cursor-pointer"
                      >
                        {isFetchingNextPage ? t("workspacesNav.loading") : t("workspacesNav.remaining", { count: remaining })}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                </>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
