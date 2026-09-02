"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search members"
          className="w-48 pl-8 pr-7"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search ? (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onSearchChange("")}
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>
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
