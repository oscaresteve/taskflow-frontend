"use client";

import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { ChartTooltipRow } from "@/components/overview/chart-tooltip-row";

export interface DonutSegment {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerValue: string | number;
  centerLabel: string;
  emptyLabel: string;
}

export function DonutChart({ segments, centerValue, centerLabel, emptyLabel }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  if (total === 0) {
    return <EmptyInline label={emptyLabel} className="py-2" />;
  }

  const config = Object.fromEntries(
    segments.map((segment) => [segment.key, { label: segment.label, color: segment.color }]),
  ) satisfies ChartConfig;

  const data = segments
    .filter((segment) => segment.count > 0)
    .map((segment) => ({
      bucket: segment.key,
      label: segment.label,
      color: segment.color,
      count: segment.count,
      fill: `var(--color-${segment.key})`,
    }));

  return (
    <div className="flex w-full items-center justify-center gap-6">
      <ChartContainer config={config} className="aspect-square min-w-0 max-w-64 flex-1">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, _name, item) => (
                  <ChartTooltipRow
                    color={item.payload.color}
                    label={item.payload.label}
                    value={`${value} (${Math.round((Number(value) / total) * 100)}%)`}
                  />
                )}
              />
            }
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="bucket"
            innerRadius="62%"
            outerRadius="100%"
            paddingAngle={2}
            strokeWidth={0}
            isAnimationActive={false}
            cornerRadius={6}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                        {centerValue}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                        {centerLabel}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="flex w-fit shrink-0 flex-col gap-1.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-1.5 text-xs">
            <span aria-hidden className="size-2.5 shrink-0 rounded-xs" style={{ backgroundColor: segment.color }} />
            <span className="flex flex-1 items-center justify-between gap-3 leading-none whitespace-nowrap">
              <span className="text-muted-foreground">{segment.label}</span>
              <span className="font-mono font-medium tabular-nums">{segment.count}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DonutChartSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Skeleton className="size-40 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}
