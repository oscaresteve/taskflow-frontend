"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleFilter, roleFilterLabels, roleFilters } from "@/lib/member-role-filter";

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
    <div className="flex items-center gap-2">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search members"
          className="w-48 pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={roleFilter} onValueChange={(value) => onRoleFilterChange(value as RoleFilter)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roleFilters.map((role) => (
            <SelectItem key={role} value={role}>
              {roleFilterLabels[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
