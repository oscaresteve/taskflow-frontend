"use client";

import { useTranslations } from "next-intl";
import { SearchInput } from "@/components/common/search-input";
import { AssigneeFilterSelect } from "@/components/tasks/assignee-filter-select";
import { DueDateFilterSelect } from "@/components/tasks/due-date-filter-select";
import { PriorityFilterSelect } from "@/components/tasks/priority-select";
import { StatusFilterSelect } from "@/components/tasks/status-filter-select";
import { DueDateFilter, PriorityFilter, StatusFilter } from "@/lib/task-enums";

export function KanbanFilterBar({
  workspaceSlug,
  projectSlug,
  search,
  onSearchChange,
  status,
  onStatusChange,
  assigneeId,
  onAssigneeChange,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
}: {
  workspaceSlug: string;
  projectSlug: string;
  search: string;
  onSearchChange: (value: string) => void;
  // El kanban ya reparte las tareas por estado en columnas, asi que solo la lista pasa el filtro.
  status?: StatusFilter;
  onStatusChange?: (value: StatusFilter) => void;
  assigneeId: string;
  onAssigneeChange: (value: string) => void;
  priority: PriorityFilter;
  onPriorityChange: (value: PriorityFilter) => void;
  dueDate: DueDateFilter;
  onDueDateChange: (value: DueDateFilter) => void;
}) {
  const t = useTranslations("tasks");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={t("kanbanFilterBar.searchPlaceholder")}
        className="w-48"
      />
      {status && onStatusChange && <StatusFilterSelect value={status} onValueChange={onStatusChange} />}
      <AssigneeFilterSelect
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        value={assigneeId}
        onChange={onAssigneeChange}
      />
      <PriorityFilterSelect value={priority} onValueChange={onPriorityChange} />
      <DueDateFilterSelect value={dueDate} onValueChange={onDueDateChange} />
    </div>
  );
}
