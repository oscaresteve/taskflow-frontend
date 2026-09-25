"use client";

import { Bar, BarChart, Rectangle, XAxis, YAxis } from "recharts";
import type { BarShapeProps } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { cn } from "@/lib/utils";
import { ChartTooltipRow } from "@/components/overview/chart-tooltip-row";

export interface ColumnChartBar {
  key: string;
  label: string;
  value: number;
  color: string;
}

const MAX_BAR_SIZE = 48;

interface ColumnChartProps {
  bars: ColumnChartBar[];
  emptyLabel: string;
  valueLabel: string;
  className?: string;
}

function ColumnShape(props: BarShapeProps) {
  const bar: ColumnChartBar = props.payload;

  return <Rectangle {...props} fill={bar.color} />;
}

export function ColumnChart({ bars, emptyLabel, valueLabel, className }: ColumnChartProps) {
  if (bars.every((bar) => bar.value === 0)) {
    return <EmptyInline label={emptyLabel} className="py-2" />;
  }

  const config = { value: { label: valueLabel } } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className={cn("w-full", className)}>
      <BarChart accessibilityLayer data={bars} margin={{ top: 20 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          tick={{ className: "fill-muted-foreground text-xs" }}
        />
        <YAxis type="number" dataKey="value" hide />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, _name, item) => (
                <ChartTooltipRow color={item.payload.color} label={item.payload.label} value={value} />
              )}
            />
          }
        />
        <Bar dataKey="value" maxBarSize={MAX_BAR_SIZE} radius={6} isAnimationActive={false} shape={ColumnShape} />
      </BarChart>
    </ChartContainer>
  );
}

export function ColumnChartSkeleton({ bars = 4 }: { bars?: number }) {
  // Alturas fijas y desiguales: un esqueleto con todas las barras iguales no se lee como un grafico.
  const heights = ["70%", "45%", "85%", "30%"];

  return (
    <div className="flex w-full items-end justify-around gap-3">
      {Array.from({ length: bars }).map((_, index) => (
        <Skeleton key={index} className="w-full max-w-12" style={{ height: heights[index % heights.length] }} />
      ))}
    </div>
  );
}
