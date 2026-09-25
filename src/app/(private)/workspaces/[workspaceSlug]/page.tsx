"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ICONS } from "@/lib/icons";
import { PageContainer } from "@/components/common/page-container";
import { StatCard, StatCardSkeleton } from "@/components/overview/stat-card";
import { TasksByDueDateCard } from "@/components/overview/tasks-by-due-date-card";
import { TasksByStatusCard } from "@/components/overview/tasks-by-status-card";
import { TaskListCard } from "@/components/overview/task-list-card";
import { getWorkspaceOverviewQuery } from "@/lib/queries/overview.queries";
import { FavoriteProjects } from "./_components/favorite-projects";
import { WorkspaceHeader } from "./_components/workspace-header";

export default function WorkspacePage() {
  const t = useTranslations("workspaces");
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: overview, isLoading, isError } = useQuery(getWorkspaceOverviewQuery(workspaceSlug));

  const tasks = isLoading ? undefined : overview?.tasks;

  return (
    <PageContainer className="gap-6">
      <WorkspaceHeader workspaceSlug={workspaceSlug} />

      {isError ? (
        <p className="text-sm text-muted-foreground">{t("workspacePage.failedToLoad")}</p>
      ) : !tasks || !overview ? (
        <div className="grid grid-cols-4 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        // Los contadores de tareas no enlazan: el espacio no tiene una vista de tareas propia a la
        // que bajar, las tareas se filtran dentro de cada proyecto.
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={ICONS.statOpenTasks} label={t("workspacePage.stats.openTasks")} value={tasks.open} />
          <StatCard
            icon={ICONS.statOverdue}
            label={t("workspacePage.stats.overdue")}
            value={tasks.byDueDate.overdue}
            className="text-severity-critical-foreground"
          />
          <StatCard
            icon={ICONS.statCompleted}
            label={t("workspacePage.stats.completedThisWeek")}
            value={tasks.completedLast7Days}
            className="text-severity-good-foreground"
          />
          <StatCard
            icon={ICONS.project}
            label={t("workspacePage.stats.projects")}
            value={overview.projectsCount}
            href={`/workspaces/${workspaceSlug}/projects`}
          />
        </div>
      )}

      <FavoriteProjects workspaceSlug={workspaceSlug} />

      {!isError && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <TasksByStatusCard data={tasks} />
            <TasksByDueDateCard data={tasks} />
          </div>

          <TaskListCard
            title={t("workspacePage.recent.title")}
            emptyLabel={t("workspacePage.recent.empty")}
            tasks={overview?.recentTasks ?? []}
            isLoading={!tasks}
            showProject
          />
        </>
      )}
    </PageContainer>
  );
}
