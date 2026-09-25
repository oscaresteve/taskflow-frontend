"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ICONS } from "@/lib/icons";
import { PageContainer } from "@/components/common/page-container";
import { StatCard, StatCardSkeleton } from "@/components/overview/stat-card";
import { TasksByDueDateCard } from "@/components/overview/tasks-by-due-date-card";
import { TasksByPriorityCard } from "@/components/overview/tasks-by-priority-card";
import { TasksByStatusCard } from "@/components/overview/tasks-by-status-card";
import { TaskListCard } from "@/components/overview/task-list-card";
import { FavoriteTasks } from "./_components/favorite-tasks";
import { getProjectOverviewQuery } from "@/lib/queries/overview.queries";

export default function ProjectPage() {
  const t = useTranslations("projects");
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: overview, isLoading, isError } = useQuery(getProjectOverviewQuery({ workspaceSlug, projectSlug }));

  const tasks = isLoading ? undefined : overview?.tasks;
  const listHref = `/workspaces/${workspaceSlug}/projects/${projectSlug}/list`;

  return (
    <PageContainer className="gap-6">
      {isError ? (
        <p className="text-sm text-muted-foreground">{t("projectOverviewPage.failedToLoad")}</p>
      ) : !tasks ? (
        <div className="grid grid-cols-4 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            icon={ICONS.statOpenTasks}
            label={t("projectOverviewPage.stats.openTasks")}
            value={tasks.open}
            href={`${listHref}?status=OPEN`}
          />
          <StatCard
            icon={ICONS.statOverdue}
            label={t("projectOverviewPage.stats.overdue")}
            value={tasks.byDueDate.overdue}
            className="text-severity-critical-foreground"
            href={`${listHref}?dueDate=OVERDUE`}
          />
          <StatCard
            icon={ICONS.statCompleted}
            label={t("projectOverviewPage.stats.completedThisWeek")}
            value={tasks.completedLast7Days}
            className="text-severity-good-foreground"
            href={`${listHref}?status=DONE`}
          />
          <StatCard
            icon={ICONS.statUnassigned}
            label={t("projectOverviewPage.stats.unassigned")}
            value={tasks.unassigned}
            href={`${listHref}?assigneeId=UNASSIGNED`}
          />
        </div>
      )}

      <FavoriteTasks workspaceSlug={workspaceSlug} projectSlug={projectSlug} />

      {!isError && (
        <>
          <div className="grid grid-cols-3 gap-6">
            <TasksByStatusCard data={tasks} />
            <TasksByPriorityCard data={tasks} />
            <TasksByDueDateCard data={tasks} />
          </div>

          <TaskListCard
            title={t("projectOverviewPage.recent.title")}
            emptyLabel={t("projectOverviewPage.recent.empty")}
            tasks={overview?.recentTasks ?? []}
            isLoading={!tasks}
          />
        </>
      )}
    </PageContainer>
  );
}
