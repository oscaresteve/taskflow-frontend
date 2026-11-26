"use client";

import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/overview/chart-card";
import { RankedBarChart, RankedBarChartSkeleton } from "@/components/overview/ranked-bar-chart";
import { TaskPriority } from "@/lib/dtos/tasks.dto";
import { taskPriorities } from "@/lib/schemas/task.schema";
import { priorityOptions } from "@/lib/task-enums";

interface TasksByPriorityCardProps {
  data?: { byPriority: Record<TaskPriority, number> };
  className?: string;
}

export function TasksByPriorityCard({ data, className }: TasksByPriorityCardProps) {
  const t = useTranslations("overview");
  const tEnum = useTranslations();

  const total = data ? Object.values(data.byPriority).reduce((sum, count) => sum + count, 0) : 0;

  // La prioridad usa el mismo color semantico que el resto de la app (badges, selects): LOW=good
  // ... URGENT=critical, no una rampa ordinal aparte.
  const rows = taskPriorities.map((priority) => ({
    key: priority,
    label: tEnum(priorityOptions[priority].labelKey),
    value: data?.byPriority[priority] ?? 0,
    color: priorityOptions[priority].chartColor,
  }));

  return (
    <ChartCard
      title={t("byPriority.title")}
      description={data && t("byPriority.total", { count: total })}
      className={className}
    >
      {data ? (
        <RankedBarChart rows={rows} emptyLabel={t("byPriority.empty")} valueLabel={t("byPriority.valueLabel")} />
      ) : (
        <RankedBarChartSkeleton rows={4} />
      )}
    </ChartCard>
  );
}
