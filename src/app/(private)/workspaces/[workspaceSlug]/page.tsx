"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ICONS } from "@/lib/icons";
import { PageContainer } from "@/components/common/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/overview/stat-card";
import { DonutChart } from "@/components/overview/donut-chart";
import { RankedBarChart } from "@/components/overview/ranked-bar-chart";
import { TaskListCard } from "@/components/overview/task-list-card";
import { getWorkspaceOverviewQuery } from "@/lib/queries/overview.queries";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { statusOptions } from "@/lib/task-enums";
import { WorkspaceHeader } from "./_components/workspace-header";

export default function WorkspacePage() {
  const t = useTranslations("workspaces");
  const tEnum = useTranslations();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: overview, isLoading, isError } = useQuery(getWorkspaceOverviewQuery(workspaceSlug));

  const isPending = isLoading || !overview;

  const statusSegments = taskStatuses.map((status) => ({
    key: status.toLowerCase(),
    label: tEnum(statusOptions[status].labelKey),
    count: overview?.tasks.byStatus[status] ?? 0,
    color: statusOptions[status].chartColor,
  }));

  const workloadRows = (overview?.workload ?? []).map((project) => ({
    key: project.projectId,
    label: project.name,
    value: project.openTasksCount,
  }));

  return (
    <PageContainer>
      <WorkspaceHeader workspaceSlug={workspaceSlug} />

      {isError ? (
        <p className="text-sm text-muted-foreground">{t("workspacePage.failedToLoad")}</p>
      ) : (
        <>
          {isPending ? (
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <StatCard icon={ICONS.statOpenTasks} label={t("workspacePage.stats.openTasks")} value={overview.tasks.open} />
              <StatCard
                icon={ICONS.statOverdue}
                label={t("workspacePage.stats.overdue")}
                value={overview.tasks.overdue}
                tone={overview.tasks.overdue > 0 ? "destructive" : "default"}
              />
              <StatCard
                icon={ICONS.statCompleted}
                label={t("workspacePage.stats.completedThisWeek")}
                value={overview.tasks.completedLast7Days}
              />
              <StatCard icon={ICONS.project} label={t("workspacePage.stats.projects")} value={overview.projectsCount} />
            </div>
          )}

          {/* El reparto por estado (parte-todo, de un vistazo) al lado del ranking por proyecto
              (comparar magnitudes), que es la pregunta principal de la pagina. */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="overflow-visible">
              <CardHeader>
                <CardTitle>{t("workspacePage.byStatus.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <div className="flex justify-center">
                    <Skeleton className="size-45 rounded-full" />
                  </div>
                ) : (
                  <DonutChart
                    segments={statusSegments}
                    centerValue={`${overview.tasks.completionRate}%`}
                    centerLabel={t("workspacePage.byStatus.centerLabel")}
                    emptyLabel={t("workspacePage.byStatus.empty")}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="col-span-2 overflow-visible">
              <CardHeader>
                <CardTitle>{t("workspacePage.byProject.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <RankedBarChart
                    rows={workloadRows}
                    emptyLabel={t("workspacePage.byProject.empty")}
                    valueLabel={t("workspacePage.byProject.valueLabel")}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <TaskListCard
            title={t("workspacePage.recent.title")}
            emptyLabel={t("workspacePage.recent.empty")}
            tasks={overview?.recentTasks ?? []}
            isLoading={isPending}
            showProject
          />
        </>
      )}
    </PageContainer>
  );
}
