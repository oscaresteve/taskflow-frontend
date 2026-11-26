"use client";

import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/overview/chart-card";
import { DonutChart, DonutChartSkeleton } from "@/components/overview/donut-chart";
import { TaskStatus } from "@/lib/dtos/tasks.dto";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { statusOptions } from "@/lib/task-enums";

interface TasksByStatusCardProps {
  data?: { byStatus: Record<TaskStatus, number>; completionRate: number };
  className?: string;
}

export function TasksByStatusCard({ data, className }: TasksByStatusCardProps) {
  const t = useTranslations("overview");
  const tEnum = useTranslations();

  const total = data ? Object.values(data.byStatus).reduce((sum, count) => sum + count, 0) : 0;

  const segments = taskStatuses.map((status) => ({
    key: status.toLowerCase(),
    label: tEnum(statusOptions[status].labelKey),
    count: data?.byStatus[status] ?? 0,
    color: statusOptions[status].chartColor,
  }));

  return (
    <ChartCard
      title={t("byStatus.title")}
      description={data && t("byStatus.completed", { done: data.byStatus.DONE, total })}
      className={className}
    >
      {data ? (
        <DonutChart
          segments={segments}
          centerValue={`${data.completionRate}%`}
          centerLabel={t("byStatus.centerLabel")}
          emptyLabel={t("byStatus.empty")}
        />
      ) : (
        <DonutChartSkeleton />
      )}
    </ChartCard>
  );
}
