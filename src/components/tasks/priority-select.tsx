"use client";

import { EnumBadge, EnumControl, EnumIconControl, EnumIconLabel } from "@/components/common/enum-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskPriority } from "@/lib/dtos/tasks.dto";
import { taskPriorities } from "@/lib/schemas/task.schema";
import { PriorityFilter, priorityFilterOptions, priorityFilters, priorityOptions } from "@/lib/task-enums";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface PrioritySelectProps {
  id?: string;
  variant?: "badge" | "default" | "icon";
  value: TaskPriority;
  onValueChange: (value: TaskPriority) => void;
  className?: string;
}

export function PrioritySelect({ id, variant = "default", value, onValueChange, className }: PrioritySelectProps) {
  const t = useTranslations("tasks");
  const tEnum = useTranslations();
  return (
    <DropdownMenu>
      {variant === "icon" ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                id={id}
                render={<EnumIconControl option={priorityOptions[value]} className={className} />}
              />
            }
          />
          <TooltipContent>{`${t("fields.priority")}: ${tEnum(priorityOptions[value].labelKey)}`}</TooltipContent>
        </Tooltip>
      ) : variant === "badge" ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                id={id}
                className={cn(
                  "flex w-fit cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  className,
                )}
              />
            }
          >
            <EnumBadge option={priorityOptions[value]} interactive />
          </TooltipTrigger>
          <TooltipContent>{`${t("fields.priority")}: ${tEnum(priorityOptions[value].labelKey)}`}</TooltipContent>
        </Tooltip>
      ) : (
        <DropdownMenuTrigger id={id} render={<EnumControl option={priorityOptions[value]} className={className} />} />
      )}

      <DropdownMenuContent className="min-w-max">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as TaskPriority)}>
          {taskPriorities.map((priority) => (
            <DropdownMenuRadioItem
              key={priority}
              value={priority}
              closeOnClick
              className={priorityOptions[priority].colors.menuHighlight}
            >
              <EnumIconLabel option={priorityOptions[priority]} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PriorityFilterSelect({
  value,
  onValueChange,
}: {
  value: PriorityFilter;
  onValueChange: (value: PriorityFilter) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<EnumControl option={priorityFilterOptions[value]} />} />
      <DropdownMenuContent className="min-w-max">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as PriorityFilter)}>
          {priorityFilters.map((priority) => (
            <DropdownMenuRadioItem
              key={priority}
              value={priority}
              closeOnClick
              className={priorityFilterOptions[priority].colors.menuHighlight}
            >
              <EnumIconLabel option={priorityFilterOptions[priority]} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
