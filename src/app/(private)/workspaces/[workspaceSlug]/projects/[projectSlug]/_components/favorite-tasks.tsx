"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/common/empty-state";
import { EnumIconBadge } from "@/components/common/enum-display";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { SearchableGrid } from "@/components/common/searchable-grid";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { UserPopup } from "@/components/common/user-popup";
import { useSearchableGrid } from "@/hooks/use-searchable-grid";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { useToggleTaskFavorite } from "@/hooks/use-toggle-task-favorite";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { ICONS } from "@/lib/icons";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getTasksQuery } from "@/lib/queries/task.queries";
import { getDueDateOption, priorityOptions, statusOptions } from "@/lib/task-enums";
import { getFullName, isOverdue, parseDueDate } from "@/lib/utils";

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
  const t = useTranslations("tasks");
  const tEnum = useTranslations();
  const format = useFormatter();
  const toggleFavorite = useToggleTaskFavorite(workspaceSlug, projectSlug, task.taskNumber.toString());

  const statusOption = statusOptions[task.status];
  const priorityOption = priorityOptions[task.priority];

  const taskIsOverdue = !!task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);
  const dueDateOption = getDueDateOption(taskIsOverdue);

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
              <Tooltip>
                <TooltipTrigger render={<span className="flex" />}>
                  <EnumIconBadge option={statusOption} />
                </TooltipTrigger>
                <TooltipContent>{`${t("fields.status")}: ${tEnum(statusOption.labelKey)}`}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={<span className="flex" />}>
                  <EnumIconBadge option={priorityOption} />
                </TooltipTrigger>
                <TooltipContent>{`${t("fields.priority")}: ${tEnum(priorityOption.labelKey)}`}</TooltipContent>
              </Tooltip>

              {task.dueDate && (
                <Tooltip>
                  <TooltipTrigger render={<span className="flex" />}>
                    <EnumIconBadge option={dueDateOption} />
                  </TooltipTrigger>
                  <TooltipContent>{`${t("fields.dueDate")}: ${format.dateTime(parseDueDate(task.dueDate), "short")}`}</TooltipContent>
                </Tooltip>
              )}
            </span>

            {assignee && assigneeName && (
              <Tooltip>
                <UserPopup
                  userId={assignee.id}
                  align="end"
                  render={
                    <TooltipTrigger
                      render={
                        <CustomAvatar
                          size="sm"
                          avatarUrl={assignee.avatarUrl}
                          alt={assigneeName}
                          seed={assignee.id}
                          variant="glyphs"
                          className="cursor-pointer"
                        />
                      }
                    />
                  }
                />
                <TooltipContent>{`${t("fields.assignee")}: ${assigneeName}`}</TooltipContent>
              </Tooltip>
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
  const state = useSearchableGrid();

  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const { data: members } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug }));

  const { data: tasks, isError } = useQuery({
    ...getTasksQuery({
      workspaceSlug,
      projectSlug,
      page: state.page,
      limit: PAGE_SIZE,
      search: state.searchParam,
      isFavorite: true,
      sort: "updatedAt",
      order: "desc",
    }),
    placeholderData: keepPreviousData,
  });

  const emptyState = state.searchParam ? (
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
    <SearchableGrid
      title={t("projectOverviewPage.favorites.title")}
      searchPlaceholder={t("projectOverviewPage.favorites.searchPlaceholder")}
      errorLabel={t("projectOverviewPage.favorites.failedToLoad")}
      emptyState={emptyState}
      columns="grid-cols-4"
      skeletonClassName="h-16"
      pageSize={PAGE_SIZE}
      state={state}
      result={tasks}
      isError={isError}
    >
      {(task) => (
        <FavoriteTaskCard
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
      )}
    </SearchableGrid>
  );
}
