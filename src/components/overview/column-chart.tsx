"use client";

import { Bar, BarChart, LabelList, Rectangle, XAxis, YAxis } from "recharts";
import type { BarShapeProps } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";

export interface ColumnChartBar {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface ColumnChartProps {
  bars: ColumnChartBar[];
  emptyLabel: string;
  valueLabel: string;
}

const CHART_HEIGHT = 180;

function ColumnShape(props: BarShapeProps) {
  const bar: ColumnChartBar = props.payload;

  return <Rectangle {...props} fill={bar.color} />;
}

export function ColumnChart({ bars, emptyLabel, valueLabel }: ColumnChartProps) {
  if (bars.every((bar) => bar.value === 0)) {
    return <EmptyInline label={emptyLabel} className="py-2" />;
  }

  const config = { value: { label: valueLabel } } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="w-full" style={{ height: CHART_HEIGHT }}>
      <BarChart accessibilityLayer data={bars} margin={{ top: 20 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={0} />
        <YAxis type="number" dataKey="value" hide />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => (
                <>
                  <span className="size-2.5 shrink-0 rounded-xs" style={{ backgroundColor: item.payload.color }} />
                  <span className="font-mono font-medium tabular-nums">{value}</span>
                  <span className="text-muted-foreground">{valueLabel}</span>
                </>
              )}
            />
          }
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} shape={ColumnShape}>
          <LabelList dataKey="value" position="top" offset={8} fontSize={12} className="fill-card-foreground" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function ColumnChartSkeleton({ bars = 4 }: { bars?: number }) {
  // Alturas fijas y desiguales: un esqueleto con todas las barras iguales no se lee como un grafico.
  const heights = ["70%", "45%", "85%", "30%"];

  return (
    <div className="flex w-full items-end justify-around gap-3" style={{ height: CHART_HEIGHT }}>
      {Array.from({ length: bars }).map((_, index) => (
        <Skeleton key={index} className="w-full" style={{ height: heights[index % heights.length] }} />
      ))}
    </div>
  );
}
