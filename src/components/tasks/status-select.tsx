"use client";

import { EnumBadge, EnumControl, EnumIconControl, EnumIconLabel } from "@/components/common/enum-display";
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
  variant?: "badge" | "default" | "icon";
  value: TaskStatus;
  onValueChange: (value: TaskStatus) => void;
  className?: string;
}

export function StatusSelect({ id, variant = "default", value, onValueChange, className }: StatusSelectProps) {
  return (
    <DropdownMenu>
      {variant === "icon" ? (
        <DropdownMenuTrigger id={id} render={<EnumIconControl option={statusOptions[value]} className={className} />} />
      ) : variant === "badge" ? (
        <DropdownMenuTrigger
          id={id}
          className={cn(
            "flex w-fit cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <EnumBadge option={statusOptions[value]} interactive />
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger id={id} render={<EnumControl option={statusOptions[value]} className={className} />} />
      )}

      <DropdownMenuContent>
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
