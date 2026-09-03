"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchInput } from "@/components/common/search-input";
import { RoleFilter, roleFilterLabels, roleFilters } from "@/lib/member-role-filter";

export function MembersFilterBar<TStatus extends string>({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (value: RoleFilter) => void;
  statusFilter: TStatus;
  onStatusFilterChange: (value: TStatus) => void;
  statusOptions: { value: TStatus; label: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput value={search} onChange={onSearchChange} placeholder="Search members" className="w-48" />
      <Select value={roleFilter} onValueChange={(value) => value && onRoleFilterChange(value as RoleFilter)}>
        <SelectTrigger>
          <SelectValue>{(selected: RoleFilter) => roleFilterLabels[selected]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {roleFilters.map((role) => (
            <SelectItem key={role} value={role}>
              {roleFilterLabels[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={(value) => value && onStatusFilterChange(value as TStatus)}>
        <SelectTrigger>
          <SelectValue>
            {(selected: TStatus) => statusOptions.find((option) => option.value === selected)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
