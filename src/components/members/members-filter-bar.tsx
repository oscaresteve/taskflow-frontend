"use client";

import { SearchInput } from "@/components/common/search-input";
import { RoleFilter } from "@/lib/member-enums";
import { RoleFilterSelect } from "@/components/members/role-select";
import { useTranslations } from "next-intl";

export function MembersFilterBar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (value: RoleFilter) => void;
}) {
  const t = useTranslations("members");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={t("membersFilterBar.searchPlaceholder")}
        className="w-48"
      />
      <RoleFilterSelect value={roleFilter} onValueChange={onRoleFilterChange} />
    </div>
  );
}
