"use client";

import { Bar, BarChart, Rectangle, XAxis, YAxis } from "recharts";
import type { BarShapeProps } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { ChartTooltipRow } from "@/components/overview/chart-tooltip-row";

export interface RankedBarRow {
  key: string;
  label: string;
  value: number;
  color?: string;
}

interface RankedBarChartProps {
  rows: RankedBarRow[];
  emptyLabel: string;
  valueLabel: string;
}

const ROW_HEIGHT = 44;
const MAX_BAR_SIZE = 32;
const MAX_LABEL_CHARS = 24;

function RankedBarShape(props: BarShapeProps) {
  const row: RankedBarRow = props.payload;

  return <Rectangle {...props} fill={row.color ?? "var(--color-value)"} />;
}

function truncate(label: string) {
  return label.length > MAX_LABEL_CHARS ? `${label.slice(0, MAX_LABEL_CHARS - 1)}…` : label;
}

export function RankedBarChart({ rows, emptyLabel, valueLabel }: RankedBarChartProps) {
  if (rows.length === 0 || rows.every((row) => row.value === 0)) {
    return <EmptyInline label={emptyLabel} className="py-2" />;
  }

  const config = { value: { label: valueLabel, color: "var(--chart-3)" } } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height: rows.length * ROW_HEIGHT }}>
      <BarChart accessibilityLayer layout="vertical" data={rows} margin={{ top: 0, bottom: 0, left: 0, right: 32 }}>
        <XAxis type="number" dataKey="value" hide />
        <YAxis
          type="category"
          dataKey="label"
          width="auto"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tick={{ className: "fill-muted-foreground text-xs" }}
          tickFormatter={truncate}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, _name, item) => (
                <ChartTooltipRow
                  color={item.payload.color ?? "var(--color-value)"}
                  label={item.payload.label}
                  value={value}
                />
              )}
            />
          }
        />
        <Bar dataKey="value" maxBarSize={MAX_BAR_SIZE} radius={6} isAnimationActive={false} shape={RankedBarShape} />
      </BarChart>
    </ChartContainer>
  );
}

export function RankedBarChartSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex w-full flex-col">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-2" style={{ height: ROW_HEIGHT }}>
          <Skeleton className="h-3 w-24 shrink-0" />
          <Skeleton className="flex-1 rounded-md" style={{ height: MAX_BAR_SIZE }} />
        </div>
      ))}
    </div>
  );
}
