"use client";

import { EnumBadge, EnumControl, EnumIconBadge, EnumIconLabel } from "@/components/common/enum-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskPriority } from "@/lib/dtos/tasks.dto";
import { taskPriorities } from "@/lib/schemas/task.schema";
import { priorityOptions } from "@/lib/task-enums";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface PrioritySelectProps {
  id?: string;
  variant?: "badge" | "control" | "icon-badge";
  value: TaskPriority;
  onValueChange: (value: TaskPriority) => void;
  className?: string;
}

export function PrioritySelect({ id, variant = "control", value, onValueChange, className }: PrioritySelectProps) {
  const t = useTranslations("tasks");
  const tEnum = useTranslations();
  return (
    <DropdownMenu>
      {variant === "control" ? (
        <DropdownMenuTrigger id={id} render={<EnumControl option={priorityOptions[value]} className={className} />} />
      ) : (
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
            {variant === "icon-badge" ? (
              <EnumIconBadge option={priorityOptions[value]} interactive />
            ) : (
              <EnumBadge option={priorityOptions[value]} interactive />
            )}
          </TooltipTrigger>
          <TooltipContent>{`${t("fields.priority")}: ${tEnum(priorityOptions[value].labelKey)}`}</TooltipContent>
        </Tooltip>
      )}

      <DropdownMenuContent className="w-max">
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
