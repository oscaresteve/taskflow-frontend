"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("common");

  return (
    <Select
      value={String(value)}
      onValueChange={(next) => {
        if (next) onChange(Number(next));
      }}
    >
      <SelectTrigger className={className ?? "w-32"}>
        <SelectValue>{(selected: string) => t("pageSize", { size: Number(selected) })}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {t("pageSize", { size })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
