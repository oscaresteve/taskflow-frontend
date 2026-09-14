"use client";

import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  footer?: string;
}

// Reparto parte-todo de una escala ordenada (estado de las tareas, urgencia de mi cola). El anillo
// se lee de un vistazo y dentro va la cifra que resume la tarjeta; la leyenda lleva los numeros
// exactos, asi que comparar dos tramos parecidos nunca depende de medir el angulo a ojo.
export function DonutChart({ segments, centerValue, centerLabel, emptyLabel, footer }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  if (total === 0) {
    return <p className="py-2 text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const config = Object.fromEntries(
    segments.map((segment) => [segment.key, { label: segment.label, color: segment.color }]),
  ) satisfies ChartConfig;

  const data = segments
    .filter((segment) => segment.count > 0)
    .map((segment) => ({ bucket: segment.key, count: segment.count, fill: segment.color }));

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
            // El hueco entre porciones lo hace el angulo, no un borde pintado encima.
            paddingAngle={2}
            strokeWidth={0}
            isAnimationActive={false}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                const cx = viewBox.cx ?? 0;
                const cy = viewBox.cy ?? 0;

                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={cx} y={cy - 6} className="fill-foreground text-3xl font-semibold">
                      {centerValue}
                    </tspan>
                    <tspan x={cx} y={cy + 18} className="fill-muted-foreground text-xs">
                      {centerLabel}
                    </tspan>
                  </text>
                );
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

      {footer && <p className="text-center text-xs text-muted-foreground">{footer}</p>}
    </div>
  );
}
