"use client";

import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOrder } from "@/lib/dtos/pagination.dto";

export function SortControls<TField extends string>({
  field,
  order,
  options,
  onFieldChange,
  onOrderChange,
}: {
  field: TField;
  order: SortOrder;
  options: { value: TField; label: string }[];
  onFieldChange: (value: TField) => void;
  onOrderChange: (value: SortOrder) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Select value={field} onValueChange={(value) => value && onFieldChange(value as TField)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={order === "asc" ? "Sort ascending" : "Sort descending"}
        onClick={() => onOrderChange(order === "asc" ? "desc" : "asc")}
      >
        {order === "asc" ? <ArrowUpAZ /> : <ArrowDownAZ />}
      </Button>
    </div>
  );
}
