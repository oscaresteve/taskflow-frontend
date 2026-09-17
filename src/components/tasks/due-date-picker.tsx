"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ICONS } from "@/lib/icons";
import { cn, isOverdue } from "@/lib/utils";
import { LocalizedCalendar } from "@/components/common/localized-calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DueDatePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  id?: string;
  className?: string;
  variant?: "icon" | "default";
}

export function DueDatePicker({ value, onChange, id, className, variant = "default" }: DueDatePickerProps) {
  const t = useTranslations("tasks");
  const format = useFormatter();
  const [open, setOpen] = useState(false);

  const date = value ? new Date(value) : undefined;
  const overdue = !!date && isOverdue(date);

  function handleSelect(next: Date | undefined) {
    onChange(next ? next.toISOString() : null);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {variant === "icon" ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                id={id}
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={cn("text-muted-foreground", overdue && "text-severity-critical-foreground", className)}
                  />
                }
              />
            }
          >
            {overdue ? <ICONS.overdue /> : !date ? <ICONS.dueDateEmpty /> : <ICONS.dueDate />}
          </TooltipTrigger>
          <TooltipContent>
            {date ? `${t("fields.dueDate")}: ${format.dateTime(date, "short")}` : t("fields.addDueDate")}
          </TooltipContent>
        </Tooltip>
      ) : (
        <PopoverTrigger
          id={id}
          render={
            <Button
              variant="outline"
              className={cn("justify-start font-normal", overdue && "text-severity-critical-foreground", className)}
            />
          }
        >
          {overdue ? <ICONS.overdue /> : !date ? <ICONS.dueDateEmpty /> : <ICONS.dueDate />}
          {date ? format.dateTime(date, "short") : t("fields.dueDatePlaceholder")}
        </PopoverTrigger>
      )}
      <PopoverContent align="start" className="w-auto p-0">
        <LocalizedCalendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
