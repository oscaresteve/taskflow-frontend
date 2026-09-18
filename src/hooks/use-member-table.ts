import { useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { RoleFilter } from "@/lib/member-enums";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

export type MemberSortField = "joinedAt" | "createdAt" | "updatedAt";

export function useMemberTable() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [sort, setSort] = useState<MemberSortField>("joinedAt");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);

  const role = roleFilter === "ALL" ? undefined : roleFilter;
  const searchParam = debouncedSearch || undefined;

  function onSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function onRoleFilterChange(value: RoleFilter) {
    setRoleFilter(value);
    setPage(1);
  }

  function onSortFieldChange(value: MemberSortField) {
    setSort(value);
    setPage(1);
  }

  function onSortOrderChange(value: SortOrder) {
    setOrder(value);
    setPage(1);
  }

  function onLimitChange(value: number) {
    setLimit(value);
    setPage(1);
  }

  return {
    search,
    roleFilter,
    sort,
    order,
    limit,
    page,
    role,
    searchParam,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    onSearchChange,
    onRoleFilterChange,
    onSortFieldChange,
    onSortOrderChange,
    onLimitChange,
    onPageChange: setPage,
  };
}
