"use client";

import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/overview/chart-card";
import { ColumnChart, ColumnChartSkeleton } from "@/components/overview/column-chart";
import { DueDateBucketsDto } from "@/lib/dtos/overview.dto";
import { dueDateBucketOptions, dueDateBuckets } from "@/lib/task-enums";

interface TasksByDueDateCardProps {
  data?: { byDueDate: DueDateBucketsDto; open: number };
  className?: string;
}

export function TasksByDueDateCard({ data, className }: TasksByDueDateCardProps) {
  const t = useTranslations("overview");
  const tEnum = useTranslations();

  const bars = dueDateBuckets.map((bucket) => ({
    key: bucket,
    label: tEnum(dueDateBucketOptions[bucket].labelKey),
    value: data?.byDueDate[bucket] ?? 0,
    color: dueDateBucketOptions[bucket].chartColor,
  }));

  return (
    <ChartCard
      title={t("byDueDate.title")}
      description={data && t("byDueDate.total", { count: data.open })}
      className={className}
    >
      {data ? (
        <ColumnChart bars={bars} emptyLabel={t("byDueDate.empty")} valueLabel={t("byDueDate.valueLabel")} className="self-end" />
      ) : (
        <ColumnChartSkeleton />
      )}
    </ChartCard>
  );
}
