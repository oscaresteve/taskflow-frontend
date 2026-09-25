"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EmptyState } from "@/components/common/empty-state";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import { useFavoritesGrid } from "@/hooks/use-favorites-grid";
import { useToggleWorkspaceFavorite } from "@/hooks/use-toggle-workspace-favorite";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { ICONS } from "@/lib/icons";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";

const PAGE_SIZE = 4;

function FavoriteWorkspaceCard({ workspace }: { workspace: WorkspaceResponseDto }) {
  const toggleFavorite = useToggleWorkspaceFavorite(workspace.slug);

  return (
    <Link href={`/workspaces/${workspace.slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50 group">
        <CardContent className="flex h-full gap-3">
          <CustomAvatar
            size="lg"
            avatarUrl={workspace.avatarUrl}
            alt={workspace.name}
            seed={workspace.id}
            className="shrink-0"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate font-medium">{workspace.name}</span>
            {workspace.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">{workspace.description}</p>
            )}
          </div>
          <div
            className="-my-1 flex shrink-0 gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FavoriteToggle
              isFavorite={workspace.isFavorite}
              onToggle={() => toggleFavorite.mutate(!workspace.isFavorite)}
              disabled={toggleFavorite.isPending}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 transition-opacity text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function FavoriteWorkspaces() {
  const t = useTranslations("mySpace");
  const { search, page, searchParam, onSearchChange, onPageChange } = useFavoritesGrid();

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
    <div className="flex flex-col gap-3 col-span-3">
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
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
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
