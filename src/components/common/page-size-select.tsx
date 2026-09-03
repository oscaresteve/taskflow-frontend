"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PageSizeSelect({
  value,
  options,
  onChange,
  className,
}: {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <Select
      value={String(value)}
      onValueChange={(next) => {
        if (next) onChange(Number(next));
      }}
    >
      <SelectTrigger className={className ?? "w-32"}>
        <SelectValue>{(selected: string) => `${selected} / page`}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size} / page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
