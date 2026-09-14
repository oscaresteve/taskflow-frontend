"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutChart } from "@/components/overview/donut-chart";
import { TaskListCard } from "@/components/overview/task-list-card";
import { getMyOverviewQuery } from "@/lib/queries/overview.queries";

export default function MySpacePage() {
  const t = useTranslations("mySpace");
  const { data: overview, isLoading, isError } = useQuery(getMyOverviewQuery());

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("mySpacePage.failedToLoad")}</p>;
  }

  const isPending = isLoading || !overview;

  // Cubetas de urgencia en orden: lo que ya vencio primero, lo que no tiene fecha al final.
  // Comparten la rampa ordinal porque son una escala, no categorias sueltas.
  const urgencySegments = [
    {
      key: "overdue",
      label: t("mySpacePage.urgency.overdue"),
      count: overview?.tasks.byUrgency.overdue ?? 0,
      color: "var(--chart-4)",
    },
    {
      key: "dueSoon",
      label: t("mySpacePage.urgency.dueSoon"),
      count: overview?.tasks.byUrgency.dueSoon ?? 0,
      color: "var(--chart-3)",
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

      {/* items-start: la cola pasa de 2 a 8 tareas segun el dia, asi que estirar ambas tarjetas a
          la misma altura dejaria una de las dos medio vacia. */}
      <div className="grid grid-cols-3 items-start gap-4">
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>{t("mySpacePage.focus.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="size-45 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <DonutChart
                segments={urgencySegments}
                centerValue={overview.tasks.open}
                centerLabel={t("mySpacePage.focus.openTasks")}
                emptyLabel={t("mySpacePage.urgency.empty")}
                footer={t("mySpacePage.focus.completedThisWeek", { count: overview.tasks.completedLast7Days })}
              />
            )}
          </CardContent>
        </Card>

        <div className="col-span-2">
          <TaskListCard
            title={t("mySpacePage.queue.title")}
            emptyLabel={t("mySpacePage.queue.empty")}
            tasks={overview?.myTasks ?? []}
            isLoading={isPending}
            showProject
          />
        </div>
      </div>
    </PageContainer>
  );
}
