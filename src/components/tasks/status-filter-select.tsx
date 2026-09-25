"use client";

import { EnumControl, EnumIconLabel } from "@/components/common/enum-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusFilter, statusFilterOptions, statusFilters } from "@/lib/task-enums";

export function StatusFilterSelect({
  value,
  onValueChange,
}: {
  value: StatusFilter;
  onValueChange: (value: StatusFilter) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<EnumControl option={statusFilterOptions[value]} />} />
      <DropdownMenuContent className="min-w-max">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as StatusFilter)}>
          {statusFilters.map((filter) => (
            <DropdownMenuRadioItem
              key={filter}
              value={filter}
              closeOnClick
              className={statusFilterOptions[filter].colors.menuHighlight}
            >
              <EnumIconLabel option={statusFilterOptions[filter]} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
