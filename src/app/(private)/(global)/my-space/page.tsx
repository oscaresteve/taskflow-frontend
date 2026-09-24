"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutChart } from "@/components/overview/donut-chart";
import { TaskListCard } from "@/components/overview/task-list-card";
import { ICONS } from "@/lib/icons";
import { getMyOverviewQuery } from "@/lib/queries/overview.queries";
import { FavoriteWorkspaces } from "./_components/favorite-workspaces";

export default function MySpacePage() {
  const t = useTranslations("mySpace");
  const { data: overview, isLoading, isError } = useQuery(getMyOverviewQuery());

  const isPending = isLoading || !overview;

  const urgencySegments = [
    {
      key: "overdue",
      label: t("mySpacePage.urgency.overdue"),
      count: overview?.tasks.byUrgency.overdue ?? 0,
      color: "var(--severity-critical)",
    },
    {
      key: "dueSoon",
      label: t("mySpacePage.urgency.dueSoon"),
      count: overview?.tasks.byUrgency.dueSoon ?? 0,
      color: "var(--severity-warning)",
    },
    {
      key: "scheduled",
      label: t("mySpacePage.urgency.scheduled"),
      count: overview?.tasks.byUrgency.scheduled ?? 0,
      color: "var(--chart-2)",
    },
    {
      key: "noDueDate",
      label: t("mySpacePage.urgency.noDueDate"),
      count: overview?.tasks.byUrgency.noDueDate ?? 0,
      color: "var(--chart-1)",
    },
  ];

  return (
    <PageContainer>
      <PageHeader title={t("mySpacePage.title")} />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("mySpacePage.focus.title")}</CardTitle>
            {!isError && (
              <CardDescription>
                {isPending ? (
                  <Skeleton className="h-4 w-40" />
                ) : (
                  t("mySpacePage.focus.completedThisWeek", { count: overview.tasks.completedLast7Days })
                )}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isError ? (
              <p className="text-sm text-muted-foreground">{t("mySpacePage.failedToLoad")}</p>
            ) : isPending ? (
              <div className="flex justify-center">
                <Skeleton className="size-45 rounded-full" />
              </div>
            ) : overview.tasks.open === 0 ? (
              <EmptyState icon={ICONS.task} title={t("mySpacePage.urgency.empty")} />
            ) : (
              <DonutChart
                segments={urgencySegments}
                centerValue={overview.tasks.open}
                centerLabel={t("mySpacePage.focus.openTasks")}
                emptyLabel={t("mySpacePage.urgency.empty")}
              />
            )}
          </CardContent>
        </Card>

        <FavoriteWorkspaces />
      </div>

      {!isError && (
        <TaskListCard
          title={t("mySpacePage.queue.title")}
          emptyLabel={t("mySpacePage.queue.empty")}
          tasks={overview?.myTasks ?? []}
          isLoading={isPending}
          showProject
        />
      )}
    </PageContainer>
  );
}
