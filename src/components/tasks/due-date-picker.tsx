"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { overdueIcon } from "@/lib/task-enums";
import { cn, isOverdue } from "@/lib/utils";
import { LocalizedCalendar } from "@/components/common/localized-calendar";

interface DueDatePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  id?: string;
  className?: string;
}

export function DueDatePicker({ value, onChange, id, className }: DueDatePickerProps) {
  const t = useTranslations("tasks");
  const format = useFormatter();
  const OverdueIcon = overdueIcon;

  const [open, setOpen] = useState(false);

  const date = value ? new Date(value) : undefined;
  const overdue = !!date && isOverdue(date);

  function handleSelect(next: Date | undefined) {
    onChange(next ? next.toISOString() : null);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        render={
          <Button
            variant="outline"
            className={cn(
              "justify-start font-normal",
              !date && "text-muted-foreground",
              overdue && "text-severity-critical-foreground",
              className,
            )}
          />
        }
      >
        {overdue ? <OverdueIcon data-icon="inline-start" /> : <CalendarIcon data-icon="inline-start" />}
        {date ? format.dateTime(date, "short") : t("fields.dueDatePlaceholder")}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <LocalizedCalendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
