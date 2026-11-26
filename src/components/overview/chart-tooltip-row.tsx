import type { ReactNode } from "react";

interface ChartTooltipRowProps {
  color?: string;
  label: ReactNode;
  value: ReactNode;
}

export function ChartTooltipRow({ color, label, value }: ChartTooltipRowProps) {
  return (
    <>
      <span className="size-2.5 shrink-0 rounded-xs" style={{ backgroundColor: color }} />
      <span className="flex flex-1 items-center justify-between gap-3 leading-none">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium tabular-nums">{value}</span>
      </span>
    </>
  );
}
