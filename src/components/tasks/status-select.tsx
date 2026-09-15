"use client";

import { EnumBadge, EnumControl, EnumIconBadge, EnumIconLabel } from "@/components/common/enum-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskStatus } from "@/lib/dtos/tasks.dto";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { statusOptions } from "@/lib/task-enums";
import { cn } from "@/lib/utils";

interface StatusSelectProps {
  id?: string;
  variant?: "badge" | "control" | "icon-badge";
  value: TaskStatus;
  onValueChange: (value: TaskStatus) => void;
  className?: string;
}

export function StatusSelect({ id, variant = "control", value, onValueChange, className }: StatusSelectProps) {
  return (
    <DropdownMenu>
      {variant === "control" ? (
        <DropdownMenuTrigger id={id} render={<EnumControl option={statusOptions[value]} className={className} />} />
      ) : (
        <DropdownMenuTrigger
          id={id}
          className={cn(
            "flex w-fit cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          {variant === "icon-badge" ? (
            <EnumIconBadge option={statusOptions[value]} interactive />
          ) : (
            <EnumBadge option={statusOptions[value]} interactive />
          )}
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent className="w-max">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as TaskStatus)}>
          {taskStatuses.map((status) => (
            <DropdownMenuRadioItem
              key={status}
              value={status}
              closeOnClick
              className={statusOptions[status].colors.menuHighlight}
            >
              <EnumIconLabel option={statusOptions[status]} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
