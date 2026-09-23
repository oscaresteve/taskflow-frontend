"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getWorkspaceQuery, getWorkspacesInfiniteQuery } from "@/lib/queries/workspace.queries";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { SearchInput } from "@/components/common/search-input";
import { ICONS } from "@/lib/icons";
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
import { EmptyInline } from "@/components/common/empty-inline";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SWITCHER_PAGE_SIZE = 5;

export default function WorkspaceSwitch() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: activeWorkspace, isLoading } = useQuery(getWorkspaceQuery(workspaceSlug));
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getWorkspacesInfiniteQuery({ limit: SWITCHER_PAGE_SIZE, search: debouncedSearch }),
  );
  const [createOpen, setCreateOpen] = useState(false);
  const workspaces = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - workspaces.length : 0;
  const t = useTranslations("layout");

  if (isLoading || !activeWorkspace) {
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
            <CustomAvatar avatarUrl={activeWorkspace.avatarUrl} alt={activeWorkspace.name} seed={activeWorkspace.id} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeWorkspace.name}</span>
              <span className="truncate text-muted-foreground text-xs">{activeWorkspace.slug}</span>
            </div>
            <ICONS.chevronUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56" align="start" side={isMobile ? "bottom" : "right"} sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("workspaceSwitch.workspaces")}
              </DropdownMenuLabel>
              {/* Stops keydown from bubbling to the menu's typeahead handler, which would otherwise
                  hijack keystrokes (and move item focus) instead of letting them reach the input. */}
              <div onKeyDown={(e) => e.stopPropagation()} className="p-2">
                <SearchInput value={search} onChange={setSearch} placeholder={t("workspaceSwitch.searchPlaceholder")} />
              </div>
              {workspaces.length === 0 && (
                <EmptyInline
                  icon={ICONS.workspace}
                  label={debouncedSearch ? t("workspaceSwitch.noneFound") : t("workspaceSwitch.noneYet")}
                  className="h-9 px-2"
                />
              )}
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => router.push(`/workspaces/${workspace.slug}`)}
                  className="gap-2 p-2"
                >
                  <CustomAvatar size="sm" avatarUrl={workspace.avatarUrl} alt={workspace.name} seed={workspace.id} />
                  {workspace.name}
                </DropdownMenuItem>
              ))}
              {hasNextPage && (
                <DropdownMenuItem
                  closeOnClick={false}
                  onClick={() => !isFetchingNextPage && fetchNextPage()}
                  aria-disabled={isFetchingNextPage}
                  className="gap-2 p-2 text-muted-foreground"
                >
                  {isFetchingNextPage
                    ? t("workspaceSwitch.loading")
                    : t("workspaceSwitch.remaining", { count: remaining })}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCreateOpen(true)} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <ICONS.addNew className="size-4" />
              </div>
              {t("workspaceSwitch.createWorkspace")}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/workspaces" />} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <ICONS.settings className="size-4" />
              </div>
              {t("workspaceSwitch.manageWorkspaces")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </SidebarMenu>
  );
}
