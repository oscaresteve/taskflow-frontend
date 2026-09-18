import { debounce, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { SortOrder, sortOrders } from "@/lib/dtos/pagination.dto";
import { MemberSortField, RoleFilter, memberSortFields, roleFilters } from "@/lib/member-enums";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

export function useMemberTable() {
  const [{ search, role: roleFilter, sort, order, limit, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) }),
    role: parseAsStringLiteral(roleFilters).withDefault("ALL"),
    sort: parseAsStringLiteral(memberSortFields).withDefault("joinedAt"),
    order: parseAsStringLiteral(sortOrders).withDefault("asc"),
    limit: parseAsInteger.withDefault(PAGE_SIZE_OPTIONS[0]),
    page: parseAsInteger.withDefault(1),
  });

  const role = roleFilter === "ALL" ? undefined : roleFilter;
  const searchParam = useDebouncedValue(search) || undefined;

  function onSearchChange(value: string) {
    setQuery({ search: value, page: 1 });
  }

  function onRoleFilterChange(value: RoleFilter) {
    setQuery({ role: value, page: 1 });
  }

  function onSortFieldChange(value: MemberSortField) {
    setQuery({ sort: value, page: 1 });
  }

  function onSortOrderChange(value: SortOrder) {
    setQuery({ order: value, page: 1 });
  }

  function onLimitChange(value: number) {
    setQuery({ limit: value, page: 1 });
  }

  function onPageChange(value: number) {
    setQuery({ page: value });
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
    onPageChange,
  };
}
