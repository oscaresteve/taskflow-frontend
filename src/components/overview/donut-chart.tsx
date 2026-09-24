"use client";

import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
    <div className="flex flex-col gap-3">
      <ChartContainer config={config} className="mx-auto aspect-square h-45">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="bucket" />} />
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

      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-1.5 text-xs">
            <span aria-hidden className="size-2 shrink-0 rounded-xs" style={{ backgroundColor: segment.color }} />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="font-medium tabular-nums">{segment.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
