"use client";

import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";

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
    .map((segment) => ({ bucket: segment.key, count: segment.count, fill: `var(--color-${segment.key})` }));

  return (
    <div className="grid grid-cols-5 items-center justify-center gap-4 w-full">
      <ChartContainer config={config} className="w-full aspect-square col-span-3">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => {
                  const segment = segments.find((item) => item.key === name);

                  return (
                    <>
                      <span className="size-2.5 shrink-0 rounded-xs" style={{ backgroundColor: segment?.color }} />
                      <span className="flex flex-1 items-center justify-between gap-3 leading-none">
                        <span className="text-muted-foreground">{segment?.label ?? name}</span>
                        <span className="font-mono font-medium tabular-nums">
                          {value} ({Math.round((Number(value) / total) * 100)}%)
                        </span>
                      </span>
                    </>
                  );
                }}
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

      <ul className="flex min-w-0 flex-1 flex-col gap-1.5 col-span-2">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-1.5 text-xs">
            <span aria-hidden className="size-2 shrink-0 rounded-xs" style={{ backgroundColor: segment.color }} />
            <span className="truncate text-muted-foreground">{segment.label}</span>
            <span className="ml-auto font-mono font-medium tabular-nums">{segment.count}</span>
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
