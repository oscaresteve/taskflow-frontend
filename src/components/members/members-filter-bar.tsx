"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchInput } from "@/components/common/search-input";
import { RoleFilter, roleFilters } from "@/lib/role-labels";
import { RoleIconLabel } from "@/components/members/role-badge";

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
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput value={search} onChange={onSearchChange} placeholder="Search members" className="w-48" />
      <Select value={roleFilter} onValueChange={(value) => value && onRoleFilterChange(value as RoleFilter)}>
        <SelectTrigger>
          <SelectValue>{(selected: RoleFilter) => <RoleIconLabel role={selected} />}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {roleFilters.map((role) => (
            <SelectItem key={role} value={role}>
              <RoleIconLabel role={role} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
