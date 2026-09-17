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
import { getProjectOverviewQuery } from "@/lib/queries/overview.queries";
import { taskPriorities, taskStatuses } from "@/lib/schemas/task.schema";
import { priorityOptions, statusOptions } from "@/lib/task-enums";
import { getFullName } from "@/lib/utils";

export default function ProjectPage() {
  const t = useTranslations("projects");
  const tEnum = useTranslations();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: overview, isLoading, isError } = useQuery(getProjectOverviewQuery({ workspaceSlug, projectSlug }));

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("projectOverviewPage.failedToLoad")}</p>;
  }

  const isPending = isLoading || !overview;
  const totalTasks = taskStatuses.reduce((sum, status) => sum + (overview?.tasks.byStatus[status] ?? 0), 0);

  const statusSegments = taskStatuses.map((status) => ({
    key: status.toLowerCase(),
    label: tEnum(statusOptions[status].labelKey),
    count: overview?.tasks.byStatus[status] ?? 0,
    color: statusOptions[status].chartColor,
  }));

  // La prioridad usa el mismo color semantico que el resto de la app (badges, selects): LOW=good
  // ... URGENT=critical, no una rampa ordinal aparte.
  const priorityRows = taskPriorities.map((priority) => ({
    key: priority,
    label: tEnum(priorityOptions[priority].labelKey),
    value: overview?.tasks.byPriority[priority] ?? 0,
    color: priorityOptions[priority].chartColor,
  }));

  const workloadRows = (overview?.workload ?? []).map((member) => ({
    key: member.userId,
    label: getFullName(member.firstName, member.lastName),
    value: member.openTasksCount,
  }));

  return (
    <PageContainer>
      {isPending ? (
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={ICONS.statOverdue}
            label={t("projectOverviewPage.stats.overdue")}
            value={overview.tasks.overdue}
            tone={overview.tasks.overdue > 0 ? "destructive" : "default"}
          />
          <StatCard icon={ICONS.statUnassigned} label={t("projectOverviewPage.stats.unassigned")} value={overview.tasks.unassigned} />
          <StatCard
            icon={ICONS.statCompleted}
            label={t("projectOverviewPage.stats.completedThisWeek")}
            value={overview.tasks.completedLast7Days}
          />
        </div>
      )}

      {/* Como va el proyecto, donde esta el riesgo y quien lo esta empujando: las tres lecturas
          juntas en una fila, que es como se miran. */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>{t("projectOverviewPage.progress.title")}</CardTitle>
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
                centerLabel={t("projectOverviewPage.progress.complete")}
                emptyLabel={t("projectOverviewPage.progress.empty")}
                footer={t("projectOverviewPage.progress.taskCount", { count: totalTasks })}
              />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>{t("projectOverviewPage.byPriority.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <RankedBarChart
                rows={priorityRows}
                emptyLabel={t("projectOverviewPage.byPriority.empty")}
                valueLabel={t("projectOverviewPage.byPriority.valueLabel")}
                labelWidth={70}
              />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>{t("projectOverviewPage.workload.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <RankedBarChart
                rows={workloadRows}
                emptyLabel={t("projectOverviewPage.workload.empty")}
                valueLabel={t("projectOverviewPage.workload.valueLabel")}
                labelWidth={110}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <TaskListCard
        title={t("projectOverviewPage.recent.title")}
        emptyLabel={t("projectOverviewPage.recent.empty")}
        tasks={overview?.recentTasks ?? []}
        isLoading={isPending}
      />
    </PageContainer>
  );
}
