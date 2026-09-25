"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { ChartCard } from "@/components/overview/chart-card";
import { DonutChart, DonutChartSkeleton } from "@/components/overview/donut-chart";
import { TaskListCard } from "@/components/overview/task-list-card";
import { getMyOverviewQuery } from "@/lib/queries/overview.queries";
import { dueDateBucketOptions, dueDateBuckets } from "@/lib/task-enums";
import { FavoriteWorkspaces } from "./_components/favorite-workspaces";

export default function MySpacePage() {
  const t = useTranslations("mySpace");
  const tEnum = useTranslations();
  const { data: overview, isLoading, isError } = useQuery(getMyOverviewQuery());

  const tasks = isLoading ? undefined : overview?.tasks;

  // Las mismas cubetas que pintan las otras dos vistas de overview, aqui como reparto de la carga
  // propia en vez de como grafica de barras.
  const segments = dueDateBuckets.map((bucket) => ({
    key: bucket,
    label: tEnum(dueDateBucketOptions[bucket].labelKey),
    count: tasks?.byDueDate[bucket] ?? 0,
    color: dueDateBucketOptions[bucket].chartColor,
  }));

  return (
    <PageContainer className="gap-6">
      <PageHeader title={t("mySpacePage.title")} />

      {isError ? (
        <p className="text-sm text-muted-foreground">{t("mySpacePage.failedToLoad")}</p>
      ) : (
        <div className="grid grid-cols-5 gap-6">
          <ChartCard
            title={t("mySpacePage.focus.title")}
            description={tasks && t("mySpacePage.focus.completedThisWeek", { count: tasks.completedLast7Days })}
            className="col-span-2"
          >
            {tasks ? (
              <DonutChart
                segments={segments}
                centerValue={tasks.open}
                centerLabel={t("mySpacePage.focus.openTasks")}
                emptyLabel={t("mySpacePage.focus.empty")}
              />
            ) : (
              <DonutChartSkeleton />
            )}
          </ChartCard>

          <FavoriteWorkspaces />
        </div>
      )}

      <TaskListCard
        title={t("mySpacePage.queue.title")}
        emptyLabel={t("mySpacePage.queue.empty")}
        tasks={overview?.myTasks ?? []}
        isLoading={!tasks}
        showProject
      />
    </PageContainer>
  );
}
