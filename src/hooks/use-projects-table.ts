import { sortOrders, SortOrder } from "@/lib/dtos/pagination.dto";
import { workspaceSortFields, WorkspaceSortField } from "@/lib/workspace-enums";
import { useQueryStates, parseAsString, debounce, parseAsStringLiteral, parseAsInteger } from "nuqs";
import { useDebouncedValue } from "./use-debounced-value";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

export default function useProjectsTable() {
  const [{ search, sort, order, limit, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) }),
    sort: parseAsStringLiteral(workspaceSortFields).withDefault("name"),
    order: parseAsStringLiteral(sortOrders).withDefault("asc"),
    limit: parseAsInteger.withDefault(PAGE_SIZE_OPTIONS[0]),
    page: parseAsInteger.withDefault(1),
  });

  const searchParam = useDebouncedValue(search) || undefined;

  function onSearchChange(value: string) {
    setQuery({ search: value, page: 1 });
  }

  function onSortFieldChange(value: WorkspaceSortField) {
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
    sort,
    order,
    limit,
    page,
    searchParam,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    onSearchChange,
    onSortFieldChange,
    onSortOrderChange,
    onLimitChange,
    onPageChange,
  };
}
