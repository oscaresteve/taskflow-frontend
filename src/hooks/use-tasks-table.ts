import { debounce, parseAsBoolean, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { sortOrders, SortOrder } from "@/lib/dtos/pagination.dto";
import {
  ALL_ASSIGNEES,
  DueDateFilter,
  dueDateFilters,
  PriorityFilter,
  priorityFilters,
  TaskSortField,
  taskSortFields,
} from "@/lib/task-enums";

const PAGE_SIZE_OPTIONS = [10, 15, 20];

export function useTasksTable() {
  const [{ search, assigneeId, priority, dueDate, isFavorite, sort, order, limit, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) }),
    assigneeId: parseAsString.withDefault(ALL_ASSIGNEES),
    priority: parseAsStringLiteral(priorityFilters).withDefault("ALL"),
    dueDate: parseAsStringLiteral(dueDateFilters).withDefault("ALL"),
    isFavorite: parseAsBoolean.withDefault(false),
    sort: parseAsStringLiteral(taskSortFields).withDefault("rank"),
    order: parseAsStringLiteral(sortOrders).withDefault("asc"),
    limit: parseAsInteger.withDefault(PAGE_SIZE_OPTIONS[0]),
    page: parseAsInteger.withDefault(1),
  });

  const debouncedSearch = useDebouncedValue(search);

  function onSearchChange(value: string) {
    setQuery({ search: value, page: 1 });
  }

  function onAssigneeChange(value: string) {
    setQuery({ assigneeId: value, page: 1 });
  }

  function onPriorityChange(value: PriorityFilter) {
    setQuery({ priority: value, page: 1 });
  }

  function onDueDateChange(value: DueDateFilter) {
    setQuery({ dueDate: value, page: 1 });
  }

  function onFavoriteChange(value: boolean) {
    setQuery({ isFavorite: value, page: 1 });
  }

  function onSortFieldChange(value: TaskSortField) {
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
    assigneeId,
    priority,
    dueDate,
    isFavorite,
    sort,
    order,
    limit,
    page,
    debouncedSearch,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    onSearchChange,
    onAssigneeChange,
    onPriorityChange,
    onDueDateChange,
    onFavoriteChange,
    onSortFieldChange,
    onSortOrderChange,
    onLimitChange,
    onPageChange,
  };
}
