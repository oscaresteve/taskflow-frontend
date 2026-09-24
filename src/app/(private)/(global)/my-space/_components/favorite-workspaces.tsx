"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EmptyState } from "@/components/common/empty-state";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import { WorkspaceActionsMenu } from "@/components/workspaces/workspace-actions-menu";
import { useFavoriteWorkspaces } from "@/hooks/use-favorite-workspaces";
import { useToggleWorkspaceFavorite } from "@/hooks/use-toggle-workspace-favorite";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { ICONS } from "@/lib/icons";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";

const PAGE_SIZE = 4;

function FavoriteWorkspaceCard({ workspace }: { workspace: WorkspaceResponseDto }) {
  const toggleFavorite = useToggleWorkspaceFavorite(workspace.slug);
  const { role: myRole } = useWorkspaceRole(workspace.slug);

  return (
    <Link href={`/workspaces/${workspace.slug}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex min-w-0 items-center gap-4">
            <CustomAvatar size="lg" avatarUrl={workspace.avatarUrl} alt={workspace.name} seed={workspace.id} />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate">{workspace.name}</span>
              <span className="line-clamp-2 text-muted-foreground text-xs">{workspace.description}</span>
            </div>
          </CardTitle>

          <CardAction
            className="flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FavoriteToggle
              isFavorite={workspace.isFavorite}
              onToggle={() => toggleFavorite.mutate(!workspace.isFavorite)}
              disabled={toggleFavorite.isPending}
            />
            <WorkspaceActionsMenu workspace={workspace} canManage={isWorkspaceManager(myRole)} />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}

export function FavoriteWorkspaces() {
  const t = useTranslations("mySpace");
  const { search, page, searchParam, onSearchChange, onPageChange } = useFavoriteWorkspaces();

  const {
    data: workspaces,
    isLoading,
    isError,
  } = useQuery({
    ...getWorkspacesQuery({
      page,
      limit: PAGE_SIZE,
      search: searchParam,
      isFavorite: true,
      sort: "name",
      order: "asc",
    }),
    placeholderData: keepPreviousData,
  });

  const totalPages = workspaces?.pagination.pages ?? 1;

  const emptyState = searchParam ? (
    <EmptyState
      icon={ICONS.favorite}
      title={t("mySpacePage.favorites.noFavoritesFound")}
      description={t("mySpacePage.favorites.noFavoritesFoundDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.favorite}
      title={t("mySpacePage.favorites.noFavoritesYet")}
      description={t("mySpacePage.favorites.noFavoritesYetDescription")}
    />
  );

  return (
    <div className="flex flex-col gap-3 col-span-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-base leading-snug font-medium">{t("mySpacePage.favorites.title")}</h2>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t("mySpacePage.favorites.searchPlaceholder")}
          className="w-48"
        />
      </div>

      {isError ? (
        <p className="text-sm text-muted-foreground">{t("mySpacePage.favorites.failedToLoad")}</p>
      ) : isLoading || !workspaces ? (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : workspaces.data.length === 0 ? (
        emptyState
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {workspaces.data.map((workspace) => (
            <FavoriteWorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}

      {totalPages > 1 && <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />}
    </div>
  );
}
