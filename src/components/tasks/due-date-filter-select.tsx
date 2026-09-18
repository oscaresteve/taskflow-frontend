"use client";

import { EnumControl, EnumIconLabel } from "@/components/common/enum-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DueDateFilter, dueDateFilterOptions, dueDateFilters } from "@/lib/task-enums";

export function DueDateFilterSelect({
  value,
  onValueChange,
}: {
  value: DueDateFilter;
  onValueChange: (value: DueDateFilter) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<EnumControl option={dueDateFilterOptions[value]} />} />
      <DropdownMenuContent className="min-w-max">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as DueDateFilter)}>
          {dueDateFilters.map((filter) => (
            <DropdownMenuRadioItem
              key={filter}
              value={filter}
              closeOnClick
              className={dueDateFilterOptions[filter].colors.menuHighlight}
            >
              <EnumIconLabel option={dueDateFilterOptions[filter]} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
