"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EmptyState } from "@/components/common/empty-state";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { SearchableGrid } from "@/components/common/searchable-grid";
import { useSearchableGrid } from "@/hooks/use-searchable-grid";
import { useToggleWorkspaceFavorite } from "@/hooks/use-toggle-workspace-favorite";
import { OverviewWorkspaceDto } from "@/lib/dtos/overview.dto";
import { ICONS } from "@/lib/icons";
import { getMyOverviewWorkspacesQuery } from "@/lib/queries/overview.queries";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 4;

function WorkspaceCard({ workspace }: { workspace: OverviewWorkspaceDto }) {
  const t = useTranslations("mySpace");
  const toggleFavorite = useToggleWorkspaceFavorite(workspace.slug);
  const { open, overdue } = workspace.stats;

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
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="truncate font-medium">{workspace.name}</span>
              {workspace.description && (
                <p className="line-clamp-2 text-xs text-muted-foreground">{workspace.description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className={cn("", open === 0 && "text-muted-foreground")}>
                <ICONS.task />
                {t("mySpacePage.workspaces.assignedTasks", { count: open })}
              </Badge>

              {overdue > 0 && (
                <Badge variant="destructive" className="tabular-nums">
                  <ICONS.overdue />
                  {t("mySpacePage.workspaces.overdue", { count: overdue })}
                </Badge>
              )}
            </div>
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

export function MyWorkspaces() {
  const t = useTranslations("mySpace");
  const state = useSearchableGrid();

  const { data: workspaces, isError } = useQuery({
    ...getMyOverviewWorkspacesQuery({ page: state.page, limit: PAGE_SIZE, search: state.searchParam }),
    placeholderData: keepPreviousData,
  });

  const emptyState = state.searchParam ? (
    <EmptyState
      icon={ICONS.workspace}
      title={t("mySpacePage.workspaces.noneFound")}
      description={t("mySpacePage.workspaces.noneFoundDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.workspace}
      title={t("mySpacePage.workspaces.noneYet")}
      description={t("mySpacePage.workspaces.noneYetDescription")}
    />
  );

  return (
    <SearchableGrid
      title={t("mySpacePage.workspaces.title")}
      searchPlaceholder={t("mySpacePage.workspaces.searchPlaceholder")}
      errorLabel={t("mySpacePage.workspaces.failedToLoad")}
      emptyState={emptyState}
      columns="grid-cols-2"
      skeletonClassName="h-24"
      pageSize={PAGE_SIZE}
      state={state}
      result={workspaces}
      isError={isError}
      className="col-span-3"
    >
      {(workspace) => <WorkspaceCard workspace={workspace} />}
    </SearchableGrid>
  );
}
