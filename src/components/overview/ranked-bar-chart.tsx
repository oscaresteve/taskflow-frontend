"use client";

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { EmptyInline } from "@/components/common/empty-inline";

export interface RankedBarRow {
  key: string;
  label: string;
  value: number;
  // Solo para escalas con orden propio (prioridad). Las categorias sin orden (proyectos,
  // personas) comparten color: la longitud de la barra ya dice cuanto, teñirla ademas por valor
  // gastaria el canal de color repitiendo esa misma informacion.
  color?: string;
}

interface RankedBarChartProps {
  rows: RankedBarRow[];
  emptyLabel: string;
  valueLabel: string;
  // Ancho reservado para las etiquetas del eje. Se baja en las tarjetas estrechas de la rejilla,
  // donde 150px se comerian casi todo el espacio de las barras.
  labelWidth?: number;
}

const ROW_HEIGHT = 32;

export function RankedBarChart({ rows, emptyLabel, valueLabel, labelWidth = 150 }: RankedBarChartProps) {
  if (rows.length === 0 || rows.every((row) => row.value === 0)) {
    return <EmptyInline label={emptyLabel} className="py-2" />;
  }

  const config = { value: { label: valueLabel, color: "var(--chart-3)" } } satisfies ChartConfig;

  // El tick por defecto de recharts parte la etiqueta en varias lineas cuando no cabe, asi que se
  // recorta antes (~7px por caracter a 12px, con margen) y ademas se pinta con un <text> propio de
  // una sola linea mas abajo.
  const maxChars = Math.floor((labelWidth - 10) / 7);

  const data = rows.map((row) => ({
    ...row,
    tick: row.label.length > maxChars ? `${row.label.slice(0, maxChars - 1)}…` : row.label,
  }));

  return (
    <ChartContainer config={config} className="w-full" style={{ height: rows.length * ROW_HEIGHT }}>
      <BarChart accessibilityLayer layout="vertical" data={data} margin={{ left: 0, right: 28, top: 4, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="tick"
          width={labelWidth}
          tickLine={false}
          axisLine={false}
          tick={({ x, y, payload }) => (
            <text x={Number(x)} y={Number(y)} dy={4} textAnchor="end" fontSize={12} className="fill-muted-foreground">
              {String(payload?.value ?? "")}
            </text>
          )}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        {/* Sin animacion de entrada: cada refetch la reiniciaba desde 0 (y recharts no pinta las
            etiquetas hasta que termina), asi que la barra parpadeaba y a veces se quedaba a medias. */}
        <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]} isAnimationActive={false}>
          {data.map((row) => (
            <Cell key={row.key} fill={row.color ?? "var(--color-value)"} />
          ))}
          {/* El valor va en la punta de cada barra: el tooltip complementa, nunca es la unica via. */}
          <LabelList dataKey="value" position="right" offset={8} fontSize={12} className="fill-muted-foreground" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
