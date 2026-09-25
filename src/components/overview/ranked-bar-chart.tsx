"use client";

import { Bar, BarChart, LabelList, Rectangle, XAxis, YAxis } from "recharts";
import type { BarShapeProps } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";

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

const ROW_HEIGHT = 32;
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
    <ChartContainer config={config} className="w-full" style={{ height: rows.length * ROW_HEIGHT }}>
      <BarChart accessibilityLayer layout="vertical" data={rows} margin={{ right: 32 }}>
        <XAxis type="number" dataKey="value" hide />
        <YAxis
          type="category"
          dataKey="label"
          width="auto"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tick={{ fill: "var(--card-foreground)", fillOpacity: 0.75 }}
          tickFormatter={truncate}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => (
                <>
                  <span
                    className="size-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: item.payload.color ?? "var(--color-value)" }}
                  />
                  <span className="font-mono font-medium tabular-nums">{value}</span>
                  <span className="text-muted-foreground">{valueLabel}</span>
                </>
              )}
            />
          }
        />
        <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]} isAnimationActive={false} shape={RankedBarShape}>
          <LabelList dataKey="value" position="right" offset={8} fontSize={12} className="fill-card-foreground" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function RankedBarChartSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex w-full flex-col justify-center gap-2" style={{ height: rows * ROW_HEIGHT }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-3 w-24 shrink-0" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
