"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { EnumIconBadge } from "@/components/common/enum-display";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { useFavoritesGrid } from "@/hooks/use-favorites-grid";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { useToggleTaskFavorite } from "@/hooks/use-toggle-task-favorite";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { ICONS } from "@/lib/icons";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getTasksQuery } from "@/lib/queries/task.queries";
import { priorityOptions, statusOptions } from "@/lib/task-enums";
import { cn, getFullName, isOverdue } from "@/lib/utils";

const PAGE_SIZE = 8;

interface FavoriteTaskCardProps {
  workspaceSlug: string;
  projectSlug: string;
  taskKey: string;
  task: TaskResponseDto;
  assignee?: UserResponseDto;
  href: string;
}

function FavoriteTaskCard({ workspaceSlug, projectSlug, taskKey, task, assignee, href }: FavoriteTaskCardProps) {
  const format = useFormatter();
  const toggleFavorite = useToggleTaskFavorite(workspaceSlug, projectSlug, task.taskNumber.toString());

  const statusOption = statusOptions[task.status];
  const priorityOption = priorityOptions[task.priority];

  const taskIsOverdue = !!task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);
  const assigneeName = assignee ? getFullName(assignee.firstName, assignee.lastName) : null;

  return (
    <Link href={href}>
      <Card size="sm" className="h-full gap-2 transition-colors hover:bg-muted/50 group">
        <CardContent className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{taskKey}</span>
            <span
              className="-my-1 flex shrink-0 items-center gap-1"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <FavoriteToggle
                isFavorite={task.isFavorite}
                onToggle={() => toggleFavorite.mutate(!task.isFavorite)}
                disabled={toggleFavorite.isPending}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 transition-opacity text-muted-foreground"
              />
            </span>
          </div>

          <p className="line-clamp-2 flex flex-1 text-sm font-medium">{task.title}</p>

          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <EnumIconBadge option={statusOption} />
              <EnumIconBadge option={priorityOption} />

              {task.dueDate && (
                <span className={cn("flex items-center gap-1", taskIsOverdue && "text-severity-critical-foreground")}>
                  {taskIsOverdue ? (
                    <ICONS.overdue className="size-3.5 shrink-0" />
                  ) : (
                    <ICONS.dueDate className="size-3.5 shrink-0" />
                  )}
                  {format.dateTime(new Date(task.dueDate), "short")}
                </span>
              )}
            </span>

            {assignee && assigneeName && (
              <CustomAvatar
                size="sm"
                avatarUrl={assignee.avatarUrl}
                alt={assigneeName}
                seed={assignee.id}
                variant="glyphs"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function FavoriteTasks({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  const t = useTranslations("projects");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { search, page, searchParam, onSearchChange, onPageChange } = useFavoritesGrid();

  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const { data: members } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug }));

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    ...getTasksQuery({
      workspaceSlug,
      projectSlug,
      page,
      limit: PAGE_SIZE,
      search: searchParam,
      isFavorite: true,
      sort: "updatedAt",
      order: "desc",
    }),
    placeholderData: keepPreviousData,
  });

  const totalPages = tasks?.pagination.pages ?? 1;

  const emptyState = searchParam ? (
    <EmptyState
      icon={ICONS.favorite}
      title={t("projectOverviewPage.favorites.noFavoritesFound")}
      description={t("projectOverviewPage.favorites.noFavoritesFoundDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.favorite}
      title={t("projectOverviewPage.favorites.noFavoritesYet")}
      description={t("projectOverviewPage.favorites.noFavoritesYetDescription")}
    />
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-base leading-snug font-medium">{t("projectOverviewPage.favorites.title")}</h2>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t("projectOverviewPage.favorites.searchPlaceholder")}
          className="w-48"
        />
      </div>

      {isError ? (
        <p className="text-sm text-muted-foreground">{t("projectOverviewPage.favorites.failedToLoad")}</p>
      ) : isLoading || !tasks ? (
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : tasks.data.length === 0 ? (
        emptyState
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {tasks.data.map((task) => (
            <FavoriteTaskCard
              key={task.id}
              workspaceSlug={workspaceSlug}
              projectSlug={projectSlug}
              taskKey={`${project?.key}-${task.taskNumber}`}
              assignee={members?.find((member) => member.userId === task.assigneeId)?.user}
              task={task}
              href={buildTaskModalHref({
                pathname,
                searchParams,
                workspaceSlug,
                projectSlug,
                taskNumber: task.taskNumber,
              })}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />}
    </section>
  );
}
