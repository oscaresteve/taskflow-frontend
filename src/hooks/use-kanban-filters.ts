import { debounce, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ALL_ASSIGNEES, DueDateFilter, PriorityFilter, dueDateFilters, priorityFilters } from "@/lib/task-enums";

export function useKanbanFilters() {
  const [{ search, assigneeId, priority, dueDate }, setQuery] = useQueryStates({
    search: parseAsString.withDefault("").withOptions({ limitUrlUpdates: debounce(300) }),
    assigneeId: parseAsString.withDefault(ALL_ASSIGNEES),
    priority: parseAsStringLiteral(priorityFilters).withDefault("ALL"),
    dueDate: parseAsStringLiteral(dueDateFilters).withDefault("ALL"),
  });

  const debouncedSearch = useDebouncedValue(search);

  function onSearchChange(value: string) {
    setQuery({ search: value });
  }

  function onAssigneeChange(value: string) {
    setQuery({ assigneeId: value });
  }

  function onPriorityChange(value: PriorityFilter) {
    setQuery({ priority: value });
  }

  function onDueDateChange(value: DueDateFilter) {
    setQuery({ dueDate: value });
  }

  return {
    search,
    assigneeId,
    priority,
    dueDate,
    debouncedSearch,
    onSearchChange,
    onAssigneeChange,
    onPriorityChange,
    onDueDateChange,
  };
}
