"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ColorDot } from "@/components/ui/color-dot";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import { ProjectActionsMenu } from "@/components/projects/project-actions-menu";
import { useFavoritesGrid } from "@/hooks/use-favorites-grid";
import { useProjectRole } from "@/hooks/use-project-role";
import { useToggleProjectFavorite } from "@/hooks/use-toggle-project-favorite";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { ICONS } from "@/lib/icons";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";
import { getProjectsQuery } from "@/lib/queries/project.queries";

const PAGE_SIZE = 6;

function FavoriteProjectCard({ workspaceSlug, project }: { workspaceSlug: string; project: ProjectResponseDto }) {
  const toggleFavorite = useToggleProjectFavorite(workspaceSlug, project.slug);
  const { role: myRole } = useProjectRole(workspaceSlug, project.slug);

  return (
    <Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardContent className="flex h-full items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex min-w-0 items-center gap-2">
              <ColorDot color={project.color} className="size-4 shrink-0" />
              <span className="truncate font-medium">{project.name}</span>
            </div>
            {project.description && (
              <p className="line-clamp-2 pl-6 text-xs text-muted-foreground">{project.description}</p>
            )}
          </div>

          <div
            className="-my-1 flex shrink-0 items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <FavoriteToggle
              isFavorite={project.isFavorite}
              onToggle={() => toggleFavorite.mutate(!project.isFavorite)}
              disabled={toggleFavorite.isPending}
            />
            <ProjectActionsMenu workspaceSlug={workspaceSlug} project={project} canManage={isProjectManager(myRole)} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function FavoriteProjects({ workspaceSlug }: { workspaceSlug: string }) {
  const t = useTranslations("workspaces");
  const { search, page, searchParam, onSearchChange, onPageChange } = useFavoritesGrid();

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    ...getProjectsQuery(workspaceSlug, {
      page,
      limit: PAGE_SIZE,
      search: searchParam,
      isFavorite: true,
      sort: "name",
      order: "asc",
    }),
    placeholderData: keepPreviousData,
  });

  const totalPages = projects?.pagination.pages ?? 1;

  const emptyState = searchParam ? (
    <EmptyState
      icon={ICONS.favorite}
      title={t("workspacePage.favorites.noFavoritesFound")}
      description={t("workspacePage.favorites.noFavoritesFoundDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.favorite}
      title={t("workspacePage.favorites.noFavoritesYet")}
      description={t("workspacePage.favorites.noFavoritesYetDescription")}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-base leading-snug font-medium">{t("workspacePage.favorites.title")}</h2>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t("workspacePage.favorites.searchPlaceholder")}
          className="w-48"
        />
      </div>

      {isError ? (
        <p className="text-sm text-muted-foreground">{t("workspacePage.favorites.failedToLoad")}</p>
      ) : isLoading || !projects ? (
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : projects.data.length === 0 ? (
        emptyState
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {projects.data.map((project) => (
            <FavoriteProjectCard key={project.id} workspaceSlug={workspaceSlug} project={project} />
          ))}
        </div>
      )}

      {totalPages > 1 && <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />}
    </div>
  );
}
