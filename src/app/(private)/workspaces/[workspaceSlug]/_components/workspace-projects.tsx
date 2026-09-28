"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ColorDot } from "@/components/ui/color-dot";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/common/empty-state";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { SearchableGrid } from "@/components/common/searchable-grid";
import { useSearchableGrid } from "@/hooks/use-searchable-grid";
import { useToggleProjectFavorite } from "@/hooks/use-toggle-project-favorite";
import { OverviewProjectDto } from "@/lib/dtos/overview.dto";
import { ICONS } from "@/lib/icons";
import { getWorkspaceOverviewProjectsQuery } from "@/lib/queries/overview.queries";

const PAGE_SIZE = 6;

function ProjectCard({ workspaceSlug, project }: { workspaceSlug: string; project: OverviewProjectDto }) {
  const t = useTranslations("workspaces");
  const format = useFormatter();
  const toggleFavorite = useToggleProjectFavorite(workspaceSlug, project.slug);
  const { open, overdue, completionRate, lastActivityAt } = project.stats;

  return (
    <Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50 group">
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex gap-3">
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
              className="-my-1 flex shrink-0 gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <FavoriteToggle
                isFavorite={project.isFavorite}
                onToggle={() => toggleFavorite.mutate(!project.isFavorite)}
                disabled={toggleFavorite.isPending}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 transition-opacity text-muted-foreground"
              />
            </div>
          </div>

          {/* Los numeros se anclan abajo para que todas las tarjetas de la fila los alineen. */}
          <div className="mt-auto flex flex-col gap-1.5">
            <Progress value={completionRate} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">{completionRate}%</span>
              <span>{t("workspacePage.projects.openTasks", { count: open })}</span>
              {/* Solo se nombra lo que va tarde cuando hay algo tarde. */}
              {overdue > 0 && (
                <span className="text-severity-critical-foreground">
                  {t("workspacePage.projects.overdue", { count: overdue })}
                </span>
              )}
              {lastActivityAt && (
                <span className="ml-auto">{format.relativeTime(new Date(lastActivityAt), new Date())}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function WorkspaceProjects({ workspaceSlug }: { workspaceSlug: string }) {
  const t = useTranslations("workspaces");
  const state = useSearchableGrid();

  const { data: projects, isError } = useQuery({
    ...getWorkspaceOverviewProjectsQuery(workspaceSlug, {
      page: state.page,
      limit: PAGE_SIZE,
      search: state.searchParam,
    }),
    placeholderData: keepPreviousData,
  });

  const emptyState = state.searchParam ? (
    <EmptyState
      icon={ICONS.project}
      title={t("workspacePage.projects.noneFound")}
      description={t("workspacePage.projects.noneFoundDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.project}
      title={t("workspacePage.projects.noneYet")}
      description={t("workspacePage.projects.noneYetDescription")}
    />
  );

  return (
    <SearchableGrid
      title={t("workspacePage.projects.title")}
      searchPlaceholder={t("workspacePage.projects.searchPlaceholder")}
      errorLabel={t("workspacePage.projects.failedToLoad")}
      emptyState={emptyState}
      columns="grid-cols-3"
      skeletonClassName="h-28"
      pageSize={PAGE_SIZE}
      state={state}
      result={projects}
      isError={isError}
    >
      {(project) => <ProjectCard workspaceSlug={workspaceSlug} project={project} />}
    </SearchableGrid>
  );
}
