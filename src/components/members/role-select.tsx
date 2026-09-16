"use client";

import { EnumBadge, EnumControl, EnumIconLabel } from "@/components/common/enum-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { MemberRole } from "@/lib/dtos/members.dto";
import { RoleFilter, roleFilterOptions, roleFilters, roleOptions } from "@/lib/member-enums";
import { cn } from "@/lib/utils";

interface RoleSelectProps {
  id?: string;
  variant?: "badge" | "control";
  className?: string;
  value: MemberRole;
  values: MemberRole[];
  onValueChange: (value: MemberRole) => void;
}

export function RoleSelect({ id, variant = "control", className, value, values, onValueChange }: RoleSelectProps) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      {variant === "control" ? (
        <DropdownMenuTrigger id={id} render={<EnumControl option={roleOptions[value]} className={className} />} />
      ) : (
        <DropdownMenuTrigger
          id={id}
          className={cn(
            "flex w-fit cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <EnumBadge option={roleOptions[value]} interactive />
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent className="w-64">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as MemberRole)}>
          {values.map((role) => (
            <DropdownMenuRadioItem
              key={role}
              value={role}
              closeOnClick
              className={roleOptions[role].colors.menuHighlight}
            >
              <div className="flex min-w-0 flex-col gap-0.5 py-0.5">
                <EnumIconLabel option={roleOptions[role]} />
                {roleOptions[role].descriptionKey ? (
                  <span className="text-xs text-wrap text-muted-foreground">
                    {t(roleOptions[role].descriptionKey)}
                  </span>
                ) : null}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RoleFilterSelect({
  value,
  onValueChange,
}: {
  value: RoleFilter;
  onValueChange: (value: RoleFilter) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<EnumControl option={roleFilterOptions[value]} />} />
      <DropdownMenuContent className="w-max">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onValueChange(next as RoleFilter)}>
          {roleFilters.map((role) => (
            <DropdownMenuRadioItem
              key={role}
              value={role}
              closeOnClick
              className={roleFilterOptions[role].colors.menuHighlight}
            >
              <EnumIconLabel option={roleFilterOptions[role]} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
